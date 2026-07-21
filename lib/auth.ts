import type { DefaultSession, NextAuthOptions, User as NextAuthUser } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { connectToDatabase } from "./mongodb";
import User from "@/models/User";

declare module "next-auth" {
  interface Session {
    user: DefaultSession["user"] & {
      id?: string;
      role?: string;
    };
  }

  interface User {
    role?: string;
  }

  interface JWT {
    id?: string;
    role?: string;
  }
}

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        try {
          await connectToDatabase();
          const email = credentials?.email;
          const password = credentials?.password;

          if (typeof email !== "string" || typeof password !== "string") {
            throw new Error("Invalid credentials");
          }

          const user = await User.findOne({ email }).select("+password");
          if (!user) throw new Error("Invalid credentials");

          const isMatch = await bcrypt.compare(password, user.password ?? "");
          if (!isMatch) throw new Error("Invalid credentials");

          return {
            id: user._id.toString(),
            name: user.name,
            email: user.email,
            role: user.role,
          } satisfies Partial<NextAuthUser> & { role?: string };
        } catch {
          return null;
        }
      }
    })
  ],
  session: { strategy: "jwt" },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user = {
          ...session.user,
          id: typeof token.id === "string" ? token.id : undefined,
          role: typeof token.role === "string" ? token.role : undefined,
        };
      }
      return session;
    }
  },
  pages: { signIn: "/admin/login" },
  secret: process.env.NEXTAUTH_SECRET,
};