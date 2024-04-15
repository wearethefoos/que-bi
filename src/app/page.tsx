import { DeleteButton } from "@/components/queries/DeleteButton";
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
      <table className="my-24 table-fixed w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
        <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
          <tr>
            <th scope="col" colSpan={2} className="px-6 py-3">
              Name
            </th>
            <th scope="col" className="px-6 py-3 w-48 text-right">
              Actions
            </th>
          </tr>
        </thead>
        <tbody>
          {queries.map((query) => (
            <tr
              key={query.id}
              className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
            >
              <td className="px-6 py-4 cursor-pointer">
                <Link href={`/queries/${query.id}`}>{query.name}</Link>
              </td>
              <td className="px-6 py-4">
                <p className="line-clamp-1">{query.description}</p>
              </td>
              <td className="px-6 py-4 w-48 flex items-center flex-row gap-2">
                <Link
                  href={`/queries/${query.id}/edit`}
                  className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                >
                  Edit
                </Link>
                <DeleteButton id={query.id} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </main>
  );
}
