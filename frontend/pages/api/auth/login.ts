import { NextApiRequest, NextApiResponse } from 'next';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import clientPromise from '../../../lib/mongodb';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Método não permitido' });
  }

  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email e senha são obrigatórios' });
    }

    const client = await clientPromise;
    const db = client.db();

    // Busca o usuário pelo email
    const user = await db.collection('users').findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Credenciais inválidas' });
    }

    // Verifica a senha
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(401).json({ message: 'Credenciais inválidas' });
    }

    // Cria o token JWT
    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET || 'default_secret',
      { expiresIn: '7d' }
    );

    // Define o cookie com o token
    res.setHeader(
      'Set-Cookie',
      `token=${token}; Path=/; HttpOnly; SameSite=Strict; Max-Age=${7 * 24 * 60 * 60}`
    );

    // Remove a senha do objeto de resposta
    const { password: _, ...userWithoutPassword } = user;

    return res.status(200).json({
      message: 'Login realizado com sucesso',
      user: userWithoutPassword,
    });
  } catch (error) {
    console.error('Erro ao fazer login:', error);
    return res.status(500).json({ message: 'Erro interno do servidor' });
  }
} 