
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://rpghuvpxubfattkhjnji.supabase.co';
const supabaseAnonKey = 'sb_publishable_lwqPJLTZ8GU6GjTZIcBkOA_1DU-vzY2';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
