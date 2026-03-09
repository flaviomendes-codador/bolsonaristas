'use client'
import { useState } from 'react'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [sent, setSent]   = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function submit(e: React.FormEvent) {
    e.preventDefault(); setLoading(true); setError('')
    const { error } = await supabase.auth.signInWithOtp({
      email, options: { emailRedirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard` },
    })
    if (error) setError(error.message); else setSent(true)
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-[#080808] text-white flex flex-col">
      <nav className="border-b border-white/5 px-6 py-4">
        <div className="max-w-5xl mx-auto">
          <Link href="/" className="flex items-center gap-2 text-sm font-semibold">
            <span>🦅</span> Monitor Legislativo
          </Link>
        </div>
      </nav>
      <div className="flex-1 flex items-center justify-center px-6 py-16">
        <div className="w-full max-w-sm">
          <div className="text-center mb-8">
            <div className="inline-flex w-12 h-12 items-center justify-center rounded-xl bg-white/5 border border-white/10 text-2xl mb-4">🦅</div>
            <h1 className="font-display text-4xl text-white mb-1">{sent ? 'VERIFIQUE' : 'ENTRAR'}</h1>
            <h2 className="font-display text-4xl text-red-500">{sent ? 'SEU EMAIL' : 'NO MONITOR'}</h2>
            <p className="text-zinc-500 text-sm mt-2">
              {sent ? `Link enviado para ${email}` : 'Link mágico — sem senha, sem complicação'}
            </p>
          </div>

          <div className="card p-6">
            {sent ? (
              <div className="text-center py-2">
                <p className="text-zinc-400 text-sm mb-4">Clique no link que chegou no seu email para acessar.</p>
                <div className="card p-3 text-left text-xs text-zinc-600 space-y-1.5 mb-4">
                  <p>💡 O link expira em 1 hora</p>
                  <p>📁 Verifique o spam</p>
                  <button onClick={() => setSent(false)} className="text-zinc-400 hover:text-white transition-colors">🔄 Reenviar</button>
                </div>
              </div>
            ) : (
              <form onSubmit={submit} className="space-y-4">
                <div>
                  <label className="text-xs text-zinc-500 uppercase tracking-widest block mb-1.5">Email</label>
                  <input type="email" value={email} onChange={e => setEmail(e.target.value)}
                    placeholder="patriota@gmail.com" required className="input" />
                </div>
                {error && <p className="text-red-400 text-xs bg-red-950/30 border border-red-900/30 rounded px-3 py-2">{error}</p>}
                <button type="submit" disabled={loading} className="btn btn-red w-full py-3.5 text-sm font-bold disabled:opacity-50">
                  {loading ? 'Enviando...' : '🦅 Enviar link de acesso →'}
                </button>
                <p className="text-center text-xs text-zinc-700">
                  Não tem conta?{' '}
                  <Link href="/assinar" className="text-red-700 hover:text-red-500 underline transition-colors">7 dias grátis →</Link>
                </p>
              </form>
            )}
          </div>
          <p className="text-center text-xs text-zinc-700 mt-4">🔒 Seguro · LGPD compliant</p>
        </div>
      </div>
    </div>
  )
}
