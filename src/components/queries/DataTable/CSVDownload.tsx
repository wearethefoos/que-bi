"use client";

import { useQuery } from "@/hooks/useQuery";

type Props = {
  queryId: string;
};

export const CSVDownload = ({ queryId }: Props) => {
  const { query, loading } = useQuery(queryId);

  const convertToCSV = () => {
    const data = query?.run?.result;
    if (!data) {
      alert("No data to download");
      return "";
    }

    const keys = data.fields.map((field) => field.name);
    const values = data.rows.map((row) => Object.values(row).join(","));

    return [keys, ...values].join("\n");
  };

  const download = () => {
    var encodedUri = encodeURI(convertToCSV());
    var link = document.createElement("a");
    link.setAttribute("href", `data:text/csv;charset=utf-8,${encodedUri}`);
    link.setAttribute("download", `${query?.name}.csv`);
    document.body.appendChild(link);
    link.click();
  };

  return (
    <button
      className="bg-teal-500 text-white px-4 py-2 rounded-md mt-4"
      onClick={() => download()}
      disabled={loading}
    >
      Download CSV
    </button>
  );
};
