import { QueryForm } from "@/components/queries/form";
import { requireAuth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { notFound } from "next/navigation";

type Params = {
  params: {
    queryId: string;
  };
};

export default async function EditQuery({ params: { queryId } }: Params) {
  requireAuth();

  const query = await prisma.query.findFirst({
    where: {
      id: queryId,
    },
  });

  if (!query) {
    notFound();
  }

  return (
    <main className="flex flex-col p-24">
      <h1 className="text-4xl font-bold">Edit Query</h1>
      <QueryForm {...query} />
    </main>
  );
}
