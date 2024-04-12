import type { FieldDef } from "pg";
import { FC } from "react";

export type Props = {
  data: {
    fields: FieldDef[];
    rows: any[];
    count: number;
  };
};

export const DataTable: FC<Props> = ({ data: { rows, fields } }) => {
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
    <table>
      <thead>
        <tr>
          {Object.keys(rows[0]).map((key) => (
            <th key={key}>{key}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows.map((row, i) => (
          <tr key={i}>
            {Object.values(row).map((value, j) => (
              <td key={j}>{renderValue(value)}</td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
};
