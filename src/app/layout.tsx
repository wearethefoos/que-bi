import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { auth } from "@/lib/auth";
import { Session } from "next-auth";
import SesssionData from "@/components/auth/session-data";
import { Header } from "@/components/layout/header";
import { SignIn } from "@/components/auth/signin-button";
import { headers } from "next/headers";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "¿Que? - A Simple BI Tool",
  description: "Get insights from your data with ¿Que?",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session: Session | null = await auth();
  const headersList = headers();
  const redirectTo = headersList.get("x-pathname") || "/";

  if (!session) {
    return (
      <html lang="en">
        <body className={inter.className}>
          <div className="flex items-center justify-center h-screen">
            <div className="text-center">
              <h1 className="text-4xl font-bold">Welcome to ¿Que?</h1>
              <p className="mt-4 text-lg mb-8">
                You need to be signed in to access the app.
              </p>
              <SignIn redirectTo={redirectTo} />
            </div>
          </div>
        </body>
      </html>
    );
  }

  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="min-h-screen">
          <Header />
          <div className="pt-12">{children}</div>
        </div>
        <SesssionData session={session} />
      </body>
    </html>
  );
}
