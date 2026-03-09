'use client'

import { useState } from 'react'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'

const URGENCIES = [
  { icon: '🔴', t: '47 PLs perigosos aguardam votação esta semana' },
  { icon: '💸', t: 'R$2,3 bilhões em novos gastos aprovados ontem' },
  { icon: '📚', t: '3 projetos contra a família em pauta hoje' },
  { icon: '🔇', t: 'PL de censura à internet avança na Câmara' },
]

export default function CapturaPage() {
  const [email, setEmail]   = useState('')
  const [nome, setNome]     = useState('')
  const [loading, setLoading] = useState(false)
  const [done, setDone]     = useState(false)
  const [error, setError]   = useState('')

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true); setError('')
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/obrigado` },
    })
    if (error) setError(error.message)
    else setDone(true)
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-[#080808] text-white">
      <nav className="border-b border-white/5 px-6 py-4">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 text-sm font-semibold">
            <span>🦅</span> Monitor Legislativo
          </Link>
          <Link href="/" className="text-zinc-600 hover:text-zinc-400 text-sm transition-colors">← Voltar</Link>
        </div>
      </nav>

      <div className="max-w-5xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">

          {/* Esquerda */}
          <div>
            <p className="text-red-500 text-xs font-semibold uppercase tracking-[0.2em] mb-4">Acesso Gratuito</p>
            <h1 className="font-display text-5xl sm:text-6xl text-white leading-none mb-6">
              RECEBA OS ALERTAS<br />
              <span className="text-red-500">QUE A MÍDIA</span><br />
              NÃO TE DÁ
            </h1>
            <p className="text-zinc-400 text-sm leading-relaxed mb-8">
              Toda manhã nossa IA analisa o que foi votado em Brasília. Você recebe um relatório
              com os deputados que votaram contra o Brasil e os PLs mais perigosos em tramitação.
            </p>

            <div className="space-y-2 mb-8">
              {URGENCIES.map((u, i) => (
                <div key={i} className="card flex items-center gap-3 px-4 py-3 text-sm">
                  <span className="shrink-0">{u.icon}</span>
                  <span className="text-zinc-300">{u.t}</span>
                </div>
              ))}
            </div>

            <div className="space-y-2">
              {['Top 10 deputados com maior score conservador', 'Top 5 PLs mais perigosos da semana', 'Alertas quando seu deputado vota contra você', 'Análise de cada votação em linguagem simples'].map(i => (
                <div key={i} className="flex items-center gap-2 text-sm text-zinc-400">
                  <span className="text-green-500 shrink-0">✓</span>{i}
                </div>
              ))}
            </div>
          </div>

          {/* Direita — form */}
          <div className="lg:sticky lg:top-8">
            {done ? (
              <div className="card p-8 text-center">
                <div className="text-4xl mb-4">🦅</div>
                <h2 className="font-display text-4xl text-white mb-2">BEM-VINDO,<br /><span className="text-green-400">PATRIOTA</span></h2>
                <p className="text-zinc-400 text-sm leading-relaxed mb-6">
                  Link de confirmação enviado para <span className="text-white">{email}</span>. Clique para ativar.
                </p>
                <Link href="/obrigado" className="btn btn-red w-full py-3 text-sm">Ver próximos passos →</Link>
              </div>
            ) : (
              <div className="card p-8">
                <h2 className="font-semibold text-white text-lg mb-1">Cadastro gratuito</h2>
                <p className="text-zinc-500 text-sm mb-6">Relatório diário conservador no seu email.</p>
                <form onSubmit={submit} className="space-y-4">
                  <div>
                    <label className="text-xs text-zinc-500 uppercase tracking-widest block mb-1.5">Seu nome</label>
                    <input type="text" value={nome} onChange={e => setNome(e.target.value)}
                      placeholder="José da Silva" className="input" />
                  </div>
                  <div>
                    <label className="text-xs text-zinc-500 uppercase tracking-widest block mb-1.5">Seu melhor email</label>
                    <input type="email" value={email} onChange={e => setEmail(e.target.value)}
                      placeholder="jose@gmail.com" required className="input" />
                  </div>
                  {error && <p className="text-red-400 text-xs bg-red-950/40 border border-red-900/30 rounded px-3 py-2">{error}</p>}
                  <button type="submit" disabled={loading}
                    className="btn btn-red w-full py-4 text-sm font-bold disabled:opacity-50">
                    {loading ? 'Enviando...' : '🦅 Quero os alertas gratuitamente →'}
                  </button>
                  <p className="text-zinc-700 text-xs text-center">Sem spam. Cancele quando quiser.</p>
                </form>
                <div className="divider my-6" />
                <p className="text-center text-xs text-zinc-700">
                  Já tem conta? <Link href="/login" className="text-zinc-500 hover:text-white underline transition-colors">Entrar</Link>
                  {' · '}
                  <Link href="/assinar" className="text-red-700 hover:text-red-500 underline transition-colors">Ver premium</Link>
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
