-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- Tasks Table
create table tasks (
  id uuid default uuid_generate_v4() primary key,
  title text not null,
  description text,
  stress text check (stress in ('Low Stress', 'Med Stress', 'High Stress')),
  status text check (status in ('backlog', 'todo', 'in-progress', 'done')) default 'todo',
  due_date timestamp with time zone,
  assignee text,
  user_id uuid references auth.users(id),
  created_at timestamp with time zone default now()
);

-- Wellness Entries Table
create table wellness_entries (
  id uuid default uuid_generate_v4() primary key,
  timestamp timestamp with time zone default now(),
  mood int check (mood between 1 and 5),
  energy text check (energy in ('low', 'medium', 'high')),
  reflection text,
  user_id uuid references auth.users(id),
  created_at timestamp with time zone default now()
);

-- Work Logs Table
create table work_logs (
  id uuid default uuid_generate_v4() primary key,
  date text not null,
  start_time text not null,
  end_time text,
  duration text,
  status text check (status in ('active', 'completed', 'overworked')),
  user_id uuid references auth.users(id),
  created_at timestamp with time zone default now()
);

-- Row Level Security (RLS)
-- Enable RLS
alter table tasks enable row level security;
alter table wellness_entries enable row level security;
alter table work_logs enable row level security;

-- Policies (Assuming authenticated users can only see their own data)
-- Tasks
create policy "Users can view their own tasks" on tasks
  for select using (auth.uid() = user_id);

create policy "Users can insert their own tasks" on tasks
  for insert with check (auth.uid() = user_id);

create policy "Users can update their own tasks" on tasks
  for update using (auth.uid() = user_id);

create policy "Users can delete their own tasks" on tasks
  for delete using (auth.uid() = user_id);

-- Wellness
create policy "Users can view their own wellness entries" on wellness_entries
  for select using (auth.uid() = user_id);

create policy "Users can insert their own wellness entries" on wellness_entries
  for insert with check (auth.uid() = user_id);

-- Work Logs
create policy "Users can view their own work logs" on work_logs
  for select using (auth.uid() = user_id);

create policy "Users can insert their own work logs" on work_logs
  for insert with check (auth.uid() = user_id);

create policy "Users can update their own work logs" on work_logs
  for update using (auth.uid() = user_id);

-- FOR DEVELOPMENT ONLY: Allow anonymous access if you are not using Auth yet
-- Uncomment the following lines if you want to test without logging in (NOT RECOMMENDED FOR PRODUCTION)
-- create policy "Allow public access to tasks" on tasks for all using (true);
-- create policy "Allow public access to wellness" on wellness_entries for all using (true);
-- create policy "Allow public access to logs" on work_logs for all using (true);
