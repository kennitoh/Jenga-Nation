-- =====================================================================
-- Jenga Nation - Migration 002a: make sure the issue status enum has
-- every value the app writes.
--
-- RUN THIS ALONE, FIRST, as its own query (a new enum value cannot be
-- used in the same transaction that adds it). Then run 002b.
-- Safe to re-run; does nothing if the values already exist.
-- =====================================================================
do $$
declare
  enum_type text;
  v text;
begin
  select format('%I.%I', n.nspname, t.typname)
    into enum_type
  from pg_attribute a
  join pg_type t on t.oid = a.atttypid
  join pg_namespace n on n.oid = t.typnamespace
  where a.attrelid = 'public.issues'::regclass
    and a.attname = 'status'
    and t.typtype = 'e';

  if enum_type is null then
    raise notice 'issues.status is not an enum, nothing to do';
    return;
  end if;

  foreach v in array array['Pending', 'Active', 'In Progress', 'Resolved', 'Rejected'] loop
    execute format('alter type %s add value if not exists %L', enum_type, v);
  end loop;
end $$;
