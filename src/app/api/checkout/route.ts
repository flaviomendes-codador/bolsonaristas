import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'
import { stripe, APP_URL } from '@/lib/stripe'

export async function POST(request: NextRequest) {
  const cookieStore = await cookies()
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() { return cookieStore.getAll() },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options)
          )
        },
      },
    }
  )

  const { data: { user } } = await supabase.auth.getUser()

  // Usuário não logado → redireciona para captura antes do checkout
  if (!user) {
    const body = await request.formData().catch(() => null)
    const plan = body?.get('plan') ?? 'mensal'
    return NextResponse.redirect(`${APP_URL}/captura?next=checkout&plan=${plan}`)
  }

  const body = await request.formData().catch(() => null)
  const plan = (body?.get('plan') as string) ?? 'mensal'

  const priceId = plan === 'anual'
    ? process.env.STRIPE_PRICE_ID_ANUAL!
    : process.env.STRIPE_PRICE_ID!

  try {
    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      payment_method_types: ['card'],
      customer_email: user.email,
      line_items: [{ price: priceId, quantity: 1 }],
      subscription_data: {
        trial_period_days: 7,
        metadata: { user_id: user.id },
      },
      metadata: { user_id: user.id },
      success_url: `${APP_URL}/obrigado?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${APP_URL}/assinar`,
    })

    return NextResponse.redirect(session.url!, 303)
  } catch (err) {
    console.error('Stripe checkout error:', err)
    return NextResponse.redirect(`${APP_URL}/assinar?error=checkout`)
  }
}
