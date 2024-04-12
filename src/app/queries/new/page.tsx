import { QueryForm } from "@/components/queries/form";
import { requireAuth } from "@/lib/auth";

export default function NewQuery() {
  requireAuth();

  return (
    <main className="flex flex-col p-24">
      <h1 className="text-4xl font-bold">New Query</h1>
      <QueryForm />
    </main>
  );
}
