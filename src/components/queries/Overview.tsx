"use client";

import Link from "next/link";
import { DeleteButton } from "./DeleteButton";
import { useCallback, useEffect, useState } from "react";
import { Query } from "@prisma/client";
import request from "axios";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useDebouncedCallback } from "use-debounce";

type Props = {
  queries: Query[];
  page: number;
  limit: number;
};

export const QueriesOverview = ({
  queries: queriesFromServer,
  page: pageFromServer,
  limit: limitFromServer,
}: Props) => {
  const [page, setPageDirectly] = useState(pageFromServer);
  const [limit, setLimit] = useState(limitFromServer);
  const [queries, setQueries] = useState(queriesFromServer);
  const router = useRouter();
  const [search, setSearchDirectly] = useState("");
  const [activeSearch, setActiveSearch] = useState("");
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    request
      .get(
        `/api/queries?offset=${(page - 1) * limit}&limit=${limit}${activeSearch.length > 0 ? `&search=${activeSearch}` : ""}`,
      )
      .then((response) => {
        setQueries(response.data);
      });
  }, [page, limit, activeSearch]);

  const updateUrl = useCallback(
    ({
      newSearch,
      newPage,
      newLimit,
    }: {
      newSearch?: string;
      newPage?: number;
      newLimit?: number;
    }) => {
      const newParams = new URLSearchParams({
        search: newSearch || activeSearch,
        page: `${newPage === undefined ? page : newPage}`,
        limit: `${newLimit === undefined ? limit : newLimit}`,
      });
      router.replace(`${pathname}?${newParams.toString()}`);
    },
    [page, limit, pathname, router, activeSearch],
  );

  const runSearch = useDebouncedCallback((newSearch: string) => {
    setActiveSearch(newSearch);
    updateUrl({ newSearch });
  }, 500);

  const setSearch = (value: string) => {
    setSearchDirectly(value);
    runSearch(value);
  };

  const previousPage = () => {
    const newPage = Math.max(page - 1, 1);
    setPageDirectly(newPage);
    updateUrl({ newPage });
  };

  const nextPage = () => {
    const newPage = page + 1;
    setPageDirectly(newPage);
    updateUrl({ newPage });
  };

  const changeLimit = (value: number) => {
    const newLimit = Math.min(value, 100);
    setLimit(newLimit);
    setPageDirectly(1);
    updateUrl({ newLimit, newPage: 1 });
  };

  return (
    <table className="my-24 table-fixed w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
      <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
        <tr>
          <td colSpan={3} className="px-6 py-4">
            <div className="flex items-center justify-between gap-4">
              <div className="flex-grow">
                <input
                  type="search"
                  placeholder="Search queries"
                  className="border border-gray-200 dark:border-gray-700 p-2 rounded-full w-full focus:outline-none focus:ring focus:ring-blue-500 dark:bg-gray-800 dark:text-gray-400"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
              <div>
                <Link
                  href="/queries/new"
                  className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                >
                  New Query
                </Link>
              </div>
            </div>
          </td>
        </tr>
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
            <td
              className="px-6 py-4 cursor-pointer"
              onClick={() => router.push(`/queries/${query.id}`)}
            >
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
      <tfoot>
        <tr>
          <td colSpan={3} className="px-6 py-4">
            <div className="flex items-center justify-between">
              <button disabled={page === 1} onClick={previousPage}>
                Previous Page
              </button>
              <button onClick={nextPage}>Next Page</button>
            </div>
            <div>
              <select
                onChange={(event) => changeLimit(parseInt(event.target.value))}
                value={limit}
              >
                <option value={10}>10</option>
                <option value={25}>25</option>
                <option value={50}>50</option>
                <option value={100}>100</option>
              </select>
            </div>
          </td>
        </tr>
      </tfoot>
    </table>
  );
};
