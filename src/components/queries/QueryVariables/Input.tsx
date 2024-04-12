"use client";

import { HTMLProps, forwardRef } from "react";

export type QueryVariable = {
  name: string;
  type: string;
  value: any;
  options?: string[];
} & HTMLProps<HTMLInputElement>;

export const QueryVariableInput = forwardRef<any, QueryVariable>(
  ({ name, type, value, options, ...props }, ref) => {
    let inputType = "text";

    if (type === "DATE") {
      inputType = "date";
    } else if (type === "INT" || type === "FLOAT") {
      inputType = "number";
    }

    const select = options && options.length > 0;

    return (
      <div className="flex flex-col">
        <label className="text-sm font-semibold text-gray-600">{name}</label>
        {select ? (
          <select
            className="border border-gray-300 rounded-md p-2 mt-1"
            onChange={(e) => {
              const stub = { target: { value: e.target.value } };
              props.onChange?.(stub as any);
            }}
            defaultValue={value}
          >
            {options?.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        ) : (
          <input
            ref={ref}
            type={inputType}
            className="border border-gray-300 rounded-md p-2 mt-1"
            defaultValue={value}
            {...props}
          />
        )}
      </div>
    );
  },
);

QueryVariableInput.displayName = "QueryVariableInput";

export default QueryVariableInput;
