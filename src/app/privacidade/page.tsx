import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Política de Privacidade | Monitor Legislativo Conservador',
  description: 'Política de Privacidade e tratamento de dados do Monitor Legislativo Conservador, em conformidade com a LGPD.',
}

export default function PrivacidadePage() {
  const dataAtualizacao = '09 de março de 2026'

  return (
    <main className="min-h-screen">
      <nav className="border-b border-verde-900/30 glass-card">
        <div className="max-w-4xl mx-auto px-4 h-14 flex items-center gap-3">
          <Link href="/" className="text-gray-500 hover:text-verde-400 transition-colors text-sm">
            ← Monitor Legislativo
          </Link>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-4 py-12">
        <h1 className="text-3xl font-black text-white mb-2">Política de Privacidade</h1>
        <p className="text-gray-500 text-sm mb-10">Última atualização: {dataAtualizacao}</p>

        <div className="prose prose-invert max-w-none space-y-8 text-gray-300 leading-relaxed">

          <section className="glass-card rounded-xl p-6">
            <h2 className="text-xl font-bold text-verde-400 mb-3">1. Quem somos</h2>
            <p>
              O <strong className="text-white">Monitor Legislativo Conservador</strong> é uma plataforma de informação
              política que utiliza inteligência artificial para analisar votações e projetos de lei da Câmara dos
              Deputados do Brasil. Nossos dados de contato para questões de privacidade:{' '}
              <a href="mailto:privacidade@monitorlegislativo.com.br" className="text-verde-400 hover:underline">
                privacidade@monitorlegislativo.com.br
              </a>
            </p>
          </section>

          <section className="glass-card rounded-xl p-6">
            <h2 className="text-xl font-bold text-verde-400 mb-3">2. Dados coletados e finalidade</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-verde-900/30">
                    <th className="text-left py-2 text-gray-400 font-semibold">Dado</th>
                    <th className="text-left py-2 text-gray-400 font-semibold">Finalidade</th>
                    <th className="text-left py-2 text-gray-400 font-semibold">Base Legal (LGPD)</th>
                  </tr>
                </thead>
                <tbody className="space-y-2">
                  {[
                    ['Endereço de email', 'Autenticação, envio de alertas e cobranças', 'Execução de contrato (Art. 7º, V)'],
                    ['Dados de pagamento', 'Processamento de assinatura via Stripe', 'Execução de contrato (Art. 7º, V)'],
                    ['Histórico de uso', 'Melhoria da plataforma e análise de engajamento', 'Legítimo interesse (Art. 7º, IX)'],
                    ['Endereço IP', 'Segurança e prevenção a fraudes', 'Legítimo interesse (Art. 7º, IX)'],
                  ].map(([dado, finalidade, base]) => (
                    <tr key={dado} className="border-b border-militar-700">
                      <td className="py-3 text-white font-medium">{dado}</td>
                      <td className="py-3 text-gray-400">{finalidade}</td>
                      <td className="py-3 text-gray-500 text-xs">{base}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="mt-4 text-sm text-gray-500">
              <strong className="text-gray-400">Não coletamos:</strong> documentos de identidade, CPF, localização
              geográfica precisa, dados sensíveis (origem racial, opinião política explícita, dados de saúde).
            </p>
          </section>

          <section className="glass-card rounded-xl p-6">
            <h2 className="text-xl font-bold text-verde-400 mb-3">3. Como usamos seus dados</h2>
            <ul className="list-disc list-inside space-y-2 text-gray-300">
              <li>Criar e gerenciar sua conta de assinante</li>
              <li>Processar pagamentos e renovações de assinatura</li>
              <li>Enviar alertas sobre projetos de lei (somente assinantes premium, quando habilitado)</li>
              <li>Melhorar nossos algoritmos de análise e a experiência da plataforma</li>
              <li>Cumprir obrigações legais e fiscais</li>
            </ul>
            <p className="mt-4 text-sm text-gray-500">
              Nunca vendemos, alugamos ou compartilhamos seus dados pessoais com terceiros para fins comerciais.
            </p>
          </section>

          <section className="glass-card rounded-xl p-6">
            <h2 className="text-xl font-bold text-verde-400 mb-3">4. Compartilhamento de dados</h2>
            <p className="mb-3">Compartilhamos dados apenas com os seguintes fornecedores essenciais para a operação do serviço:</p>
            <ul className="space-y-3">
              {[
                { nome: 'Supabase Inc.', uso: 'Banco de dados e autenticação', pais: 'EUA (SCCs aplicadas)' },
                { nome: 'Stripe Inc.', uso: 'Processamento de pagamentos', pais: 'EUA (SCCs aplicadas)' },
                { nome: 'Vercel Inc.', uso: 'Hospedagem do site', pais: 'EUA (SCCs aplicadas)' },
                { nome: 'Anthropic PBC', uso: 'API de IA para análise de PLs (sem dados pessoais)', pais: 'EUA' },
              ].map((item) => (
                <li key={item.nome} className="flex items-start gap-3">
                  <span className="text-verde-600 mt-0.5">▪</span>
                  <div>
                    <span className="font-semibold text-white">{item.nome}</span>
                    <span className="text-gray-400"> — {item.uso}</span>
                    <span className="text-gray-600 text-xs ml-2">({item.pais})</span>
                  </div>
                </li>
              ))}
            </ul>
          </section>

          <section className="glass-card rounded-xl p-6">
            <h2 className="text-xl font-bold text-verde-400 mb-3">5. Retenção de dados</h2>
            <ul className="list-disc list-inside space-y-2 text-gray-300">
              <li><strong className="text-white">Dados de conta:</strong> mantidos enquanto a conta estiver ativa + 5 anos (obrigação fiscal)</li>
              <li><strong className="text-white">Logs de acesso:</strong> até 90 dias</li>
              <li><strong className="text-white">Dados de pagamento:</strong> conforme exigido pela legislação tributária brasileira (5 anos)</li>
              <li><strong className="text-white">Email de marketing:</strong> até o cancelamento da assinatura ou revogação do consentimento</li>
            </ul>
          </section>

          <section className="glass-card rounded-xl p-6">
            <h2 className="text-xl font-bold text-verde-400 mb-4">6. Seus direitos (LGPD — Lei 13.709/2018)</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {[
                { direito: 'Acesso', desc: 'Saber quais dados temos sobre você' },
                { direito: 'Correção', desc: 'Corrigir dados incompletos ou incorretos' },
                { direito: 'Exclusão', desc: 'Solicitar a exclusão dos seus dados' },
                { direito: 'Portabilidade', desc: 'Receber seus dados em formato estruturado' },
                { direito: 'Revogação', desc: 'Revogar consentimento dado anteriormente' },
                { direito: 'Oposição', desc: 'Opor-se ao tratamento por legítimo interesse' },
              ].map((item) => (
                <div key={item.direito} className="bg-militar-800/50 rounded-lg p-3">
                  <p className="font-semibold text-verde-400 text-sm">{item.direito}</p>
                  <p className="text-gray-400 text-xs mt-0.5">{item.desc}</p>
                </div>
              ))}
            </div>
            <p className="mt-4 text-sm text-gray-400">
              Para exercer qualquer destes direitos, envie email para{' '}
              <a href="mailto:privacidade@monitorlegislativo.com.br" className="text-verde-400 hover:underline">
                privacidade@monitorlegislativo.com.br
              </a>
              . Respondemos em até 15 dias úteis.
            </p>
          </section>

          <section className="glass-card rounded-xl p-6">
            <h2 className="text-xl font-bold text-verde-400 mb-3">7. Cookies e tecnologias similares</h2>
            <p className="mb-3">Utilizamos apenas cookies essenciais para funcionamento da plataforma:</p>
            <ul className="list-disc list-inside space-y-1 text-gray-400 text-sm">
              <li><strong className="text-gray-300">sb-access-token</strong> — Token de sessão do Supabase (autenticação)</li>
              <li><strong className="text-gray-300">sb-refresh-token</strong> — Renovação automática de sessão</li>
            </ul>
            <p className="mt-3 text-sm text-gray-500">
              Não utilizamos cookies de rastreamento, publicidade ou analytics de terceiros.
            </p>
          </section>

          <section className="glass-card rounded-xl p-6">
            <h2 className="text-xl font-bold text-verde-400 mb-3">8. Segurança</h2>
            <p className="mb-3">Adotamos as seguintes medidas de segurança:</p>
            <ul className="list-disc list-inside space-y-1 text-gray-400">
              <li>Criptografia em trânsito (TLS 1.3) para todas as comunicações</li>
              <li>Row Level Security (RLS) no banco de dados — cada usuário acessa apenas seus dados</li>
              <li>Senhas não são armazenadas (autenticação por magic link)</li>
              <li>Chaves de API segregadas por ambiente (produção/desenvolvimento)</li>
              <li>Pagamentos processados integralmente pelo Stripe (sem armazenar dados de cartão)</li>
            </ul>
          </section>

          <section className="glass-card rounded-xl p-6">
            <h2 className="text-xl font-bold text-verde-400 mb-3">9. Menores de idade</h2>
            <p>
              Nossa plataforma não é destinada a menores de 18 anos. Não coletamos intencionalmente dados de
              menores. Se você acredita que um menor forneceu dados sem consentimento dos responsáveis, entre
              em contato para exclusão imediata.
            </p>
          </section>

          <section className="glass-card rounded-xl p-6">
            <h2 className="text-xl font-bold text-verde-400 mb-3">10. Alterações nesta política</h2>
            <p>
              Notificaremos mudanças significativas por email (para assinantes) e por aviso destacado no site
              com pelo menos 15 dias de antecedência. O uso continuado após as alterações implica aceitação
              da nova política.
            </p>
          </section>

          <section className="glass-card rounded-xl p-6">
            <h2 className="text-xl font-bold text-verde-400 mb-3">11. Contato e DPO</h2>
            <p>
              Para questões sobre privacidade e proteção de dados, entre em contato com nosso
              Encarregado de Proteção de Dados (DPO):{' '}
              <a href="mailto:privacidade@monitorlegislativo.com.br" className="text-verde-400 hover:underline">
                privacidade@monitorlegislativo.com.br
              </a>
            </p>
            <p className="mt-2 text-sm text-gray-500">
              Você também pode registrar reclamações junto à Autoridade Nacional de Proteção de Dados (ANPD):{' '}
              <span className="text-gray-400">anpd.gov.br</span>
            </p>
          </section>

        </div>

        <div className="mt-10 text-center">
          <Link href="/" className="text-verde-500 hover:text-verde-400 text-sm transition-colors">
            ← Voltar para o Monitor Legislativo
          </Link>
        </div>
      </div>
    </main>
  )
}
