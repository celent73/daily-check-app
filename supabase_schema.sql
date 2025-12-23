-- Abilita l'estensione per gestire gli UUID (di solito attiva di default, ma per sicurezza)
create extension if not exists "uuid-ossp";

-- 1. Tabella PROFILES (Dati utente)
create table profiles (
  id uuid references auth.users not null primary key,
  first_name text,
  last_name text,
  commission_status text default 'PRIVILEGIATO',
  current_qualification text,
  target_qualification text,
  updated_at timestamp with time zone default timezone('utc'::text, now())
);
-- Abilita RLS (Row Level Security)
alter table profiles enable row level security;
-- Policy: Ognuno vede e modifica solo il suo profilo
create policy "Public profiles are viewable by everyone" on profiles for select using ( true );
create policy "Users can insert their own profile" on profiles for insert with check ( auth.uid() = id );
create policy "Users can update their own profile" on profiles for update using ( auth.uid() = id );

-- 2. Tabella USER_SETTINGS (Impostazioni App)
create table user_settings (
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
create policy "Users can view own settings" on user_settings for select using ( auth.uid() = user_id );
create policy "Users can insert own settings" on user_settings for insert with check ( auth.uid() = user_id );
create policy "Users can update own settings" on user_settings for update using ( auth.uid() = user_id );

-- 3. Tabella ACTIVITY_LOGS (Diario Attività)
create table activity_logs (
  user_id uuid references auth.users not null,
  date text not null, -- Formato YYYY-MM-DD
  counts jsonb default '{}'::jsonb,
  contract_details jsonb default '{}'::jsonb,
  leads jsonb default '[]'::jsonb,
  updated_at timestamp with time zone default timezone('utc'::text, now()),
  primary key (user_id, date)
);
alter table activity_logs enable row level security;
create policy "Users can view own logs" on activity_logs for select using ( auth.uid() = user_id );
create policy "Users can insert own logs" on activity_logs for insert with check ( auth.uid() = user_id );
create policy "Users can update own logs" on activity_logs for update using ( auth.uid() = user_id );
create policy "Users can delete own logs" on activity_logs for delete using ( auth.uid() = user_id );

-- 4. Tabella ACHIEVEMENTS (Traguardi)
create table achievements (
  user_id uuid references auth.users not null primary key,
  unlocked_achievements jsonb default '{}'::jsonb,
  updated_at timestamp with time zone default timezone('utc'::text, now())
);
alter table achievements enable row level security;
create policy "Users can view own achievements" on achievements for select using ( auth.uid() = user_id );
create policy "Users can insert own achievements" on achievements for insert with check ( auth.uid() = user_id );
create policy "Users can update own achievements" on achievements for update using ( auth.uid() = user_id );

-- 5. Funzione per gestire l'aggiornamento automatico del campo updated_at (Opzionale ma utile)
create or replace function public.handle_new_user() 
returns trigger as $$
begin
  insert into public.profiles (id, first_name, last_name)
  values (new.id, new.raw_user_meta_data->>'first_name', new.raw_user_meta_data->>'last_name');
  return new;
end;
$$ language plpgsql security definer;

-- Trigger automatico alla creazione utente (opzionale, se vuoi che Supabase crei il profilo da solo)
-- create trigger on_auth_user_created
--   after insert on auth.users
--   for each row execute procedure public.handle_new_user();
