import NextAuth, { DefaultSession } from "next-auth";
import GitHub from "next-auth/providers/github";
import Google from "next-auth/providers/google";
import Credentials from "next-auth/providers/credentials";
import { saltAndHashPassword, comparePassword } from "@/utils/password";
import { DrizzleAdapter } from "@auth/drizzle-adapter";
import { db } from "./db/schema";
import { getUser, createUser, createGuestUser } from "./db/queries";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
    } & DefaultSession["user"];
  }
}

export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: DrizzleAdapter(db),
  providers: [
    GitHub,
    Google,
    Credentials({
      credentials: {
        email: {
          label: "Email",
          type: "email",
        },
        password: {
          label: "Password",
          type: "password",
        },
        isLogin: {
          label: "Login",
          type: "boolean",
        },
        isGuest: {},
      },
      authorize: async (credentials) => {
        try {
          let user = null;

          if (credentials.isGuest === "true") {
            user = await createGuestUser();
            if (!user) {
              throw new Error("Could not create guest user.");
            }
            return user;
          }

          if (credentials.isLogin === "true") {
            user = await getUser(credentials.email as string);
            const passwordMatch = await comparePassword(
              credentials.password as string,
              user?.password || ""
            );

            if (!user || !passwordMatch) {
              throw new Error("Invalid credentials.");
            }
          } else {
            const pwHash = await saltAndHashPassword(
              credentials.password as string
            );
            user = await createUser(credentials.email as string, pwHash);
            if (!user) {
              throw new Error("Could not create user.");
            }
          }
          return user;
        } catch (error) {
          console.error("Authorization error:", error);
          throw error;
        }
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    session({ session, token }) {
      session.user.id = token.id as string;
      return session;
    },
  },
});
