import { NextApiRequest, NextApiResponse } from 'next';
import { verify } from 'jsonwebtoken';
import clientPromise from '../../../lib/mongodb';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Método não permitido' });
  }

  try {
    const token = req.cookies.token;

    if (!token) {
      return res.status(401).json({ message: 'Não autorizado' });
    }

    const decoded = verify(token, process.env.JWT_SECRET || '') as { userId: string };
    const client = await clientPromise;
    const db = client.db();
    const user = await db.collection('users').findOne(
      { _id: decoded.userId },
      { projection: { password: 0 } }
    );

    if (!user) {
      return res.status(404).json({ message: 'Usuário não encontrado' });
    }

    return res.status(200).json(user);
  } catch (error) {
    console.error('Erro ao verificar usuário:', error);
    return res.status(500).json({ message: 'Erro interno do servidor' });
  }
} 