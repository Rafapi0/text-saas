import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Método não permitido' });
  }

  try {
    res.setHeader(
      'Set-Cookie',
      'token=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT; HttpOnly; SameSite=Strict'
    );

    return res.status(200).json({ message: 'Logout realizado com sucesso' });
  } catch (error) {
    console.error('Erro ao fazer logout:', error);
    return res.status(500).json({ message: 'Erro interno do servidor' });
  }
} 