import { createClient } from '@supabase/supabase-js';

// Reemplaza estos valores con los de tu proyecto en Supabase (Configuración -> API)
const supabaseUrl = 'https://TU_PROYECTO.supabase.co';
const supabaseAnonKey = 'TU_ANON_KEY';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
