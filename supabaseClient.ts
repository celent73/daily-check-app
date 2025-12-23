
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://rpghuvpxubfattkhjnji.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJwZ2h1dnB4dWJmYXR0a2hqbmppIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjY1MDE0MzgsImV4cCI6MjA4MjA3NzQzOH0.nQ6-JU36pvF0Ba7aDD89g9z4BDUMJn1KRlO6SjLVgec';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
