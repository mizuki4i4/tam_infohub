// pages/api/msas.js
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req, res) {  
  const msas = await prisma.msa.findMany();
  res.status(200).json(msas);
}