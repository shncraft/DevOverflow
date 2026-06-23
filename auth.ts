import NextAuth from "next-auth";
import GitHub from "next-auth/providers/github";
import Google from "next-auth/providers/google";
import { api } from "./lib/api";
import { ActionResponse } from "./types/global";
import { IAccountDoc } from "./database/account.model";
import Credentials from "next-auth/providers/credentials";
import { signInSchema } from "./lib/validations";
import { IUserDoc } from "./database/user.model";
import bcrypt from "bcryptjs";

// We'll check if the sign-in account type is credentials; if yes, then we skip. We'll handle it the other way around when doing email password-based authentication.
//
// But if the account is not credentials, we'll call this new `/oauth/sign-in` app and create oAuth accounts.

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    GitHub,
    Google,
    Credentials({
      async authorize(credentials) {
        // validate the credentials
        const validatedResult = signInSchema.safeParse(credentials);

        if (!validatedResult.success) return null;

        // destructure the credentials
        const { email, password } = validatedResult.data;

        // get details of user account by provider; i.e., email for credentials and check exists or not
        const { data: existingAccount } = (await api.accounts.getByProvider(
          email,
        )) as ActionResponse<IAccountDoc>;

        if (!existingAccount) return null;

        // get user details from account userId and check if exists or not
        const { data: existingUser } = (await api.users.getById(
          existingAccount.userId.toString(),
        )) as ActionResponse<IUserDoc>;

        if (!existingUser) return null;

        // compare password with account hashed password
        const isValidPassword = await bcrypt.compare(
          password,
          existingAccount.password!,
        );

        if (!isValidPassword) return null;

        return {
          id: existingUser._id.toString(),
          name: existingUser.name,
          email: existingUser.email,
          image: existingUser.image,
        };
      },
    }),
  ],
  callbacks: {
    async session({ session, token }) {
      session.user.id = token.sub as string;
      return session;
    },
    async jwt({ token, account }) {
      if (account) {
        const { data: existingAccount, success } =
          (await api.accounts.getByProvider(
            account.type === "credentials"
              ? token.email!
              : account.providerAccountId,
          )) as ActionResponse<IAccountDoc>;

        if (!success || !existingAccount) return token;

        const userId = existingAccount.userId;

        if (userId) token.sub = userId.toString();
      }
      return token;
    },
    async signIn({ user, profile, account }) {
      if (account?.type === "credentials") return true;
      if (!account || !user) return false;

      const userInfo = {
        name: user.name!,
        email: user.email!,
        image: user.image!,
        username:
          account.provider === "github"
            ? (profile?.login as string)
            : (user.name?.toLowerCase() as string),
      };

      const { success } = (await api.auth.oAuthSignIn({
        user: userInfo,
        provider: account.provider as "github" | "google",
        providerAccountId: account.providerAccountId,
      })) as ActionResponse;

      if (!success) return false;

      return true;
    },
  },
});
