"use client";

import { FC } from "react";
import { ArrowUpIcon, ArrowDownIcon } from "@heroicons/react/20/solid";
import { useQuery } from "@/hooks/useQuery";
import classnames from "classnames";

export type Props = {
  id: string;
};

export const DataTable: FC<Props> = ({ id }) => {
  const { query, sortQueryBy, order, orderBy, loading } = useQuery(id);

  const renderValue = (v: any) => {
    return (
      <span
        dangerouslySetInnerHTML={{
          __html: typeof v === "string" ? v : JSON.stringify(v),
        }}
      />
    );
  };

  console.log("loading", loading);
  console.log("query", query);

  const result = query?.run?.result;

  if (!result) {
    return null;
  }

  return (
    <table
      className={classnames(
        "my-24 table-fixed w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400",
        loading && "animate-pulse",
      )}
    >
      <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
        <tr>
          {result.fields.map((field) => (
            <th scope="col" className="px-6 py-3" key={field.name}>
              <button onClick={() => sortQueryBy(field.name)}>
                {field.name}
              </button>
              {orderBy === field.name ? (
                order === "desc" ? (
                  <ArrowUpIcon className="h-4 w-4 inline" />
                ) : (
                  <ArrowDownIcon className="h-4 w-4 inline" />
                )
              ) : null}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {result.rows.map((row, i) => (
          <tr
            key={i}
            className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
          >
            {Object.values(row).map((value, j) => (
              <td key={j} className="px-6 py-4">
                {renderValue(value)}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
};
