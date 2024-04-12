import { queryContext } from "@/contexts/query-context";
import { useContext, useState } from "react";

export const useQuery = () => {
  const { currentQuery } = useContext(queryContext);
  const [query, setQuery] = useState<string | null>(currentQuery);

  return { query, setQuery };
};
