import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { PrismaClient } from "@prisma/client"; 

const prisma = new PrismaClient(); 

export default NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile, email, credentials }) {
      try {
        if (typeof user.email !== "string") {
          console.error("Email is not valid");
          return false; 
        }

        const existingUser = await prisma.user.findUnique({
          where: { email: user.email },
        });

        if (!existingUser) {
          await prisma.user.create({
            data: {
              name: user.name ?? "Anonymous",
              email: user.email,
              password: null,  // Google sign-in doesn't use a password
            },
          });
        }

        return true;  // Sign-in successful
      } catch (err) {
        console.error(err);
        return false;  // Sign-in failed
      }
    },
    async redirect({ url, baseUrl }) {
      // Redirect to /dashboard on successful sign-in
      return baseUrl + "/dashboard";
    },
  },
});
