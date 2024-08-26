import type { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';
import { sign } from 'jsonwebtoken'; 
import { setCookie } from 'cookies-next';

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    try {
      const user = await prisma.user.findUnique({
        where: { email },
      });

      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      if (!user.password) {
        return res.status(401).json({ error: 'Invalid password' });
      }

      //const isPasswordValid = await comparePassword(password, user.password);
      let isPasswordValid = false;
      if(password==user.password){
        isPasswordValid=true;
      }

      if (!isPasswordValid) {
        return res.status(401).json({ error: 'Invalid password' });
      }

      const token = sign({ id: user.id, email: user.email }, process.env.JWT_SECRET!, { expiresIn: '7d' });

      setCookie('auth_token', token, { req, res, maxAge: 604800, path: '/' });
      return res.status(200).json({ message: 'Login successful', redirect: '/dashboard' });
    } catch (error) {
      console.error('Login error:', error);
      return res.status(500).json({ error: 'Internal Server Error' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    return res.status(405).json({ error: `Method ${req.method} Not Allowed` });
  }
}
