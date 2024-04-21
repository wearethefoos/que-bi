"use client";

import { FC } from "react";
import { ArrowUpIcon, ArrowDownIcon } from "@heroicons/react/20/solid";
import { useQuery } from "@/hooks/useQuery";
import classnames from "classnames";
import classNames from "classnames";
import { CSVDownload } from "./CSVDownload";

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

  const result = query?.run?.result;

  if (!result) {
    return null;
  }

  return (
    <div className="overflow-x-auto">
      <header>
        <h2 className="text-lg font-semibold text-gray-700 dark:text-gray-200">
          {query.name}
        </h2>
        <CSVDownload queryId={id} />
      </header>
      <table
        className={classnames(
          "my-24 table-fixed w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400 rounded-md",
          loading && "animate-pulse",
        )}
      >
        <thead className="text-xs text-gray-700 uppercase bg-gray-100 dark:bg-gray-700 dark:text-gray-400">
          <tr>
            {result.fields.map((field, i) => (
              <th
                scope="col"
                className={classNames(
                  "px-6 py-3",
                  i === 0 && "rounded-tl-md",
                  i === result.fields.length - 1 && "rounded-tr-md",
                )}
                key={field.name}
              >
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
              className={classNames(
                "bg-white dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600",
                i !== result.rows.length - 1 && "border-b",
              )}
            >
              {Object.values(row).map((value, j) => (
                <td
                  key={j}
                  className={classNames(
                    "px-6 py-4",
                    i === result.rows.length - 1 && j === 0 && "rounded-bl-md",
                    i === result.rows.length - 1 &&
                      j === result.fields.length - 1 &&
                      "rounded-br-md",
                  )}
                >
                  {renderValue(value)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
