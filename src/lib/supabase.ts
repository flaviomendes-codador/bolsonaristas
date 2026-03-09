import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? 'https://placeholder.supabase.co'
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? 'placeholder-key'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export type Politician = {
  id: number
  nome: string
  partido: string
  estado: string
  foto_url: string
  score_atual: number
  total_votos: number
  votos_favor: number
  votos_contra: number
}

export type Bill = {
  id: number
  numero: string
  ano: number
  ementa_oficial: string
  resumo_ia: string
  score_ia: number
  categoria: 'imposto' | 'familia' | 'liberdade' | 'outro'
  analisado_em: string
}

export type UserProfile = {
  id: string
  email: string
  is_premium: boolean
  subscription_status: string
}
