import { createClient } from '@supabase/supabase-js';

// Reemplaza estos valores con los de tu proyecto en Supabase (Configuración -> API)
const supabaseUrl = 'https://tnfbhtolcpqajnacmhsp.supabase.co';
const supabaseAnonKey = 'sb_publishable_212YPFWg5XJnBlvh6CXufA__P-WjIF3';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
