"use client";

import { useEffect, useState } from "react";
import request from "axios";

import type { DatabaseError, QueryResult } from "pg";
import { Query } from "@prisma/client";
import { useRouter, useSearchParams } from "next/navigation";

export type QueryWithResult = {
  run?: {
    result?: QueryResult;
    success: boolean;
  };
  error?: DatabaseError;
} & Query;

export const useQuery = (id: string) => {
  const [queryId, setQueryId] = useState<string | null>(id);
  const [query, setQuery] = useState<QueryWithResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const params = useSearchParams();
  const [orderBy, setOrderBy] = useState<string | null>(
    params.get("orderBy") || null,
  );
  const [order, setOrder] = useState<"asc" | "desc">(
    params.get("order") === "desc" ? "desc" : "asc",
  );

  const sortQueryBy = (property: string) => {
    if (!query || !query.run || !query.run.result) return;

    setOrderBy(property);
    let newParams = new URLSearchParams(window.location.search);
    newParams.set("orderBy", property);

    const newOrder = orderBy === property && order === "desc" ? "asc" : "desc";
    setOrder(newOrder);
    newParams.set("order", newOrder);

    setQuery({
      ...query,
      run: {
        ...query.run,
        result: {
          ...query.run.result,
          rows:
            newOrder === "desc"
              ? query.run.result?.rows.sort((a, b) =>
                  b[property] < a[property] ? -1 : 1,
                ) || []
              : query.run.result?.rows.sort((a, b) =>
                  a[property] < b[property] ? -1 : 1,
                ) || [],
        },
      },
    });

    router.replace(`${window.location.pathname}?${newParams.toString()}`);
  };

  useEffect(() => {
    setError(null);
    setQuery(null);

    if (!queryId) return;

    request
      .get<QueryWithResult>(`/api/queries/${queryId}`)
      .then((res) => {
        setQuery(res.data);
        setError(res.data.error?.message || null);
      })
      .catch((err) => {
        setQuery(null);
        setError(err.message);
      });
  }, [queryId]);

  return { query, order, orderBy, setQueryId, error, sortQueryBy };
};
