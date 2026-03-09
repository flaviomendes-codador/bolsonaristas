import { NextRequest, NextResponse } from 'next/server'
import { stripe, STRIPE_PRICE_ID, APP_URL } from '@/lib/stripe'
import { supabase } from '@/lib/supabase'
import { createClient } from '@supabase/supabase-js'

export async function POST(request: NextRequest) {
  // Verifica sessão do usuário
  const supabaseServer = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )

  const authHeader = request.headers.get('cookie') ?? ''

  try {
    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      payment_method_types: ['card'],
      line_items: [
        {
          price: STRIPE_PRICE_ID,
          quantity: 1,
        },
      ],
      success_url: `${APP_URL}/dashboard?sucesso=true`,
      cancel_url: `${APP_URL}/assinar?cancelado=true`,
      locale: 'pt-BR',
      allow_promotion_codes: true,
      subscription_data: {
        trial_period_days: 7, // 7 dias grátis
      },
    })

    return NextResponse.redirect(session.url!, { status: 303 })
  } catch (err) {
    console.error('Erro ao criar sessão Stripe:', err)
    return NextResponse.json({ error: 'Erro ao processar pagamento' }, { status: 500 })
  }
}
