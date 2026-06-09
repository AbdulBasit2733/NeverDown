import "server-only";

import bcrypt from "bcrypt";
import type { Account, NextAuthOptions, Profile, User } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import { prismaClient } from "@/lib/prisma";

export const authOptions: NextAuthOptions = {
  secret: process.env.NEXTAUTH_SECRET,
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.username || !credentials?.password) return null;

        const existingUser = await prismaClient.user.findUnique({
          where: { username: credentials.username },
        });

        if (!existingUser?.password) return null;

        const isValid = await bcrypt.compare(
          credentials.password,
          existingUser.password,
        );

        if (!isValid) return null;

        return {
          id: existingUser.id,
          name: existingUser.username,
          username: existingUser.username,
        };
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async signIn({
      user,
      account,
      profile,
    }: {
      user: User;
      account: Account | null;
      profile?: Profile;
    }) {
      if (account?.provider === "google") {
        const email = profile?.email ?? user.email;
        if (!email) return false;

        let existingUser = await prismaClient.user.findUnique({
          where: { username: email },
        });

        if (!existingUser) {
          existingUser = await prismaClient.user.create({
            data: { username: email },
          });
        }

        user.id = existingUser.id;
        user.username = existingUser.username;
      }

      return true;
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.username =
          (user as User & { username?: string }).username ??
          user.name ??
          undefined;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.username = token.username as string;
      }
      return session;
    },
  },
  pages: {
    signIn: "/login",
  },
};
