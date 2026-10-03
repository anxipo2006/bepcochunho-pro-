import NextAuth, { type NextAuthConfig } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { Role } from "@prisma/client";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { getClientIp, rateLimit } from "@/lib/security";

const credentialsSchema = z.object({
  email: z.string().email().max(160),
  password: z.string().min(8).max(128),
});

export const authConfig = {
  pages: {
    signIn: "/login",
  },
  session: {
    strategy: "jwt",
  },
  providers: [
    Credentials({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const parsed = credentialsSchema.safeParse(credentials);

        if (!parsed.success) {
          return null;
        }

        const email = parsed.data.email.toLowerCase();
        const ip = await getClientIp();
        const ipLimit = rateLimit(`login:ip:${ip}`, 30, 15 * 60 * 1000);
        const emailLimit = rateLimit(`login:email:${email}`, 10, 15 * 60 * 1000);
        if (!ipLimit.ok || !emailLimit.ok) return null;

        const user = await prisma.user.findUnique({
          where: { email },
        });

        if (!user) {
          return null;
        }

        const passwordMatch = await bcrypt.compare(parsed.data.password, user.password);

        if (!passwordMatch) {
          return null;
        }

        return {
          id: user.id,
          email: user.email,
          name: user.companyName,
          role: user.role,
          isApproved: user.isApproved,
          companyName: user.companyName,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role as Role;
        token.isApproved = Boolean(user.isApproved);
        token.companyName = String(user.companyName);
      }

      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.sub ?? "";
        session.user.role = token.role as Role;
        session.user.isApproved = Boolean(token.isApproved);
        session.user.companyName = String(token.companyName ?? session.user.name ?? "");
      }

      return session;
    },
  },
} satisfies NextAuthConfig;

export const { handlers, auth, signIn, signOut } = NextAuth(authConfig);
