-- SCRIPT D'EMERGENZA: RESET TOTALE PERMESSI
-- Esegui questo per ripristinare il funzionamento di TUTTE le tabelle.

-- 1. TABELLA PROFILES
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public profiles are viewable by everyone" ON profiles;
DROP POLICY IF EXISTS "Users can insert their own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON profiles;
DROP POLICY IF EXISTS "Enable all for users based on id" ON profiles;

-- Crea una singola regola universale per i profili
CREATE POLICY "Enable all for users based on id" 
ON profiles FOR ALL 
USING (auth.uid() = id) 
WITH CHECK (auth.uid() = id);

-- (Opzionale: permetti a tutti di leggere i profili per leaderboards)
CREATE POLICY "Public profiles are viewable by everyone" 
ON profiles FOR SELECT 
USING (true);


-- 2. TABELLA USER_SETTINGS
ALTER TABLE user_settings ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users can view own settings" ON user_settings;
DROP POLICY IF EXISTS "Users can insert own settings" ON user_settings;
DROP POLICY IF EXISTS "Users can update own settings" ON user_settings;
DROP POLICY IF EXISTS "Enable all for users based on user_id" ON user_settings;

CREATE POLICY "Enable all for users based on user_id" 
ON user_settings FOR ALL 
USING (auth.uid() = user_id) 
WITH CHECK (auth.uid() = user_id);


-- 3. TABELLA ACTIVITY_LOGS
ALTER TABLE activity_logs ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users can view own logs" ON activity_logs;
DROP POLICY IF EXISTS "Users can insert own logs" ON activity_logs;
DROP POLICY IF EXISTS "Users can update own logs" ON activity_logs;
DROP POLICY IF EXISTS "Users can delete own logs" ON activity_logs;
DROP POLICY IF EXISTS "Enable all for users based on user_id" ON activity_logs;

CREATE POLICY "Enable all for users based on user_id" 
ON activity_logs FOR ALL 
USING (auth.uid() = user_id) 
WITH CHECK (auth.uid() = user_id);


-- 4. TABELLA ACHIEVEMENTS
ALTER TABLE achievements ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users can view own achievements" ON achievements;
DROP POLICY IF EXISTS "Users can insert own achievements" ON achievements;
DROP POLICY IF EXISTS "Users can update own achievements" ON achievements;
DROP POLICY IF EXISTS "Enable all for users based on user_id" ON achievements;

CREATE POLICY "Enable all for users based on user_id" 
ON achievements FOR ALL 
USING (auth.uid() = user_id) 
WITH CHECK (auth.uid() = user_id);
