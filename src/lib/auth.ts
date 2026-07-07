import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import Google from "next-auth/providers/google";
import Discord from "next-auth/providers/discord";
import bcrypt from "bcryptjs";
import { prisma } from "./db";

export const {
  handlers,
  signIn,
  signOut,
  auth,
} = NextAuth({
  session: { strategy: "jwt" },
  pages: {
    signIn: "/login",
    newUser: "/onboarding",
  },
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID ?? "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? "",
    }),
    Discord({
      clientId: process.env.DISCORD_CLIENT_ID ?? "",
      clientSecret: process.env.DISCORD_CLIENT_SECRET ?? "",
    }),
    Credentials({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        const user = await prisma.user.findUnique({
          where: { email: credentials.email as string },
        });

        if (!user || !user.passwordHash) return null;

        const isValid = await bcrypt.compare(
          credentials.password as string,
          user.passwordHash
        );

        if (!isValid) return null;

        // Block unverified credentials users. OAuth accounts (Google/Discord)
        // are trusted — they don't have a passwordHash path here.
        if (!user.emailVerified) return null;

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          image: user.image,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user, account }) {
      if (user) {
        token.id = user.id;
        // Read the role once at sign-in. This claim is a cheap first filter
        // only — requireAdmin() re-checks the DB on every admin request, so a
        // stale token can't hold on to (or fake) privileges there.
        const dbUser = user.id
          ? await prisma.user.findUnique({
              where: { id: user.id },
              select: { role: true },
            })
          : null;
        token.role = dbUser?.role ?? "USER";
      }
      if (account) {
        // Which provider authenticated this session ("credentials", "google",
        // "discord"). Used by the ADMIN_REQUIRE_OAUTH gate in lib/admin.ts.
        token.provider = account.provider;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user && token.id) {
        session.user.id = token.id as string;
        session.user.role = (token.role as string | undefined) ?? "USER";
        session.user.provider = token.provider as string | undefined;
      }
      return session;
    },
  },
});
