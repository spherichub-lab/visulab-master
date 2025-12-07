// src/lib/supabaseClient.ts
import { createClient } from '@supabase/supabase-js';

// Usando import.meta.env para Vite
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Verificação para garantir que as variáveis foram carregadas
if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error("As variáveis de ambiente VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY são necessárias.");
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);