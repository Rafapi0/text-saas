export const STRIPE_PUBLISHABLE_KEY = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || '';

export const STRIPE_PRODUCTS = {
  basic: {
    name: 'Plano Básico',
    price: 29,
    priceId: 'price_1R9gslLf5ulcbXEOIeFqWliy',
  },
  pro: {
    name: 'Plano Pro',
    price: 99,
    priceId: 'price_1R9gsmLf5ulcbXEOn9Z4A4T5',
  },
  enterprise: {
    name: 'Plano Enterprise',
    price: 299,
    priceId: 'price_1R9gsmLf5ulcbXEOkJbSK5XF',
  },
}; 