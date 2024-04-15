import { QueryResult, DatabaseError } from "pg";
import createReadDatabasePool from "../read-database";
import {
  QueryParams,
  VARIABLES_PATTERN,
  VARIABLES_PATTERN_G,
  argumentValue,
} from "./variables";

export const runQuery = async (params: QueryParams) => {
  const pool = createReadDatabasePool();

  const query = parsedQueryAndValues(params);

  console.log("parsed", query);

  try {
    const result: QueryResult = await pool.query(query);
    pool.end();
    return { success: true, result };
  } catch (error: any) {
    pool.end();
    return { success: false, error: error as DatabaseError };
  }
};

const parsedQueryAndValues = ({ query, params }: QueryParams) => {
  const queryArguments = query.match(VARIABLES_PATTERN_G);
  if (!queryArguments) return query;

  let parsedQuery = query;

  queryArguments.forEach((p) => {
    const ms = p.match(VARIABLES_PATTERN);
    if (ms) {
      const [m, , type, name, , opts] = ms;
      parsedQuery = parsedQuery.replace(
        m,
        argumentValue(name, type, opts, new URLSearchParams(params)),
      );
    }
  });

  return parsedQuery;
};
