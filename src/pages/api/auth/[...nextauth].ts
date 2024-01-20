import { randomUUID } from 'crypto'
import { NextApiRequest, NextApiResponse } from 'next'
import { NextAuthOptions } from 'next-auth'
import NextAuth from 'next-auth/next'

import CredentialsProvider from 'next-auth/providers/credentials'

const options: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'email', type: 'string' },
        password: { label: 'password', type: 'string' },
      },
      async authorize(credentials) {
        if (
          credentials &&
          credentials.email === 'johndoe@email.com' &&
          credentials.password === '@MyPassword123'
        ) {
          return {
            id: randomUUID(),
            email: credentials.email,
            name: 'John Doe',
          }
        }
        return null
      },
    }),
  ],
  callbacks: {
    jwt({ token, user }) {
      if (user) {
        token.id = user.id
        token.name = user.name
      }
      return token
    },
    session({ session, token }) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const _session: any = session
      if (token && session.user) {
        _session.user.id = token.id
        _session.user.type = token.issuer
      }
      return _session
    },
  },
  debug: true,
}

const auth = (req: NextApiRequest, res: NextApiResponse) => {
  res.setHeader('Set-Cookie', 'foo=bar; Path=/; HttpOnly; SameSite=Lax')
  return NextAuth(req, res, options)
}

export default auth
