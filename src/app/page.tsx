import { DeleteButton } from "@/components/queries/DeleteButton";
import { QueriesOverview } from "@/components/queries/Overview";
import { requireAuth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import Link from "next/link";

type Params = {
  searchParams: {
    limit?: string;
    page?: string;
  };
};

export default async function Queries({ searchParams }: Params) {
  requireAuth();

  const limit = parseInt(searchParams.limit || "10");
  const page = parseInt(searchParams.page || "1");

  const queries = await prisma.query.findMany({
    take: limit,
    skip: Math.max(0, page - 1) * limit,
    orderBy: {
      name: "asc",
    },
  });

  return (
    <main className="flex flex-col p-24">
      <h1 className="text-4xl font-bold">All Queries</h1>
      <div className="mt-8 text-right">
        <Link
          href="/queries/new"
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          New Query
        </Link>
      </div>
      <QueriesOverview queries={queries} />
    </main>
  );
}
