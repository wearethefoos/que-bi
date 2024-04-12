import NextAuth from "next-auth";
import GoogleProvider, { GoogleProfile } from "next-auth/providers/google";
import { headers } from "next/headers";

export const { auth, handlers, signIn, signOut } = NextAuth({
  session: {
    strategy: "jwt",
  },
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "client-id-not-set",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "client-secret-not-set",
    }),
  ],
  callbacks: {
    async signIn(creds) {
      if (creds.account?.provider === "google") {
        const profile = creds.profile ? (creds.profile as GoogleProfile) : null;
        return !!(
          profile?.email_verified &&
          profile.email.endsWith(
            `@${process.env.GOOGLE_DOMAIN || "example.com"}`,
          )
        );
      }
      return false;
    },
  },
});

export const requireAuth = async () => {
  const session = auth();
  const headersList = headers();
  const redirectTo = headersList.get("x-pathname") || "/";

  if (!session) {
    await signIn({ redirectTo });
  }
};
