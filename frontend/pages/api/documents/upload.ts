import { NextApiRequest, NextApiResponse } from 'next';
import { verify } from 'jsonwebtoken';
import formidable from 'formidable';
import fs from 'fs';
import path from 'path';
import clientPromise from '../../../lib/mongodb';

export const config = {
  api: {
    bodyParser: false,
  },
};

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

    // Configura o formidable para processar o upload
    const form = formidable({
      uploadDir: path.join(process.cwd(), 'uploads'),
      keepExtensions: true,
      maxFileSize: 10 * 1024 * 1024, // 10MB
    });

    // Cria o diretório de uploads se não existir
    if (!fs.existsSync(form.uploadDir)) {
      fs.mkdirSync(form.uploadDir, { recursive: true });
    }

    // Processa o upload do arquivo
    const [fields, files] = await new Promise((resolve, reject) => {
      form.parse(req, (err, fields, files) => {
        if (err) reject(err);
        resolve([fields, files]);
      });
    });

    const file = files.file as formidable.File;
    if (!file) {
      return res.status(400).json({ message: 'Nenhum arquivo enviado' });
    }

    // Conecta ao MongoDB
    const client = await clientPromise;
    const db = client.db();

    // Cria o registro do documento no banco de dados
    const result = await db.collection('documents').insertOne({
      userId: decoded.userId,
      name: file.originalFilename || 'Documento sem nome',
      path: file.filepath,
      status: 'pending',
      createdAt: new Date(),
    });

    return res.status(201).json({
      message: 'Documento enviado com sucesso',
      document: {
        _id: result.insertedId,
        name: file.originalFilename || 'Documento sem nome',
        status: 'pending',
        createdAt: new Date(),
      },
    });
  } catch (error) {
    console.error('Erro ao fazer upload do documento:', error);
    return res.status(500).json({ message: 'Erro interno do servidor' });
  }
} 