import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Monitor Legislativo | Score Conservador de Deputados',
  description:
    'Acompanhe o Score Conservador de todos os deputados federais. Nossa IA analisa cada votação e projeto de lei em tempo real. Saiba quem está do lado do Brasil.',
  keywords: 'deputados, votações, projetos de lei, conservador, score político, brasília',
  openGraph: {
    title: 'Monitor Legislativo — Score Conservador de Deputados',
    description: 'Nossa IA monitora Brasília 24h/dia. Saiba quem está do lado do Brasil.',
    type: 'website',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" className="dark">
      <body className="min-h-screen premium-gradient antialiased">{children}</body>
    </html>
  )
}
