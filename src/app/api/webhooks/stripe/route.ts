import { createClient } from '@supabase/supabase-js'
import { headers } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe'
import Stripe from 'stripe'

// Supabase admin (service role) — sem RLS
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(request: NextRequest) {
  const body = await request.text()
  const headersList = await headers()
  const sig = headersList.get('stripe-signature')!

  let event: Stripe.Event
  try {
    event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET!)
  } catch (err) {
    return NextResponse.json({ error: 'Webhook inválido' }, { status: 400 })
  }

  const userId = (event.data.object as Stripe.Subscription).metadata?.user_id
    ?? (event.data.object as Stripe.Checkout.Session).metadata?.user_id

  switch (event.type) {
    case 'checkout.session.completed': {
      const session = event.data.object as Stripe.Checkout.Session
      if (session.mode !== 'subscription') break
      const sub = await stripe.subscriptions.retrieve(session.subscription as string)
      const periodEnd = (sub as unknown as { current_period_end: number }).current_period_end
      await upsertUser(session.metadata?.user_id!, {
        stripe_customer_id: session.customer as string,
        stripe_subscription_id: sub.id,
        subscription_status: sub.status,
        is_premium: sub.status === 'active' || sub.status === 'trialing',
        plan_type: sub.items.data[0].price.recurring?.interval === 'year' ? 'anual' : 'mensal',
        subscribed_at: new Date(sub.created * 1000).toISOString(),
        expires_at: periodEnd ? new Date(periodEnd * 1000).toISOString() : null,
      })
      break
    }

    case 'customer.subscription.updated': {
      const sub = event.data.object as Stripe.Subscription
      if (!userId) break
      const pe = (sub as unknown as { current_period_end: number }).current_period_end
      await upsertUser(userId, {
        subscription_status: sub.status,
        is_premium: sub.status === 'active' || sub.status === 'trialing',
        expires_at: pe ? new Date(pe * 1000).toISOString() : null,
      })
      break
    }

    case 'customer.subscription.deleted': {
      const sub = event.data.object as Stripe.Subscription
      if (!userId) break
      await upsertUser(userId, {
        subscription_status: 'canceled',
        is_premium: false,
      })
      break
    }
  }

  return NextResponse.json({ received: true })
}

async function upsertUser(userId: string, data: Record<string, unknown>) {
  await supabaseAdmin.from('users').upsert({ id: userId, ...data }, { onConflict: 'id' })
}
