import { NextRequest, NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe'
import { createClient } from '@supabase/supabase-js'
import Stripe from 'stripe'

export async function POST(request: NextRequest) {
  const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )
  const body = await request.text()
  const sig = request.headers.get('stripe-signature')!
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(body, sig, webhookSecret)
  } catch (err) {
    console.error('Webhook signature verification failed:', err)
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }

  switch (event.type) {
    case 'checkout.session.completed': {
      const session = event.data.object as Stripe.Checkout.Session
      const customerId = session.customer as string
      const subscriptionId = session.subscription as string
      const customerEmail = session.customer_details?.email

      if (!customerEmail) break

      // Busca o user pelo email
      const { data: users } = await supabaseAdmin.auth.admin.listUsers()
      const user = users?.users?.find(u => u.email === customerEmail)

      if (user) {
        await supabaseAdmin.from('users').upsert({
          id: user.id,
          email: customerEmail,
          is_premium: true,
          stripe_customer_id: customerId,
          stripe_subscription_id: subscriptionId,
          subscription_status: 'active',
          subscribed_at: new Date().toISOString(),
          expires_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
        }, { onConflict: 'id' })
      }
      break
    }

    case 'customer.subscription.deleted':
    case 'customer.subscription.updated': {
      const subscription = event.data.object as Stripe.Subscription
      const isActive = subscription.status === 'active' || subscription.status === 'trialing'

      await supabaseAdmin
        .from('users')
        .update({
          is_premium: isActive,
          subscription_status: subscription.status,
          expires_at: isActive && 'current_period_end' in subscription
            ? new Date((subscription as unknown as { current_period_end: number }).current_period_end * 1000).toISOString()
            : null,
        })
        .eq('stripe_subscription_id', subscription.id)
      break
    }

    case 'invoice.payment_failed': {
      const invoice = event.data.object as Stripe.Invoice & { subscription?: string | { id: string } }
      const subId = typeof invoice.subscription === 'string'
        ? invoice.subscription
        : (invoice.subscription as { id: string } | undefined)?.id

      if (subId) {
        await supabaseAdmin
          .from('users')
          .update({ subscription_status: 'past_due', is_premium: false })
          .eq('stripe_subscription_id', subId)
      }
      break
    }
  }

  return NextResponse.json({ received: true })
}
