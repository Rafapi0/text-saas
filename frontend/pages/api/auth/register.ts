import { NextApiRequest, NextApiResponse } from 'next';
import clientPromise from '../../../lib/mongodb';
import bcrypt from 'bcryptjs';
import { User } from '../../../types/models';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método não permitido' });
  }

  try {
    const { name, email, password } = req.body;

    // Validações básicas
    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Todos os campos são obrigatórios' });
    }

    // Conectar ao MongoDB
    const client = await clientPromise;
    const db = client.db('docprocessor');

    // Verificar se o usuário já existe
    const existingUser = await db.collection('users').findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'Email já cadastrado' });
    }

    // Criar hash da senha
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Criar novo usuário
    const newUser: User = {
      name,
      email,
      password: hashedPassword,
      createdAt: new Date(),
      subscription: {
        plan: 'basic',
        status: 'inactive',
        startDate: new Date(),
        endDate: new Date(),
      },
    };

    // Inserir usuário no banco
    const result = await db.collection('users').insertOne(newUser);

    // Remover a senha do objeto de resposta
    const { password: _, ...userWithoutPassword } = newUser;

    return res.status(201).json({
      message: 'Usuário criado com sucesso',
      user: userWithoutPassword,
    });
  } catch (error) {
    console.error('Erro ao registrar usuário:', error);
    return res.status(500).json({ error: 'Erro ao criar usuário' });
  }
} 