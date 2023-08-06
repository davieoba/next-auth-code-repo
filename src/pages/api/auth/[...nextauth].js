import { connectToMongoDB } from "@/lib/mongodb"
import { compare } from "bcryptjs"
import CredentialsProvider from "next-auth/providers/credentials"
import NextAuth, { NextAuthOptions } from 'next-auth'
import { User } from "@/models/user"

const options = {
  providers: [CredentialsProvider({
    id: 'credentials',
    name: 'credentials-login',
    credentials: {
      email: { label: 'Email', type: 'text' },
      password: { label: 'Password', type: 'password' }
    },
    async authorize(credentials, req) {
      await connectToMongoDB().catch(err => {
        throw new Error('err')
      })

      const user = await User.findOne({
        email: credentials?.email
      }).select('+password')

      if (!user) {
        throw new Error('Invalid credentials')
      }

      const isPasswordCorrect = await compare(credentials?.password, user.password)

      if (!isPasswordCorrect) {
        throw new Error('Invalid credentials')
      }

      return user
    }
  })],
  pages: {
    newUser: '/app/auth/register',
    signIn: '/app/auth/login'
  },
  session: {
    strategy: 'jwt',
    maxAge: 60 * 60 * 24
  },
  callbacks: {
    jwt: async ({ token, user, session, account, profile }) => {
      user && (token.user = user)

      if (account) {
        token.accessToken = account?.access_token
        // token.id = profile.id
      }

      return token
    },
    session: async ({ session, token }) => {
      // console.log({ session, token })
      console.log({ token })
      const user = token.user

      // session.user = user
      // session.expires = ''
      // session.token = token
      session.role = user.role
      session.photo = user.avatar.url
      // session.expires = 30 * 1000
      return session
    }
  }
}

export default NextAuth(options)