import { createClient } from '@supabase/supabase-js';

// These would normally be in a .env file
const supabaseUrl = process.env.REACT_APP_SUPABASE_URL || 'https://your-project.supabase.co';
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY || 'your-anon-key';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

/**
 * Example Service Structure for Supabase Integration
 * 
 * export const getUsers = async () => {
 *   const { data, error } = await supabase
 *     .from('users')
 *     .select('*');
 *   if (error) throw error;
 *   return data;
 * }
 */
