'use client'

import { useState } from 'react'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [sent, setSent] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')

    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard` },
    })

    if (error) { setError(error.message) }
    else { setSent(true) }
    setLoading(false)
  }

  return (
    <main className="min-h-screen bg-bg-base flex flex-col">

      {/* Navbar */}
      <nav className="glass-card border-b border-verde-muted/20 py-4 px-4">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <span className="text-2xl">🦅</span>
            <span className="font-bold text-verde-glow">Monitor Legislativo</span>
          </Link>
        </div>
      </nav>

      {/* Hero fundo */}
      <div className="absolute inset-0 pointer-events-none">
        <div style={{
          background: 'radial-gradient(ellipse at 50% 30%, rgba(34,134,58,0.06) 0%, transparent 60%)',
          position: 'absolute', inset: 0,
        }} />
      </div>

      <div className="flex-1 flex items-center justify-center px-4 py-16 relative z-10">
        <div className="w-full max-w-md">

          {/* Logo */}
          <div className="text-center mb-10">
            <div className="inline-flex w-16 h-16 items-center justify-center rounded-full bg-verde-dim border border-verde-muted/40 text-3xl mb-4 animate-float">
              🦅
            </div>
            <h1 className="display-font text-4xl text-white">
              {sent ? 'VERIFIQUE SEU' : 'ENTRAR NO'}
            </h1>
            <h1 className="display-font text-4xl gold-text">
              {sent ? 'EMAIL' : 'MONITOR'}
            </h1>
            <p className="text-gray-500 text-sm mt-2">
              {sent
                ? `Link enviado para ${email}`
                : 'Acesso via link mágico — sem senha, sem complicação'}
            </p>
          </div>

          {/* Card */}
          <div className="glass-card rounded-2xl p-8 border border-verde-muted/20">
            {sent ? (
              <div className="text-center py-4">
                <div className="text-6xl mb-6">📧</div>
                <p className="text-verde-glow font-bold text-lg mb-2">Link enviado!</p>
                <p className="text-gray-400 text-sm mb-6 leading-relaxed">
                  Clique no link que chegou em <span className="text-white font-semibold">{email}</span> para acessar sua conta.
                </p>
                <div className="bg-bg-elevated rounded-xl p-4 text-left text-xs text-gray-600 space-y-1">
                  <p>💡 O link expira em 1 hora</p>
                  <p>📁 Verifique a pasta de spam</p>
                  <p>🔄 <button onClick={() => setSent(false)} className="text-verde-glow hover:underline">Reenviar para outro email</button></p>
                </div>
              </div>
            ) : (
              <form onSubmit={handleLogin} className="space-y-5">
                <div>
                  <label className="text-gray-400 text-sm font-semibold block mb-2 uppercase tracking-wider">
                    Seu Email
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="patriota@gmail.com"
                    required
                    className="input-dark w-full rounded-xl px-4 py-3.5 text-base"
                  />
                </div>

                {error && (
                  <div className="bg-red-950/50 border border-red-800/50 rounded-xl p-3">
                    <p className="text-red-400 text-sm">{error}</p>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="btn-primary w-full py-4 rounded-xl font-black text-base uppercase tracking-wide transition-all disabled:opacity-50"
                >
                  {loading ? '⏳ Enviando...' : '🦅 Enviar Link de Acesso →'}
                </button>

                <div className="divider-verde" />

                <p className="text-center text-sm text-gray-600">
                  Ainda não é assinante?{' '}
                  <Link href="/assinar" className="text-gold-bright hover:text-gold-light font-semibold transition-colors">
                    7 dias grátis →
                  </Link>
                </p>
              </form>
            )}
          </div>

          {/* Security note */}
          <p className="text-center text-xs text-gray-700 mt-5">
            🔒 Autenticação segura · Sem senha armazenada · LGPD compliant
          </p>
        </div>
      </div>
    </main>
  )
}
