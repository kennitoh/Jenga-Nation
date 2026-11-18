-- =====================================================================
-- Jenga Nation - Migration 001: security hardening
--
-- Fixes, based on the policies/RLS status exported from Supabase:
--   1. Any user could make themselves admin / verified (profiles UPDATE).
--   2. Every profile (email, phone, dob, gender, admin_role) was public.
--   3. Anyone, even signed out, could insert issues with any status/votes.
--   4. Anyone could cast poll votes as any user, unlimited times.
--      Poll tallies were also never updated (no UPDATE policy on poll_options).
--   5. national_debt, national_revenue, county_allocations, public_loans
--      had RLS OFF: anyone with the anon key could edit or delete them.
--   6. Pending/rejected issues were visible to everyone.
--
-- Safe to re-run. Wrapped in one transaction: if anything fails, nothing
-- is applied. Run in the Supabase SQL editor (as the postgres role).
--
-- NOT in this migration (needs more info): storage.objects policies,
-- the `users` and `reports` tables, issue_timeline / user_badges /
-- project_contributors policies, signup trigger review.
-- =====================================================================

begin;

-- ---------------------------------------------------------------------
-- 0. Helper: does the current user hold one of these admin roles?
--    SECURITY DEFINER so it can read profiles without RLS recursion.
-- ---------------------------------------------------------------------
create or replace function public.has_admin_role(roles text[])
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.profiles p
    where p.id = auth.uid()
      and p.admin_role = any (roles)
  );
$$;

revoke all on function public.has_admin_role(text[]) from public;
grant execute on function public.has_admin_role(text[]) to anon, authenticated;

-- ---------------------------------------------------------------------
-- 1. PROFILES: stop privilege escalation and PII exposure
-- ---------------------------------------------------------------------

-- 1a. Block changes to privileged columns made directly by clients.
--     Dashboard / service role / SECURITY DEFINER functions are not
--     affected (current_user is not anon/authenticated for them).
create or replace function public.guard_profile_privileged_columns()
returns trigger
language plpgsql
set search_path = public
as $$
begin
  if current_user not in ('anon', 'authenticated') then
    return new;
  end if;

  if new.admin_role is distinct from old.admin_role
     and not public.has_admin_role(array['national_admin']) then
    raise exception 'admin_role can only be changed by a national admin'
      using errcode = '42501';
  end if;

  if new.verification_status is distinct from old.verification_status
     and not public.has_admin_role(array['verifier', 'national_admin']) then
    raise exception 'verification_status can only be changed by a verifier'
      using errcode = '42501';
  end if;

  if (new.id, new.points, new.level, new.reports_count, new.joined_date)
     is distinct from
     (old.id, old.points, old.level, old.reports_count, old.joined_date)
     and not public.has_admin_role(array['national_admin']) then
    raise exception 'points, level and counters are managed by the system'
      using errcode = '42501';
  end if;

  return new;
end;
$$;

drop trigger if exists guard_profile_privileged_columns on public.profiles;
create trigger guard_profile_privileged_columns
  before update on public.profiles
  for each row execute function public.guard_profile_privileged_columns();

-- 1b. Replace the policies.
drop policy if exists "Allow public read access" on public.profiles;
drop policy if exists "Allow public insert" on public.profiles;
drop policy if exists "Users can update own profile" on public.profiles;
drop policy if exists "Users read own profile" on public.profiles;
drop policy if exists "Admins read all profiles" on public.profiles;
drop policy if exists "Users insert own profile" on public.profiles;
drop policy if exists "Users update own profile" on public.profiles;
drop policy if exists "Verifiers update profiles" on public.profiles;

create policy "Users read own profile"
  on public.profiles for select
  using (auth.uid() = id);

create policy "Admins read all profiles"
  on public.profiles for select
  using (public.has_admin_role(array['verifier', 'project_manager', 'national_admin']));

-- Insert: the signup flow probably creates the profile from a trigger on
-- auth.users, where auth.uid() is null, so that case is still allowed for
-- now. Either way a new row can never carry admin or verified status.
-- TODO (migration 002): remove the "auth.uid() is null" branch once the
-- signup trigger has been reviewed.
create policy "Users insert own profile"
  on public.profiles for insert
  with check (
    (auth.uid() = id or auth.uid() is null)
    and admin_role is null
    and verification_status is distinct from 'verified'::verification_state
    and coalesce(points, 0) = 0
  );

create policy "Users update own profile"
  on public.profiles for update
  using (auth.uid() = id)
  with check (auth.uid() = id);

create policy "Verifiers update profiles"
  on public.profiles for update
  using (public.has_admin_role(array['verifier', 'national_admin']))
  with check (public.has_admin_role(array['verifier', 'national_admin']));

-- 1c. Safe, public subset of profiles (no email / phone / dob / gender /
--     admin_role). Use this for leaderboards, authors, directories.
--     Intentionally a definer view: it exposes only these columns.
create or replace view public.public_profiles as
  select id, name, avatar, county, role, level, points, verification_status
  from public.profiles;

grant select on public.public_profiles to anon, authenticated;

-- ---------------------------------------------------------------------
-- 2. ISSUES: signed-in users only, pending status, no fake votes;
--    unmoderated issues are no longer public.
-- ---------------------------------------------------------------------
drop policy if exists "Allow public insert" on public.issues;
drop policy if exists "Allow public read access" on public.issues;
drop policy if exists "Signed-in users create pending issues" on public.issues;
drop policy if exists "Public reads moderated issues" on public.issues;

-- reporter_id stays null for anonymous reports (the app already does this).
create policy "Signed-in users create pending issues"
  on public.issues for insert
  to authenticated
  with check (
    (reporter_id is null or reporter_id = auth.uid())
    and status::text = 'Pending'
    and coalesce(upvotes, 0) = 0
    and coalesce(comments_count, 0) = 0
  );

create policy "Public reads moderated issues"
  on public.issues for select
  using (
    coalesce(status::text, '') not in ('Pending', 'Rejected')
    or reporter_id = auth.uid()
    or public.has_admin_role(array['verifier', 'national_admin'])
  );

-- ---------------------------------------------------------------------
-- 3. POLLS: one vote per user, voting as yourself, server-side tallies
-- ---------------------------------------------------------------------
do $$
begin
  if exists (
    select 1 from public.poll_votes
    group by poll_id, user_id having count(*) > 1
  ) then
    raise exception
      'Duplicate votes exist in poll_votes (same user and poll). Clean them up, then re-run.';
  end if;

  if exists (
    select 1 from pg_trigger
    where tgrelid = 'public.poll_votes'::regclass and not tgisinternal
      and tgname not in ('poll_votes_apply', 'poll_votes_points')
  ) then
    raise exception
      'poll_votes already has a trigger. Send me the trigger list before applying this.';
  end if;
end $$;

create unique index if not exists poll_votes_one_per_user
  on public.poll_votes (poll_id, user_id);

drop policy if exists "Allow public insert" on public.poll_votes;
drop policy if exists "Users vote as themselves" on public.poll_votes;
drop policy if exists "Users read own votes" on public.poll_votes;

create policy "Users vote as themselves"
  on public.poll_votes for insert
  to authenticated
  with check (auth.uid() = user_id);

create policy "Users read own votes"
  on public.poll_votes for select
  to authenticated
  using (auth.uid() = user_id);

create or replace function public.apply_poll_vote()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if not exists (
    select 1 from public.poll_options
    where id = new.option_id and poll_id = new.poll_id
  ) then
    raise exception 'option % does not belong to poll %', new.option_id, new.poll_id;
  end if;

  update public.poll_options
    set votes = coalesce(votes, 0) + 1
    where id = new.option_id;

  update public.polls
    set total_votes = coalesce(total_votes, 0) + 1
    where id = new.poll_id;

  return new;
end;
$$;

drop trigger if exists poll_votes_apply on public.poll_votes;
create trigger poll_votes_apply
  after insert on public.poll_votes
  for each row execute function public.apply_poll_vote();

-- ---------------------------------------------------------------------
-- 4. FISCAL TABLES: public read-only. Write via dashboard / service role.
-- ---------------------------------------------------------------------
alter table public.national_debt       enable row level security;
alter table public.national_revenue    enable row level security;
alter table public.county_allocations  enable row level security;
alter table public.public_loans        enable row level security;

drop policy if exists "Public read" on public.national_debt;
drop policy if exists "Public read" on public.national_revenue;
drop policy if exists "Public read" on public.county_allocations;
drop policy if exists "Public read" on public.public_loans;

create policy "Public read" on public.national_debt      for select using (true);
create policy "Public read" on public.national_revenue   for select using (true);
create policy "Public read" on public.county_allocations for select using (true);
create policy "Public read" on public.public_loans       for select using (true);

revoke insert, update, delete on
  public.national_debt, public.national_revenue,
  public.county_allocations, public.public_loans
from anon, authenticated;

-- ---------------------------------------------------------------------
-- 5. VERIFICATION DOCUMENTS: let verifiers review submissions
-- ---------------------------------------------------------------------
drop policy if exists "Verifiers read verification docs" on public.verification_documents;
create policy "Verifiers read verification docs"
  on public.verification_documents for select
  using (public.has_admin_role(array['verifier', 'national_admin']));

commit;
