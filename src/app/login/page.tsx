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
      options: {
        emailRedirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard`,
      },
    })

    if (error) {
      setError(error.message)
    } else {
      setSent(true)
    }
    setLoading(false)
  }

  return (
    <main className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="text-4xl block mb-4">🦅</Link>
          <h1 className="text-2xl font-black text-white">Entrar no Monitor</h1>
          <p className="text-gray-500 mt-1">
            {sent ? 'Verifique seu email' : 'Acesso via link mágico — sem senha'}
          </p>
        </div>

        <div className="glass-card rounded-2xl p-8">
          {sent ? (
            <div className="text-center">
              <div className="text-5xl mb-4">📧</div>
              <p className="text-verde-400 font-semibold mb-2">Link enviado!</p>
              <p className="text-gray-400 text-sm">
                Enviamos um link de acesso para{' '}
                <span className="text-white font-medium">{email}</span>.
                Clique no link para entrar.
              </p>
              <p className="text-gray-600 text-xs mt-4">
                Não recebeu? Verifique o spam.
              </p>
            </div>
          ) : (
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="text-sm text-gray-400 block mb-1">Seu email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="patriota@gmail.com"
                  required
                  className="w-full bg-militar-800 border border-verde-900/40 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-verde-600 transition-colors"
                />
              </div>

              {error && (
                <p className="text-red-400 text-sm">{error}</p>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-verde-600 hover:bg-verde-500 disabled:bg-verde-900 text-white py-3 rounded-xl font-bold transition-all"
              >
                {loading ? 'Enviando...' : 'Enviar Link de Acesso →'}
              </button>

              <p className="text-center text-xs text-gray-600">
                Ainda não tem conta?{' '}
                <Link href="/assinar" className="text-verde-500 hover:text-verde-400">
                  Assine agora
                </Link>
              </p>
            </form>
          )}
        </div>
      </div>
    </main>
  )
}
