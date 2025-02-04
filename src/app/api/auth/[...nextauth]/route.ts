import bcrypt from "bcryptjs";
import { PrismaAdapter } from '@next-auth/prisma-adapter';
import { AuthOptions } from 'next-auth';
import GithubProvider from 'next-auth/providers/github';
import GoogleProvider from 'next-auth/providers/google';
import CredentialProvider from 'next-auth/providers/credentials';
import prisma from '@/app/libs/prismadb'
import NextAuth from "next-auth/next";


export const authOptions: AuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_ID as string,
      clientSecret: process.env.GITHUB_SECRET as string
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_SECRET as string
    }),
    CredentialProvider({
      name: 'credentials',
      credentials: {
        email: {label: 'email', type: 'text'},
        password: {label: 'password', type: 'password'},
      },
      async authorize(credentials) {
        if(!credentials?.email || !credentials?.password) {
          throw new Error("Invalid credentials")
        }

        const user = await prisma.user.findUnique({
          where: { email: credentials.email }
        })

        if(!user || !user?.hashedPassword){
          throw new Error("Invalid credentials")
        }

        const inCorrectPassword = await bcrypt.compare(
          credentials.password,
          user.hashedPassword
        )

        if(!inCorrectPassword) {
          throw new Error("Invalid credentials")
        }

        return user
      }
    })
  ],
  debug: process.env.NODE_ENV == 'development',
  session: {
    strategy: "jwt"
  },
  secret: process.env.NEXTAUTH_SECRET
}

const handler = NextAuth(authOptions)

export {handler as GET, handler as POST, handler as PUT, handler as DELETE} 