-- Enable RLS
alter table auth.users enable row level security;

-- 1. PROFILES
create table public.profiles (
  id uuid not null references auth.users on delete cascade primary key,
  email text,
  role text default 'user' check (role in ('user', 'admin')),
  created_at timestamptz default now()
);

alter table public.profiles enable row level security;

create policy "Users can view own profile" on profiles
  for select using (auth.uid() = id);

create policy "Admins can view all profiles" on profiles
  for select using (
    exists (
      select 1 from profiles where id = auth.uid() and role = 'admin'
    )
  );
  
-- Trigger for automatic profile creation
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email)
  values (new.id, new.email);
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- 2. QUESTIONS
create table public.questions (
  id uuid default gen_random_uuid() primary key,
  question_text text not null,
  options jsonb not null, -- Array of strings
  correct_answer text not null,
  category text, -- 'Europe', 'Asia', etc.
  difficulty text default 'Beginner', -- 'Beginner', 'Intermediate', 'Professional'
  type text, -- 'capital', 'flag', etc.
  media_url text,
  created_at timestamptz default now()
);

alter table public.questions enable row level security;

create policy "Public can view questions" on questions
  for select to authenticated, anon using (true);

-- 3. SCORES
create table public.scores (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  score int not null,
  total int default 10,
  created_at timestamptz default now()
);

alter table public.scores enable row level security;

create policy "Users can view own scores" on scores
  for select using (auth.uid() = user_id);

create policy "Users can insert own scores" on scores
  for insert with check (auth.uid() = user_id);

create policy "Admins can view all scores" on scores
  for select using (
    exists (
      select 1 from profiles where id = auth.uid() and role = 'admin'
    )
  );
