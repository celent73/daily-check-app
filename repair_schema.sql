-- Esegui questo script per RIPARARE il database.
-- Non cancellerà i dati se le tabelle esistono già, ma aggiungerà ciò che manca.

-- 1. Tabella PROFILES
create table if not exists profiles (
  id uuid references auth.users not null primary key,
  first_name text,
  last_name text,
  commission_status text default 'PRIVILEGIATO',
  current_qualification text,
  target_qualification text,
  updated_at timestamp with time zone default timezone('utc'::text, now())
);
alter table profiles enable row level security;

drop policy if exists "Public profiles are viewable by everyone" on profiles;
create policy "Public profiles are viewable by everyone" on profiles for select using ( true );

drop policy if exists "Users can insert their own profile" on profiles;
create policy "Users can insert their own profile" on profiles for insert with check ( auth.uid() = id );

drop policy if exists "Users can update their own profile" on profiles;
create policy "Users can update their own profile" on profiles for update using ( auth.uid() = id );

-- 2. Tabella USER_SETTINGS
create table if not exists user_settings (
  user_id uuid references auth.users not null primary key,
  theme text default 'light',
  goals jsonb default '{}'::jsonb,
  commercial_month_start_day int default 16,
  custom_labels jsonb default '{}'::jsonb,
  notification_settings jsonb default '{"goalReached": true, "milestones": true}'::jsonb,
  vision_board jsonb default '{"enabled": true, "title": "", "targetAmount": 1000, "imageData": null}'::jsonb,
  updated_at timestamp with time zone default timezone('utc'::text, now())
);
alter table user_settings enable row level security;

drop policy if exists "Users can view own settings" on user_settings;
create policy "Users can view own settings" on user_settings for select using ( auth.uid() = user_id );

drop policy if exists "Users can insert own settings" on user_settings;
create policy "Users can insert own settings" on user_settings for insert with check ( auth.uid() = user_id );

drop policy if exists "Users can update own settings" on user_settings;
create policy "Users can update own settings" on user_settings for update using ( auth.uid() = user_id );

-- 3. Tabella ACTIVITY_LOGS
create table if not exists activity_logs (
  user_id uuid references auth.users not null,
  date text not null,
  counts jsonb default '{}'::jsonb,
  contract_details jsonb default '{}'::jsonb,
  leads jsonb default '[]'::jsonb,
  updated_at timestamp with time zone default timezone('utc'::text, now()),
  primary key (user_id, date)
);
alter table activity_logs enable row level security;

drop policy if exists "Users can view own logs" on activity_logs;
create policy "Users can view own logs" on activity_logs for select using ( auth.uid() = user_id );

drop policy if exists "Users can insert own logs" on activity_logs;
create policy "Users can insert own logs" on activity_logs for insert with check ( auth.uid() = user_id );

drop policy if exists "Users can update own logs" on activity_logs;
create policy "Users can update own logs" on activity_logs for update using ( auth.uid() = user_id );

drop policy if exists "Users can delete own logs" on activity_logs;
create policy "Users can delete own logs" on activity_logs for delete using ( auth.uid() = user_id );

-- 4. Tabella ACHIEVEMENTS
create table if not exists achievements (
  user_id uuid references auth.users not null primary key,
  unlocked_achievements jsonb default '{}'::jsonb,
  updated_at timestamp with time zone default timezone('utc'::text, now())
);
alter table achievements enable row level security;

drop policy if exists "Users can view own achievements" on achievements;
create policy "Users can view own achievements" on achievements for select using ( auth.uid() = user_id );

drop policy if exists "Users can insert own achievements" on achievements;
create policy "Users can insert own achievements" on achievements for insert with check ( auth.uid() = user_id );

drop policy if exists "Users can update own achievements" on achievements;
create policy "Users can update own achievements" on achievements for update using ( auth.uid() = user_id );
