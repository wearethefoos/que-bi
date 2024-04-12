import { createContext } from "react";

export type QueryContext = {
  currentQuery: string | null;
};

export const queryContext = createContext<QueryContext>({ currentQuery: null });

export const QueryProvider = queryContext.Provider;
