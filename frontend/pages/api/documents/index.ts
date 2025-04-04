import { NextApiRequest, NextApiResponse } from 'next';
import { verify } from 'jsonwebtoken';
import { connectToDatabase } from '../../../lib/mongodb';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Método não permitido' });
  }

  const token = req.cookies.token;

  if (!token) {
    return res.status(401).json({ message: 'Não autorizado' });
  }

  try {
    const decoded = verify(token, process.env.JWT_SECRET || '') as { userId: string };
    const { db } = await connectToDatabase();

    const documents = await db
      .collection('documents')
      .find({ userId: decoded.userId })
      .sort({ createdAt: -1 })
      .toArray();

    return res.status(200).json(documents);
  } catch (error) {
    console.error('Erro ao buscar documentos:', error);
    return res.status(500).json({ message: 'Erro ao buscar documentos' });
  }
} 