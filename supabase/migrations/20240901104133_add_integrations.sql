create table
  public.integrations (
    id uuid not null default uuid_generate_v4 (),
    folder_id uuid null,
    name text not null,
    description text not null,
    icon text not null,
    created_at timestamp with time zone null default current_timestamp,
    active boolean not null default false,
    constraint integrations_pkey primary key (id)
  ) tablespace pg_default;