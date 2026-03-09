'use client'

import { useState } from 'react'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'

const URGENCY_ITEMS = [
  { icon: '🔴', text: '47 PLs perigosos aguardando votação esta semana' },
  { icon: '💸', text: 'R$2,3 bilhões em novos gastos aprovados ontem' },
  { icon: '📚', text: '3 projetos contra a família em pauta hoje' },
  { icon: '🔇', text: 'PL de censura ao internet avança na Câmara' },
]

export default function CapturaPage() {
  const [email, setEmail] = useState('')
  const [nome, setNome] = useState('')
  const [loading, setLoading] = useState(false)
  const [done, setDone] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')

    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/obrigado` },
    })

    if (error) setError(error.message)
    else setDone(true)

    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-[#030303] text-white">

      {/* Barra de urgência */}
      <div className="bg-red-800 py-2 px-4 text-center">
        <p className="text-xs font-black uppercase tracking-widest text-white">
          ⚡ NOVOS ALERTAS DISPONÍVEIS — CADASTRE-SE PARA RECEBER
        </p>
      </div>

      {/* Navbar */}
      <nav className="border-b border-white/5 py-4 px-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <span>🦅</span>
            <span className="font-black text-sm uppercase tracking-widest text-white">Monitor Legislativo</span>
          </Link>
          <Link href="/" className="text-gray-600 hover:text-gray-400 text-xs transition-colors">
            ← Voltar
          </Link>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-4 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">

          {/* Lado esquerdo — persuasão */}
          <div>
            <p className="text-red-500 text-xs font-black uppercase tracking-[0.3em] mb-4">
              ACESSO GRATUITO IMEDIATO
            </p>
            <h1 className="font-display text-4xl sm:text-5xl text-white uppercase leading-tight mb-6">
              RECEBA OS ALERTAS<br />
              <span className="text-red-500">QUE A MÍDIA</span><br />
              NÃO TE DÁ
            </h1>
            <p className="text-gray-400 text-sm leading-relaxed mb-8">
              Toda manhã, nossa IA analisa o que foi votado em Brasília.
              Você recebe um relatório direto no seu email — com os deputados
              que votaram contra o Brasil, e os PLs mais perigosos em tramitação.
            </p>

            {/* Itens de urgência */}
            <div className="space-y-3 mb-8">
              <p className="text-xs text-gray-600 uppercase tracking-widest font-bold mb-3">
                O QUE ESTÁ ACONTECENDO AGORA:
              </p>
              {URGENCY_ITEMS.map((item, i) => (
                <div key={i} className="flex items-start gap-3 bg-black/60 border border-white/5 px-4 py-3">
                  <span className="text-base shrink-0">{item.icon}</span>
                  <p className="text-gray-300 text-sm">{item.text}</p>
                </div>
              ))}
            </div>

            {/* O que você recebe */}
            <div className="border-l-2 border-green-800 pl-5 space-y-3">
              <p className="text-xs text-gray-600 uppercase tracking-widest font-bold">
                O QUE VOCÊ RECEBE:
              </p>
              {[
                'Top 10 deputados com maior score conservador',
                'Top 5 PLs mais perigosos da semana',
                'Alertas quando seu deputado vota contra você',
                'Análise de cada votação em linguagem simples',
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-2 text-sm text-gray-400">
                  <span className="text-green-500 shrink-0">✓</span>
                  {item}
                </div>
              ))}
            </div>
          </div>

          {/* Lado direito — formulário */}
          <div className="lg:sticky lg:top-8">
            {done ? (
              <div className="border border-green-800/60 bg-green-950/20 p-8 text-center">
                <div className="text-4xl mb-4">🦅</div>
                <h2 className="font-display text-3xl text-white uppercase mb-3">
                  BEM-VINDO,<br />
                  <span className="text-green-400">PATRIOTA</span>
                </h2>
                <p className="text-gray-400 text-sm leading-relaxed mb-6">
                  Enviamos um link de confirmação para{' '}
                  <span className="text-white font-semibold">{email}</span>.
                  Clique para ativar sua conta e começar a receber os alertas.
                </p>
                <Link href="/obrigado"
                  className="block bg-green-700 hover:bg-green-600 text-white py-3 font-black uppercase tracking-wider text-sm transition-all">
                  Ver Página de Boas-Vindas →
                </Link>
              </div>
            ) : (
              <div className="border border-white/10 bg-black/60 p-8">
                <h2 className="font-display text-2xl text-white uppercase mb-1">
                  ACESSO GRATUITO
                </h2>
                <p className="text-gray-600 text-xs mb-6">
                  Relatório conservador direto no seu email. Sem custo.
                </p>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="text-xs text-gray-600 uppercase tracking-widest block mb-1.5">
                      Seu Nome
                    </label>
                    <input
                      type="text"
                      value={nome}
                      onChange={e => setNome(e.target.value)}
                      placeholder="José da Silva"
                      className="w-full bg-white/5 border border-white/10 focus:border-red-700/60 text-white px-4 py-3 text-sm outline-none transition-colors placeholder-gray-700"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-gray-600 uppercase tracking-widest block mb-1.5">
                      Seu Melhor Email
                    </label>
                    <input
                      type="email"
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      placeholder="jose@gmail.com"
                      required
                      className="w-full bg-white/5 border border-white/10 focus:border-red-700/60 text-white px-4 py-3 text-sm outline-none transition-colors placeholder-gray-700"
                    />
                  </div>

                  {error && (
                    <p className="text-red-400 text-xs bg-red-950/40 border border-red-900/40 px-3 py-2">
                      {error}
                    </p>
                  )}

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-red-700 hover:bg-red-600 disabled:bg-red-900/40 text-white py-4 font-black uppercase tracking-wider text-sm transition-all hover:shadow-[0_0_30px_rgba(220,38,38,0.3)]">
                    {loading ? '⏳ Processando...' : '🦅 QUERO OS ALERTAS GRATUITAMENTE →'}
                  </button>

                  <p className="text-gray-700 text-xs text-center">
                    Seus dados não serão vendidos. Cancele quando quiser.
                  </p>
                </form>

                {/* Social proof */}
                <div className="mt-6 pt-6 border-t border-white/5 text-center">
                  <p className="text-gray-700 text-xs uppercase tracking-widest">
                    Dados 100% oficiais · API da Câmara dos Deputados
                  </p>
                </div>
              </div>
            )}

            {/* Já tem conta */}
            <p className="text-center text-xs text-gray-700 mt-4">
              Já tem conta?{' '}
              <Link href="/login" className="text-gray-500 hover:text-gray-300 underline transition-colors">
                Entrar aqui
              </Link>
              {' '}·{' '}
              <Link href="/assinar" className="text-red-700 hover:text-red-500 underline transition-colors">
                Ver plano premium
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
