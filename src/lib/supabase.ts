import { createClient } from "@supabase/supabase-js";
import { Database } from "@/types/supabase";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || "";
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || "";

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
  realtime: {
    params: {
      eventsPerSecond: 10,
    },
  },
});

/**
 * Função auxiliar para simplificar a execução de consultas
 * Lida com erros e formatação da resposta
 */
export async function executeQuery<T = any>(
  query: Promise<{ data: T | null; error: any }>
): Promise<T> {
  const { data, error } = await query;
  
  if (error) {
    console.error("Erro na consulta Supabase:", error);
    throw error;
  }
  
  return data as T;
}

/**
 * Função para se inscrever nas mudanças de uma tabela
 * 
 * @example
 * // Escutar mudanças na tabela de cursos
 * useSupabaseSubscription('courses', '*', (payload) => {
 *   console.log('Curso atualizado:', payload);
 * });
 */
export function subscribeToTable(
  table: string,
  event: "INSERT" | "UPDATE" | "DELETE" | "*",
  callback: (payload: any) => void
) {
  const channel = supabase.channel(`table:${table}`);
  
  channel
    .on(
      'postgres_changes' as any,
      {
        event,
        schema: "public",
        table,
      },
      callback
    )
    .subscribe();
    
  // Retorna função para cancelar a inscrição
  return () => {
    supabase.removeChannel(channel);
  };
}

/**
 * Função para upload de arquivos com uma interface mais simples
 */
export async function uploadFile(
  bucket: string,
  path: string,
  file: File,
  options = { cacheControl: "3600", upsert: false }
) {
  const { data, error } = await supabase.storage
    .from(bucket)
    .upload(path, file, options);
    
  if (error) {
    console.error("Erro ao fazer upload:", error);
    throw error;
  }
  
  // Obter a URL pública do arquivo
  const { data: publicUrlData } = supabase.storage
    .from(bucket)
    .getPublicUrl(path);
    
  return {
    path: data.path,
    publicUrl: publicUrlData.publicUrl,
  };
}

/**
 * Função para download de arquivos
 */
export async function downloadFile(bucket: string, path: string) {
  const { data, error } = await supabase.storage
    .from(bucket)
    .download(path);
    
  if (error) {
    console.error("Erro ao fazer download:", error);
    throw error;
  }
  
  return data;
}
