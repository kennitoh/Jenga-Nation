-- =====================================================================
-- Jenga Nation - Migration 002b: make the backend work
--
-- Requires 001 and 002a to have been applied. Changes NO app code:
-- everything here is tables, triggers, policies and functions that the
-- existing screens keep working with, and the new features plug into.
--
-- Adds:
--   * issue_timeline filled automatically (Received -> Verified ->
--     In Progress -> Completed) on every status change
--   * notifications created automatically on status change
--   * issue_votes, issue_verifications, comments with server-side counts
--   * points + level awarded by the server (clients cannot touch them)
--   * profile created automatically at signup (only if you have no
--     signup trigger already)
--   * storage rules for the private verification-docs bucket
--   * review_verification() so verifiers can approve/reject officials
--   * location columns on issues (lat/lng, county, ward, subcategory)
--   * platform_stats / issues_by_* views for live metrics
--   * policies for issue_timeline and project_contributors
--     (they had RLS on and no policies, so nothing could use them)
--
-- One transaction: if anything fails, nothing is applied. Safe to re-run.
-- =====================================================================

begin;

-- ---------------------------------------------------------------------
-- 1. Extra columns on issues (additive, all nullable)
-- ---------------------------------------------------------------------
alter table public.issues
  add column if not exists latitude            double precision,
  add column if not exists longitude           double precision,
  add column if not exists county              text,
  add column if not exists constituency        text,
  add column if not exists ward                text,
  add column if not exists subcategory         text,
  add column if not exists verifications_count integer not null default 0;

do $$ begin
  if not exists (select 1 from pg_constraint where conname = 'issues_lat_range') then
    alter table public.issues add constraint issues_lat_range
      check (latitude is null or latitude between -90 and 90);
  end if;
  if not exists (select 1 from pg_constraint where conname = 'issues_lng_range') then
    alter table public.issues add constraint issues_lng_range
      check (longitude is null or longitude between -180 and 180);
  end if;
end $$;

create index if not exists issues_status_idx   on public.issues (status);
create index if not exists issues_county_idx   on public.issues (county);
create index if not exists issues_reporter_idx on public.issues (reporter_id);
create index if not exists issue_timeline_issue_idx on public.issue_timeline (issue_id);

-- ---------------------------------------------------------------------
-- 2. Points: only the server awards them
-- ---------------------------------------------------------------------
create or replace function public.award_points(uid uuid, pts integer)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  if uid is null or pts = 0 then return; end if;
  update public.profiles
     set points = coalesce(points, 0) + pts,
         level  = greatest(1, 1 + (coalesce(points, 0) + pts) / 200)
   where id = uid;
end;
$$;
revoke all on function public.award_points(uuid, integer) from public, anon, authenticated;

-- ---------------------------------------------------------------------
-- 3. Notifications
-- ---------------------------------------------------------------------
create table if not exists public.notifications (
  id         bigint generated always as identity primary key,
  user_id    uuid not null references auth.users(id) on delete cascade,
  type       text not null default 'info',
  title      text not null,
  body       text,
  issue_id   bigint references public.issues(id) on delete cascade,
  is_read    boolean not null default false,
  created_at timestamptz not null default now()
);
create index if not exists notifications_user_idx
  on public.notifications (user_id, is_read, created_at desc);

alter table public.notifications enable row level security;
drop policy if exists "Users read own notifications"   on public.notifications;
drop policy if exists "Users update own notifications" on public.notifications;
drop policy if exists "Users delete own notifications" on public.notifications;

create policy "Users read own notifications" on public.notifications
  for select to authenticated using (auth.uid() = user_id);
create policy "Users update own notifications" on public.notifications
  for update to authenticated using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "Users delete own notifications" on public.notifications
  for delete to authenticated using (auth.uid() = user_id);

-- Clients may only flip is_read. Creating notifications is server-only.
revoke all on public.notifications from anon, authenticated;
grant select, delete on public.notifications to authenticated;
grant update (is_read) on public.notifications to authenticated;

create or replace function public.notify(uid uuid, kind text, ttl text, msg text, iid bigint)
returns void
language sql
security definer
set search_path = public
as $$
  insert into public.notifications (user_id, type, title, body, issue_id)
  select uid, kind, ttl, msg, iid where uid is not null;
$$;
revoke all on function public.notify(uuid, text, text, text, bigint) from public, anon, authenticated;

-- ---------------------------------------------------------------------
-- 4. Issue lifecycle: timeline rows + notifications + reporter points
-- ---------------------------------------------------------------------
create or replace function public.status_label(s text)
returns text
language sql
immutable
as $$
  select case s
    when 'Pending'     then 'Received'
    when 'Active'      then 'Verified'
    when 'In Progress' then 'In Progress'
    when 'Resolved'    then 'Completed'
    else s
  end;
$$;

-- 4a. Anti-spam: at most 20 reports per signed-in user per 24 hours.
create or replace function public.limit_issue_rate()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if new.reporter_id is not null
     and (select count(*) from public.issues
          where reporter_id = new.reporter_id
            and created_at > now() - interval '24 hours') >= 20 then
    raise exception 'Report limit reached (20 per day). Please try again tomorrow.'
      using errcode = 'P0001';
  end if;
  return new;
end;
$$;
drop trigger if exists issues_rate_limit on public.issues;
create trigger issues_rate_limit before insert on public.issues
  for each row execute function public.limit_issue_rate();

-- 4b. New report: timeline "Received", reporter credit.
create or replace function public.on_issue_created()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.issue_timeline (issue_id, status, date, completed)
  values (new.id, public.status_label(new.status::text), now(), true);

  if new.reporter_id is not null then
    update public.profiles
       set reports_count = coalesce(reports_count, 0) + 1
     where id = new.reporter_id;
    perform public.award_points(new.reporter_id, 10);
    perform public.notify(new.reporter_id, 'report',
      'Report received',
      'Thanks for reporting "' || new.title || '". A moderator will review it shortly.',
      new.id);
  end if;
  return new;
end;
$$;
drop trigger if exists issues_after_insert on public.issues;
create trigger issues_after_insert after insert on public.issues
  for each row execute function public.on_issue_created();

-- 4c. Status change: timeline row + notify the reporter.
create or replace function public.on_issue_status_changed()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  msg text;
begin
  insert into public.issue_timeline (issue_id, status, date, completed)
  values (new.id, public.status_label(new.status::text), now(), true);

  msg := case new.status::text
    when 'Active'      then 'Your report was approved and is now public.'
    when 'In Progress' then 'Work has started on your report.'
    when 'Resolved'    then 'Your report has been marked as resolved.'
    when 'Rejected'    then 'Your report was not approved by the moderators.'
    else 'The status of your report changed to ' || new.status::text || '.'
  end;

  perform public.notify(new.reporter_id, 'status',
    'Update on "' || new.title || '"', msg, new.id);
  return new;
end;
$$;
drop trigger if exists issues_after_status_change on public.issues;
create trigger issues_after_status_change after update of status on public.issues
  for each row when (old.status is distinct from new.status)
  execute function public.on_issue_status_changed();

-- 4d. Backfill timeline for issues that have none.
insert into public.issue_timeline (issue_id, status, date, completed)
select i.id, public.status_label(i.status::text), coalesce(i.date, i.created_at, now()), true
from public.issues i
where not exists (select 1 from public.issue_timeline t where t.issue_id = i.id);

-- 4e. issue_timeline: readable wherever the issue is readable; written
--     only by the triggers above.
alter table public.issue_timeline enable row level security;
drop policy if exists "Timeline follows issue visibility" on public.issue_timeline;
create policy "Timeline follows issue visibility" on public.issue_timeline
  for select using (exists (select 1 from public.issues i where i.id = issue_id));
revoke all on public.issue_timeline from anon, authenticated;
grant select on public.issue_timeline to anon, authenticated;

-- ---------------------------------------------------------------------
-- 5. Issue votes ("support this report")
-- ---------------------------------------------------------------------
create table if not exists public.issue_votes (
  issue_id   bigint not null references public.issues(id) on delete cascade,
  user_id    uuid   not null references auth.users(id)    on delete cascade,
  created_at timestamptz not null default now(),
  primary key (issue_id, user_id)
);
alter table public.issue_votes enable row level security;
drop policy if exists "Users read own issue votes"   on public.issue_votes;
drop policy if exists "Users vote on visible issues" on public.issue_votes;
drop policy if exists "Users remove own issue vote"  on public.issue_votes;

create policy "Users read own issue votes" on public.issue_votes
  for select to authenticated using (auth.uid() = user_id);
create policy "Users vote on visible issues" on public.issue_votes
  for insert to authenticated
  with check (auth.uid() = user_id and exists (select 1 from public.issues i where i.id = issue_id));
create policy "Users remove own issue vote" on public.issue_votes
  for delete to authenticated using (auth.uid() = user_id);

revoke all on public.issue_votes from anon, authenticated;
grant select, insert, delete on public.issue_votes to authenticated;

create or replace function public.apply_issue_vote()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if tg_op = 'INSERT' then
    update public.issues set upvotes = coalesce(upvotes, 0) + 1 where id = new.issue_id;
    return new;
  else
    update public.issues set upvotes = greatest(coalesce(upvotes, 0) - 1, 0) where id = old.issue_id;
    return old;
  end if;
end;
$$;
drop trigger if exists issue_votes_count on public.issue_votes;
create trigger issue_votes_count after insert or delete on public.issue_votes
  for each row execute function public.apply_issue_vote();

-- ---------------------------------------------------------------------
-- 6. Community verification ("I can confirm this")
-- ---------------------------------------------------------------------
create table if not exists public.issue_verifications (
  issue_id   bigint not null references public.issues(id) on delete cascade,
  user_id    uuid   not null references auth.users(id)    on delete cascade,
  created_at timestamptz not null default now(),
  primary key (issue_id, user_id)
);
alter table public.issue_verifications enable row level security;
drop policy if exists "Users read own verifications" on public.issue_verifications;
drop policy if exists "Users verify visible issues"  on public.issue_verifications;

create policy "Users read own verifications" on public.issue_verifications
  for select to authenticated using (auth.uid() = user_id);
create policy "Users verify visible issues" on public.issue_verifications
  for insert to authenticated
  with check (auth.uid() = user_id and exists (select 1 from public.issues i where i.id = issue_id));

revoke all on public.issue_verifications from anon, authenticated;
grant select, insert on public.issue_verifications to authenticated;

create or replace function public.apply_issue_verification()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  owner uuid;
begin
  select reporter_id into owner from public.issues where id = new.issue_id;
  if owner is not null and owner = new.user_id then
    raise exception 'You cannot verify your own report.' using errcode = 'P0001';
  end if;
  update public.issues set verifications_count = verifications_count + 1 where id = new.issue_id;
  perform public.award_points(new.user_id, 3);
  return new;
end;
$$;
drop trigger if exists issue_verifications_count on public.issue_verifications;
create trigger issue_verifications_count before insert on public.issue_verifications
  for each row execute function public.apply_issue_verification();

-- ---------------------------------------------------------------------
-- 7. Comments and official responses
-- ---------------------------------------------------------------------
create table if not exists public.comments (
  id          bigint generated always as identity primary key,
  issue_id    bigint not null references public.issues(id) on delete cascade,
  user_id     uuid   not null references auth.users(id)    on delete cascade,
  body        text   not null check (char_length(body) between 1 and 2000),
  is_official boolean not null default false,
  created_at  timestamptz not null default now()
);
create index if not exists comments_issue_idx on public.comments (issue_id, created_at);

alter table public.comments enable row level security;
drop policy if exists "Comments follow issue visibility" on public.comments;
drop policy if exists "Users comment as themselves"      on public.comments;
drop policy if exists "Users delete own comments"        on public.comments;

create policy "Comments follow issue visibility" on public.comments
  for select using (exists (select 1 from public.issues i where i.id = issue_id));
create policy "Users comment as themselves" on public.comments
  for insert to authenticated
  with check (
    auth.uid() = user_id
    and exists (select 1 from public.issues i where i.id = issue_id)
    and (is_official = false
         or public.has_admin_role(array['verifier', 'project_manager', 'national_admin']))
  );
create policy "Users delete own comments" on public.comments
  for delete to authenticated using (auth.uid() = user_id);

revoke all on public.comments from anon, authenticated;
grant select on public.comments to anon, authenticated;
grant insert, delete on public.comments to authenticated;

create or replace function public.apply_comment()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  owner uuid;
  ttl text;
begin
  if tg_op = 'INSERT' then
    update public.issues set comments_count = coalesce(comments_count, 0) + 1 where id = new.issue_id;
    perform public.award_points(new.user_id, 2);
    if new.is_official then
      select reporter_id, title into owner, ttl from public.issues where id = new.issue_id;
      if owner is not null and owner <> new.user_id then
        perform public.notify(owner, 'response', 'Official response on "' || ttl || '"', left(new.body, 200), new.issue_id);
      end if;
    end if;
    return new;
  else
    update public.issues set comments_count = greatest(coalesce(comments_count, 0) - 1, 0) where id = old.issue_id;
    return old;
  end if;
end;
$$;
drop trigger if exists comments_count on public.comments;
create trigger comments_count after insert or delete on public.comments
  for each row execute function public.apply_comment();

-- ---------------------------------------------------------------------
-- 8. Poll votes also earn points (tally trigger is in migration 001)
-- ---------------------------------------------------------------------
create or replace function public.award_poll_vote_points()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  perform public.award_points(new.user_id, 5);
  return new;
end;
$$;
drop trigger if exists poll_votes_points on public.poll_votes;
create trigger poll_votes_points after insert on public.poll_votes
  for each row execute function public.award_poll_vote_points();

-- ---------------------------------------------------------------------
-- 9. Signup: create the profile on the server. Skipped automatically
--    if you already have a trigger on auth.users.
-- ---------------------------------------------------------------------
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  meta jsonb := coalesce(new.raw_user_meta_data, '{}'::jsonb);
begin
  insert into public.profiles (id, name, email, role, county, interests, is_profile_complete)
  values (
    new.id,
    coalesce(nullif(meta ->> 'name', ''), split_part(new.email, '@', 1)),
    new.email,
    coalesce(nullif(meta ->> 'role', ''), 'citizen'),
    nullif(meta ->> 'county', ''),
    case when jsonb_typeof(meta -> 'interests') = 'array'
         then array(select jsonb_array_elements_text(meta -> 'interests'))
         else null end,
    false
  )
  on conflict (id) do nothing;
  -- admin_role and verification_status are never taken from signup data.
  return new;
end;
$$;

do $$
begin
  if exists (select 1 from pg_trigger
             where tgrelid = 'auth.users'::regclass and not tgisinternal
               and tgname <> 'on_auth_user_created') then
    raise notice 'auth.users already has a trigger; leaving signup as it is';
  else
    drop trigger if exists on_auth_user_created on auth.users;
    create trigger on_auth_user_created after insert on auth.users
      for each row execute function public.handle_new_user();
  end if;
end $$;

-- ---------------------------------------------------------------------
-- 10. Storage: private verification-docs bucket.
--     The app names files "<user-id>-<type>-<random>.<ext>".
-- ---------------------------------------------------------------------
drop policy if exists "Users upload own verification files" on storage.objects;
drop policy if exists "Users read own verification files"   on storage.objects;
drop policy if exists "Verifiers read verification files"   on storage.objects;

create policy "Users upload own verification files" on storage.objects
  for insert to authenticated
  with check (bucket_id = 'verification-docs' and name like auth.uid()::text || '-%');

create policy "Users read own verification files" on storage.objects
  for select to authenticated
  using (bucket_id = 'verification-docs' and name like auth.uid()::text || '-%');

create policy "Verifiers read verification files" on storage.objects
  for select to authenticated
  using (bucket_id = 'verification-docs'
         and public.has_admin_role(array['verifier', 'national_admin']));

-- ---------------------------------------------------------------------
-- 11. Verification review (approve / reject an institution or official)
-- ---------------------------------------------------------------------
create or replace function public.review_verification(target uuid, approve boolean)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  reject_label text;
begin
  if not public.has_admin_role(array['verifier', 'national_admin']) then
    raise exception 'Only verifiers can review verification requests.' using errcode = '42501';
  end if;

  if approve then
    update public.profiles set verification_status = 'verified' where id = target;
    perform public.notify(target, 'verification', 'Account verified',
      'Your account has been verified. You can now post projects.', null);
  else
    select e.enumlabel into reject_label
    from pg_enum e join pg_type t on t.oid = e.enumtypid
    where t.typname = 'verification_state' and e.enumlabel in ('rejected', 'unverified')
    order by case e.enumlabel when 'rejected' then 0 else 1 end limit 1;

    if reject_label is null then
      raise exception 'verification_state has no rejected/unverified value';
    end if;
    execute format('update public.profiles set verification_status = %L::verification_state where id = $1', reject_label)
      using target;
    perform public.notify(target, 'verification', 'Verification not approved',
      'We could not verify your documents. Please resubmit clear copies.', null);
  end if;
end;
$$;
revoke all on function public.review_verification(uuid, boolean) from public, anon;
grant execute on function public.review_verification(uuid, boolean) to authenticated;

-- ---------------------------------------------------------------------
-- 12. Project backers
-- ---------------------------------------------------------------------
alter table public.project_contributors enable row level security;
drop policy if exists "Backers are public"        on public.project_contributors;
drop policy if exists "Users back projects"       on public.project_contributors;
drop policy if exists "Users stop backing"        on public.project_contributors;

create policy "Backers are public" on public.project_contributors for select using (true);
create policy "Users back projects" on public.project_contributors
  for insert to authenticated with check (auth.uid() = user_id);
create policy "Users stop backing" on public.project_contributors
  for delete to authenticated using (auth.uid() = user_id);

revoke all on public.project_contributors from anon, authenticated;
grant select on public.project_contributors to anon, authenticated;
grant insert, delete on public.project_contributors to authenticated;

-- user_badges: own rows readable if the table has a user_id column.
-- Badges themselves are awarded server-side (next migration).
do $$
begin
  if exists (select 1 from information_schema.columns
             where table_schema = 'public' and table_name = 'user_badges' and column_name = 'user_id') then
    execute 'revoke all on public.user_badges from anon, authenticated';
    execute 'grant select on public.user_badges to authenticated';
    execute 'drop policy if exists "Users read own badges" on public.user_badges';
    execute 'create policy "Users read own badges" on public.user_badges
               for select to authenticated using (auth.uid() = user_id)';
  end if;
end $$;

-- ---------------------------------------------------------------------
-- 13. Live metrics for Home, Analysis, Admin (counts only, no personal data)
-- ---------------------------------------------------------------------
create or replace view public.platform_stats as
select
  (select count(*) from public.issues
     where status::text not in ('Pending', 'Rejected', 'Resolved'))       as active_issues,
  (select count(*) from public.issues where status::text = 'Resolved')    as resolved_issues,
  (select count(*) from public.issues where status::text = 'Pending')     as pending_issues,
  (select count(*) from public.projects where status::text = 'Completed') as completed_projects,
  (select count(*) from public.projects where status::text = 'Active')    as active_projects,
  (select count(*) from public.profiles)                                  as citizens;

create or replace view public.issues_by_category as
select category, count(*) as total,
       count(*) filter (where status::text = 'Resolved') as resolved
from public.issues
where status::text not in ('Pending', 'Rejected')
group by category;

create or replace view public.issues_by_county as
select coalesce(county, 'Unspecified') as county, count(*) as total,
       count(*) filter (where status::text = 'Resolved') as resolved
from public.issues
where status::text not in ('Pending', 'Rejected')
group by coalesce(county, 'Unspecified');

grant select on public.platform_stats, public.issues_by_category, public.issues_by_county
  to anon, authenticated;

commit;
