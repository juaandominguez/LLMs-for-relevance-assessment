import NextAuth from "next-auth";
import GitHub from "next-auth/providers/github";
import Google from "next-auth/providers/google";
import Credentials from "next-auth/providers/credentials";
import { saltAndHashPassword } from "@/utils/password";
import { DrizzleAdapter } from "@auth/drizzle-adapter";
import { db } from "./db/schema";
import { getUser, createUser } from "./db/queries";
export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: DrizzleAdapter(db),
  providers: [
    GitHub,
    Google,
    Credentials({
      credentials: {
        email: {},
        password: {},
        isLogin: {},
      },
      authorize: async (credentials) => {
        let user = null;

        const pwHash = await saltAndHashPassword(
          credentials.password as string
        );

        if (credentials.isLogin === "true") {
          user = await getUser(credentials.email as string, pwHash);

          if (!user) {
            throw new Error("Invalid credentials.");
          }
        } else {
          user = await createUser(credentials.email as string, pwHash);
          if (!user) {
            throw new Error("Could not create user.");
          }
        }
        return user;
      },
    }),
  ],
  pages: {
    signIn: "/login",
  },
});
