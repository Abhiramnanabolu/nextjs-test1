import type { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';
import { sign } from 'jsonwebtoken'; 
import { setCookie } from 'cookies-next';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    try {
      // Check if the email is already in use
      const existingUser = await prisma.user.findUnique({
        where: { email },
      });

      if (existingUser) {
        return res.status(400).json({ error: 'Email already in use' });
      }

      //const hashedPassword = await bcrypt.hash(password, 10);
      const hashedPassword = password;

      const user = await prisma.user.create({
        data: {
          name,
          email,
          password: hashedPassword,
        },
      });

      // Generate a JWT token
      const token = sign(
        { id: user.id, email: user.email,name: user.name },
        process.env.JWT_SECRET!,
        { expiresIn: '7d' }
      );

      setCookie('auth_token', token, { req, res, maxAge: 604800, path: '/' });

      return res.status(200).json({ message: 'SignUp successful', redirect: '/dashboard' });
    } catch (error) {
      console.error('Signup error:', error);
      return res.status(500).json({ error: 'Internal Server Error' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    return res.status(405).json({ error: `Method ${req.method} Not Allowed` });
  }
}
