import type { Metadata } from 'next'
import { Inter, Bebas_Neue } from 'next/font/google'
import { TwemojiInit } from '@/components/Twemoji'
import './globals.css'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter', display: 'swap' })
const bebas = Bebas_Neue({ weight: '400', subsets: ['latin'], variable: '--font-bebas', display: 'swap' })

export const metadata: Metadata = {
  title: 'Monitor Legislativo | Score Conservador de Deputados',
  description: 'IA monitora 513 deputados 24h/dia. Saiba quem está traindo o Brasil.',
  openGraph: {
    title: 'Monitor Legislativo — 513 Deputados sob Vigilância da IA',
    description: 'Enquanto você dorme, nossa IA não dorme.',
    type: 'website',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" className={`dark ${inter.variable} ${bebas.variable}`}>
      <body className="min-h-screen bg-[#080808] text-white antialiased" style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>
        <TwemojiInit />
        {children}
      </body>
    </html>
  )
}
