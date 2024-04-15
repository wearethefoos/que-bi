"use client";

import { useQuery } from "@/hooks/useQuery";
import { QueryForm } from "./form";
import Link from "next/link";

type Props = {
  id: string;
};

export const QueryInfo = ({ id }: Props) => {
  const { query, error } = useQuery(id);

  if (!query?.run?.result) return;

  const { result, success } = query.run;

  return (
    <div>
      {error && (
        <div className="bg-red-100 p-4 rounded-md">
          <h3 className="text-xl text-red-500">Error</h3>
          <p className="text-red-500">{error}</p>
          <QueryForm {...query} />
        </div>
      )}

      {success && (
        <>
          <h3 className="text-xl mt-4">{result.rowCount} Rows </h3>
          {query.query?.match(/\slimit\s/i) && (
            <p className="text-yellow-700">
              Query contains limit, there may be more results when you adjust
              the limit.
            </p>
          )}

          {result.rowCount === 0 && (
            <div className="bg-yellow-400/30 p-4 rounded-md my-8">
              <h3 className="text-xl text-yellow-700 dark:text-yellow-400">
                No Results
              </h3>
              <p className="text-yellow-700 dark:text-yellow-400">
                The query returned no results.
              </p>
              <p className="mt-4">
                <Link
                  href={`/queries/${id}/edit`}
                  className="px-4 py-2 bg-blue-800 text-white rounded-md"
                >
                  Edit Query
                </Link>
              </p>
            </div>
          )}
        </>
      )}
    </div>
  );
};
