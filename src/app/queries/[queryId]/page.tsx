import { requireAuth } from "@/lib/auth";
import { notFound } from "next/navigation";
import prisma from "@/lib/prisma";
import { runQuery } from "@/lib/queries";
import { DataTable } from "@/components/queries/DataTable";
import Link from "next/link";
import { QueryForm } from "@/components/queries/form";
import QueryVariables from "@/components/queries/QueryVariables";
import { QueryInfo } from "@/components/queries/Info";
import { QueryProvider } from "@/contexts/queryContext";

type Params = {
  params: {
    queryId: string;
  };
  searchParams?: URLSearchParams;
};

export const generateMetadata = async ({ params: { queryId } }: Params) => {
  const query = await prisma.query.findUnique({
    where: { id: queryId },
  });
  requireAuth();

  if (!query) {
    notFound();
  }

  return {
    title: query.name,
    description: query.description,
  };
};

export default async function ShowQuery({
  params: { queryId },
  searchParams,
}: Params) {
  requireAuth();

  const query = await prisma.query.findUnique({
    where: { id: queryId },
  });

  if (!query) {
    notFound();
  }

  return (
    <main className="flex flex-col p-24">
      <QueryProvider id={queryId}>
        <div className="flex flex-row gap-4 items-center justify-between">
          <h1 className="text-4xl font-bold">{query.name}</h1>
          <Link
            href={`/queries/${queryId}/edit`}
            className="px-4 py-2 bg-blue-800 text-white rounded-md"
          >
            Edit Query
          </Link>
        </div>
        <div className="text-gray-500">{query.description}</div>
        <QueryVariables id={query.id} />
        <QueryInfo id={query.id} />
        <DataTable id={query.id} />
      </QueryProvider>
    </main>
  );
}
