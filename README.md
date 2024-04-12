# ¿Que? - A Simple BI Tool

Que is a simple BI tool to share queries with your team.

Click the button below to deploy your own instance of Que:

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fwearethefoos%2Fque-bi&env=GOOGLE_DOMAIN,GOOGLE_CLIENT_ID,GOOGLE_CLIENT_SECRET,POSTGRES_PRISMA_URL,POSTGRES_URL_NON_POOLING,READ_DATABASE_URL,NEXTAUTH_SECRET,NEXTAUTH_URL)

## Environment Variables

Que uses the following environment variables:

- `GOOGLE_DOMAIN` - The domain of your Google Workspace account (e.g. `example.com`).
- `GOOGLE_CLIENT_ID` - The client ID of your Google OAuth app (see below).
- `GOOGLE_CLIENT_SECRET` - The client secret of your Google OAuth app.
- `POSTGRES_PRISMA_URL` - The URL of your Prisma database (to store your Que queries and auth info of the users using Que).
- `POSTGRES_URL_NON_POOLING` - The URL of your Prisma database without pooling.
- `READ_DATABASE_URL` - The URL of your read-only database (where your queries are run).
- `NEXTAUTH_SECRET` - The secret for NextAuth.
- `NEXTAUTH_URL` - The URL of your Vercel deployment (e.g. `https://que-bi.vercel.app`).

### Google OAuth

To get the `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET`, you need to create a new project in the [Google Developers Console](https://console.developers.google.com/). Then, create a new OAuth 2.0 client ID and set the redirect URI to `https://<YOUR VERCEL URL>/api/auth/callback/google`.

For details, see the [NextAuth documentation](https://authjs.dev/getting-started/providers/google).
