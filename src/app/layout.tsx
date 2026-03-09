import type { Metadata } from 'next'
import { Inter, Bebas_Neue } from 'next/font/google'
import './globals.css'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

const bebasNeue = Bebas_Neue({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-bebas',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Monitor Legislativo | Score Conservador de Deputados',
  description:
    'Enquanto você dorme, 513 deputados decidem o seu futuro. Nossa IA monitora cada votação com olhos conservadores. Descubra quem está do lado do Brasil.',
  keywords: 'deputados, votações, projetos de lei, conservador, score político, brasília, monitor legislativo',
  openGraph: {
    title: 'Monitor Legislativo — 513 Deputados sob Vigilância da IA',
    description: 'Enquanto você dorme, nossa IA não dorme. Score conservador de todos os deputados atualizado diariamente.',
    type: 'website',
    locale: 'pt_BR',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Monitor Legislativo — Score Conservador',
    description: 'IA monitora cada votação em Brasília. Descubra quem está traindo o eleitor.',
  },
  robots: 'index, follow',
  themeColor: '#050805',
  icons: {
    icon: '/favicon.svg',
    shortcut: '/favicon.svg',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="pt-BR"
      className={`dark ${inter.variable} ${bebasNeue.variable}`}
    >
      <body
        className="min-h-screen antialiased"
        style={{ fontFamily: 'var(--font-inter, Inter, system-ui, sans-serif)' }}
      >
        {/* Noise texture sutil */}
        <div className="noise-overlay" aria-hidden="true" />
        {children}
      </body>
    </html>
  )
}
