"use client";

import { QueryWithResult } from "@/hooks/useQuery";
import { useSearchParams } from "next/navigation";
import { createContext, useState } from "react";

type QueryContextType = {
  queryId?: string | null;
  setQueryId: (id: string | null) => void;
  query?: QueryWithResult | null;
  setQuery: (query: QueryWithResult | null) => void;
  loading: boolean;
  setLoading: (loading: boolean) => void;
  error?: string | null;
  setError: (error: string | null) => void;
  params: URLSearchParams;
  setParams: (params: URLSearchParams) => void;
  orderBy: string | null;
  setOrderBy: (orderBy: string | null) => void;
  order: "asc" | "desc";
  setOrder: (order: "asc" | "desc") => void;
};

export const QueryContext = createContext<QueryContextType>({
  queryId: null,
  setQueryId: () => {},
  query: null,
  setQuery: () => {},
  loading: false,
  setLoading: () => {},
  error: null,
  setError: () => {},
  params: new URLSearchParams(),
  setParams: () => {},
  orderBy: null,
  setOrderBy: () => {},
  order: "asc",
  setOrder: () => {},
});

type Props = {
  id: string;
  children: React.ReactNode;
};

export const QueryProvider = ({ id, children }: Props) => {
  const [queryId, setQueryId] = useState<string | null>(id);
  const [query, setQuery] = useState<QueryWithResult | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [params, updateParams] = useState<URLSearchParams>(useSearchParams());
  const [orderBy, setOrderBy] = useState<string | null>(
    params.get("orderBy") || null,
  );
  const [order, setOrder] = useState<"asc" | "desc">(
    params.get("order") === "desc" ? "desc" : "asc",
  );

  const setParams = (newParams: URLSearchParams) => {
    updateParams(newParams);
    window.history.replaceState(
      null,
      "",
      `${new URL(window.location.href).pathname.split("?")[0]}?${new URLSearchParams(newParams).toString()}`,
    );
  };

  return (
    <QueryContext.Provider
      value={{
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
      }}
    >
      {children}
    </QueryContext.Provider>
  );
};
