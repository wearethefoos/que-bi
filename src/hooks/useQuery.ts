"use client";

import { useCallback, useContext, useEffect, useState } from "react";
import request from "axios";

import type { DatabaseError, QueryResult } from "pg";
import { Query } from "@prisma/client";
import { useRouter, useSearchParams } from "next/navigation";
import { QueryContext } from "@/contexts/queryContext";

export type QueryWithResult = {
  run?: {
    result?: QueryResult;
    success: boolean;
  };
  error?: DatabaseError;
} & Query;

export const useQuery = (id: string) => {
  const {
    queryId,
    setQueryId,
    query,
    setQuery,
    loading,
    setLoading,
    error,
    setError,
    params,
    setParams,
    orderBy,
    setOrderBy,
    order,
    setOrder,
  } = useContext(QueryContext);

  useEffect(() => {
    setLoading(true);
    setError(null);

    console.log("params changed?", params.toString(), queryId);

    if (!queryId) return;

    request
      .get<QueryWithResult>(`/api/queries/${queryId}?${params.toString()}`)
      .then((res) => {
        console.log("success", res.data);
        setQuery({ ...res.data });
        setError(res.data.error?.message || null);
      })
      .catch((err) => {
        console.log("error");
        setQuery(null);
        setError(err.message);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [queryId, params, setQuery, setError, setLoading]);

  const sortQueryBy = useCallback(
    (property: string) => {
      if (!query || !query.run || !query.run.result) return;

      setOrderBy(property);
      let newParams = new URLSearchParams(params);
      newParams.set("orderBy", property);

      const newOrder =
        orderBy === property && order === "desc" ? "asc" : "desc";
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

      setParams(newParams);
    },
    [query, params, orderBy, order, setQuery, setParams, setOrder, setOrderBy],
  );

  return {
    query,
    order,
    orderBy,
    setQueryId,
    error,
    loading,
    sortQueryBy,
    setParams,
  };
};
