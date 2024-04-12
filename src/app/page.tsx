import { requireAuth } from "@/lib/auth";
import Link from "next/link";

export default function Home() {
  requireAuth();

  return (
    <main className="flex flex-col p-24">
      <Link href="/queries/new">New Query</Link>
    </main>
  );
}
