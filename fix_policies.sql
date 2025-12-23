-- FIX PERMESSI PROFILO
-- Esegui questo script per assicurarti di poter SALVARE i dati del profilo.

-- Rimuoviamo le policy vecchie per essere sicuri
drop policy if exists "Users can insert their own profile" on profiles;
drop policy if exists "Users can update their own profile" on profiles;
drop policy if exists "Enable insert for users based on user_id" on profiles;
drop policy if exists "Enable update for users based on user_id" on profiles;

-- Creiamo una policy "Permissiva" per INSERT e UPDATE
-- Questa permette di INSERIRE se l'ID corrisponde al tuo utente
create policy "Users can insert their own profile" 
on profiles 
for insert 
with check ( auth.uid() = id );

-- Questa permette di AGGIORNARE se l'ID corrisponde al tuo utente
create policy "Users can update their own profile" 
on profiles 
for update 
using ( auth.uid() = id )
with check ( auth.uid() = id );  -- Importante per Supabase

-- Per sicurezza, verifichiamo anche le SELECT
drop policy if exists "Public profiles are viewable by everyone" on profiles;
create policy "Public profiles are viewable by everyone" 
on profiles 
for select 
using ( true );
