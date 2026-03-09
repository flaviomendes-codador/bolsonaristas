import Link from 'next/link'

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-[#030303] text-white flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <div className="text-5xl mb-6">🦅</div>
        <h1 className="font-display text-4xl text-white uppercase mb-3">Área do Patriota</h1>
        <p className="text-gray-500 text-sm mb-8">
          Esta área requer login. Cadastre-se gratuitamente para acessar o ranking completo.
        </p>
        <div className="flex flex-col gap-3">
          <Link href="/captura"
            className="bg-red-700 hover:bg-red-600 text-white py-3 font-black uppercase tracking-wider text-sm transition-all">
            Cadastro Gratuito →
          </Link>
          <Link href="/assinar"
            className="border border-white/10 text-gray-500 hover:text-white py-3 text-sm font-bold uppercase tracking-wider transition-all">
            Ver Planos
          </Link>
        </div>
      </div>
    </div>
  )
}
