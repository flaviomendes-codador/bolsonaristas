import Stripe from 'stripe'

// Lazy init — só instancia quando chamado em runtime, não no build
let _stripe: Stripe | null = null

export function getStripe(): Stripe {
  if (!_stripe) {
    _stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
      apiVersion: '2026-02-25.clover',
    })
  }
  return _stripe
}

// Mantém export `stripe` para compatibilidade
export const stripe = new Proxy({} as Stripe, {
  get(_target, prop) {
    return (getStripe() as unknown as Record<string | symbol, unknown>)[prop]
  },
})

export const STRIPE_PRICE_ID = process.env.STRIPE_PRICE_ID!
export const STRIPE_PRICE_ID_ANUAL = process.env.STRIPE_PRICE_ID_ANUAL!
export const APP_URL = process.env.NEXT_PUBLIC_APP_URL!
