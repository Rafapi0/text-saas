import { NextApiRequest, NextApiResponse } from 'next';
import { verify } from 'jsonwebtoken';
import Stripe from 'stripe';
import { STRIPE_PRODUCTS } from '../../config/stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2023-10-16',
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Método não permitido' });
  }

  try {
    const token = req.cookies.token;

    if (!token) {
      return res.status(401).json({ message: 'Não autorizado' });
    }

    const decoded = verify(token, process.env.JWT_SECRET || '') as { userId: string };
    const { priceId } = req.body;

    if (!priceId) {
      return res.status(400).json({ message: 'ID do preço não fornecido' });
    }

    // Verifica se o priceId é válido
    const product = Object.values(STRIPE_PRODUCTS).find(
      (p) => p.priceId === priceId
    );

    if (!product) {
      return res.status(400).json({ message: 'Plano inválido' });
    }

    // Cria a sessão de checkout
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode: 'subscription',
      success_url: `${req.headers.origin}/dashboard?success=true`,
      cancel_url: `${req.headers.origin}/pricing?canceled=true`,
      customer_email: decoded.email,
      metadata: {
        userId: decoded.userId,
        plan: product.name.toLowerCase(),
      },
    });

    return res.status(200).json({ sessionId: session.id });
  } catch (error) {
    console.error('Erro ao criar sessão de checkout:', error);
    return res.status(500).json({ message: 'Erro interno do servidor' });
  }
} 