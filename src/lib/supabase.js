import { createClient } from "@supabase/supabase-js";

const url = import.meta.env.VITE_SUPABASE_URL;
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// O site precisa continuar de pé mesmo antes do Supabase estar configurado:
// sem as variáveis, o catálogo cai no arquivo local e o painel avisa o que falta.
export const supabaseConfigurado = Boolean(url && anonKey);

export const supabase = supabaseConfigurado
  ? createClient(url, anonKey)
  : null;
