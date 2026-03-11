import { NextAuthOptions } from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma) as any,
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/login",
    error: "/login",
  },
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        console.log("--- STARTING LOGIN CHECK ---");
        console.log("1. Email typed:", credentials?.email);

        if (!credentials?.email || !credentials?.password) {
          console.log("2. FAILED: Missing email or password");
          throw new Error("Invalid credentials");
        }

        try {
          const user = await prisma.user.findUnique({
            where: { email: credentials.email },
          });

          console.log("3. Did we find the user in the database?", user ? "YES" : "NO");

          if (!user || !user.password) {
            console.log("4. FAILED: User does not exist, or has no password saved");
            throw new Error("Invalid credentials");
          }

          const isPasswordValid = await bcrypt.compare(
            credentials.password,
            user.password
          );

          console.log("5. Did the passwords match?", isPasswordValid);

          if (!isPasswordValid) {
            console.log("6. FAILED: The typed password did not match the saved password");
            throw new Error("Invalid credentials");
          }

          console.log("7. SUCCESS: Login approved!");
          return user;

        } catch (error) {
          console.log("8. SERVER ERROR CRASH:", error);
          throw new Error("Invalid credentials");
        }
      }
    }),
  ],
  // This safely handles new Google OAuth users
  events: {
    async createUser({ user }) {
      // This only runs ONCE when a new user signs in with Google.
      // Your register route already handles this for email/password users!
      await prisma.usageTracking.create({
        data: { userId: user.id },
      });
      await prisma.subscription.create({
        data: {
          userId: user.id,
          plan: "FREE",
          status: "ACTIVE",
        },
      });
    },
  },
  // Clean, fast callbacks with no database spam
  callbacks: {
    async jwt({ token, user }) {
      // 'user' is only passed the very first time they log in
      if (user) {
        token.id = user.id;
      }
      // Return the full token so we keep the expiration timers!
      return token;
    },
    async session({ token, session }) {
      if (token && session.user) {
        session.user.id = token.id as string;
      }
      return session;
    },
  },
};