import { compare } from "bcryptjs"
import CredentialsProvider from "next-auth/providers/credentials"
import NextAuth, { NextAuthOptions } from 'next-auth'
import GoogleProvider from 'next-auth/providers/google'

import { connectToMongoDB } from "@/lib/mongodb"
import { User } from "@/models/user"
import { GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET } from "@/utils/config"

const options = {
  providers: [
    CredentialsProvider({
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
    }),
    GoogleProvider({
      clientId: GOOGLE_CLIENT_ID,
      clientSecret: GOOGLE_CLIENT_SECRET
    })
  ],
  pages: {
    newUser: '/app/auth/register',
    signIn: '/app/auth/login'
  },
  session: {
    strategy: 'jwt',
    maxAge: 60
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
      session.role = user?.role || 'user'
      session.photo = user?.avatar ? user.avatar.url : token.image
      // session.expires = 30 * 1000
      return session
    }
  }
}

export default NextAuth(options)