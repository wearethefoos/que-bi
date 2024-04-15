"use client";

import { FC } from "react";
import { ArrowUpIcon, ArrowDownIcon } from "@heroicons/react/20/solid";
import { useQuery } from "@/hooks/useQuery";

export type Props = {
  id: string;
  data: {
    fields: string[];
    rows: any[];
    count: number;
  };
};

export const DataTable: FC<Props> = ({ id, data: { rows, fields } }) => {
  const { query, sortQueryBy, order, orderBy } = useQuery(id);

  const renderValue = (v: any) => {
    return (
      <span
        dangerouslySetInnerHTML={{
          __html: typeof v === "string" ? v : JSON.stringify(v),
        }}
      />
    );
  };

  return (
    <table className="my-24 table-fixed w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
      <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
        <tr>
          {query?.run?.result?.fields.map((field) => (
            <th scope="col" className="px-6 py-3" key={field.columnID}>
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
        {query?.run?.result?.rows.map((row, i) => (
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
