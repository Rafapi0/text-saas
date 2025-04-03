import { NextApiRequest, NextApiResponse } from 'next';
import { verify } from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { ObjectId } from 'mongodb';
import clientPromise from '../../../lib/mongodb';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'PUT') {
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

    const { name, email, currentPassword, newPassword } = req.body;

    // Busca o usuário
    const user = await db.collection('users').findOne({ _id: new ObjectId(decoded.userId) });
    if (!user) {
      return res.status(404).json({ message: 'Usuário não encontrado' });
    }

    // Verifica se o email já está em uso por outro usuário
    if (email !== user.email) {
      const existingUser = await db.collection('users').findOne({ email });
      if (existingUser) {
        return res.status(400).json({ message: 'Email já está em uso' });
      }
    }

    // Se estiver alterando a senha, verifica a senha atual
    if (newPassword) {
      if (!currentPassword) {
        return res.status(400).json({ message: 'Senha atual é necessária' });
      }

      const isValidPassword = await bcrypt.compare(currentPassword, user.password);
      if (!isValidPassword) {
        return res.status(400).json({ message: 'Senha atual incorreta' });
      }
    }

    // Prepara os dados para atualização
    const updateData: any = {
      name,
      email,
    };

    // Se houver nova senha, adiciona ao objeto de atualização
    if (newPassword) {
      const salt = await bcrypt.genSalt(10);
      updateData.password = await bcrypt.hash(newPassword, salt);
    }

    // Atualiza o usuário
    const result = await db.collection('users').findOneAndUpdate(
      { _id: new ObjectId(decoded.userId) },
      { $set: updateData },
      { returnDocument: 'after' }
    );

    if (!result?.value) {
      return res.status(404).json({ message: 'Usuário não encontrado' });
    }

    // Remove a senha do objeto de resposta
    const { password: _, ...userWithoutPassword } = result.value;

    return res.status(200).json(userWithoutPassword);
  } catch (error) {
    console.error('Erro ao atualizar perfil:', error);
    return res.status(500).json({ message: 'Erro interno do servidor' });
  }
} 