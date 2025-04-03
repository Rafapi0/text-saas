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
    console.log('Recebendo requisição de login...');
    const { email, password } = req.body;

    if (!email || !password) {
      console.log('Email ou senha não fornecidos');
      return res.status(400).json({ message: 'Email e senha são obrigatórios' });
    }

    console.log('Conectando ao MongoDB...');
    const client = await clientPromise;
    console.log('Conexão com MongoDB estabelecida');
    const db = client.db();
    console.log('Banco de dados selecionado');

    // Busca o usuário pelo email
    console.log('Buscando usuário com email:', email);
    const user = await db.collection('users').findOne({ email });
    if (!user) {
      console.log('Usuário não encontrado');
      return res.status(401).json({ message: 'Credenciais inválidas' });
    }
    console.log('Usuário encontrado');

    // Verifica a senha
    console.log('Verificando senha...');
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      console.log('Senha inválida');
      return res.status(401).json({ message: 'Credenciais inválidas' });
    }
    console.log('Senha válida');

    // Cria o token JWT
    console.log('Criando token JWT...');
    const token = jwt.sign(
      { userId: user._id, email: user.email },
      process.env.JWT_SECRET || 'default_secret',
      { expiresIn: '7d' }
    );
    console.log('Token JWT criado');

    // Define o cookie com o token
    console.log('Definindo cookie...');
    res.setHeader(
      'Set-Cookie',
      `token=${token}; Path=/; HttpOnly; SameSite=Strict; Max-Age=${7 * 24 * 60 * 60}`
    );
    console.log('Cookie definido');

    // Remove a senha do objeto de resposta
    const { password: _, ...userWithoutPassword } = user;

    console.log('Login realizado com sucesso');
    return res.status(200).json({
      message: 'Login realizado com sucesso',
      user: userWithoutPassword,
    });
  } catch (error) {
    console.error('Erro detalhado ao fazer login:', error);
    return res.status(500).json({ 
      message: 'Erro interno do servidor',
      error: error instanceof Error ? error.message : 'Erro desconhecido'
    });
  }
} 