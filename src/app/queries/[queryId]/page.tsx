import { requireAuth } from "@/lib/auth";
import { notFound } from "next/navigation";
import prisma from "@/lib/prisma";
import { runQuery } from "@/lib/queries";
import { DataTable } from "@/components/queries/DataTable";
import Link from "next/link";
import { QueryForm } from "@/components/queries/form";
import QueryVariables from "@/components/queries/QueryVariables";

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

  const result = await runQuery({ query: query.query, params: searchParams });

  return (
    <main className="flex flex-col p-24">
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
      <QueryVariables query={query.query} params={searchParams} />
      {result.error && (
        <div className="bg-red-100 p-4 rounded-md">
          <h3 className="text-xl text-red-500">Error</h3>
          <p className="text-red-500">{result.error.message}</p>
          <QueryForm {...query} />
        </div>
      )}

      {result.success && (
        <>
          <h3 className="text-xl mt-4">{result.result?.rowCount} Rows </h3>
          {query.query?.match(/\slimit\s/i) && (
            <p className="text-yellow-700">
              Query contains limit, there may be more results when you adjust
              the limit.
            </p>
          )}

          {result.result?.rowCount === 0 && (
            <div className="bg-yellow-400/30 p-4 rounded-md my-8">
              <h3 className="text-xl text-yellow-700 dark:text-yellow-400">
                No Results
              </h3>
              <p className="text-yellow-700 dark:text-yellow-400">
                The query returned no results.
              </p>
              <p className="mt-4">
                <Link
                  href={`/queries/${queryId}/edit`}
                  className="px-4 py-2 bg-blue-800 text-white rounded-md"
                >
                  Edit Query
                </Link>
              </p>
            </div>
          )}

          {result.result?.rowCount !== 0 && (
            <DataTable
              id={queryId}
              data={{
                count: result.result?.rowCount || 0,
                fields: Object.keys(result.result?.rows?.[0] || {}),
                rows: result.result?.rows || [],
              }}
            />
          )}
        </>
      )}
    </main>
  );
}
