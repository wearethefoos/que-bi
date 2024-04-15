"use client";

import { useForm, SubmitHandler } from "react-hook-form";
import { queryArgumentsAndValues } from "@/lib/queries/variables";
import { useSearchParams } from "next/navigation";
import { FC } from "react";
import QueryVariableInput from "./Input";
import { useQuery } from "@/hooks/useQuery";
import classNames from "classnames";

type Props = {
  id: string;
};

const QueryVariables: FC<Props> = ({ id }) => {
  const { query, setParams, loading } = useQuery(id);
  const params = useSearchParams();
  const { register, handleSubmit, setValue, getValues } = useForm<any>();

  const onSubmit: SubmitHandler<any> = (data) => {
    setParams(new URLSearchParams(data));
  };

  if (!query) {
    return null;
  }

  for (const key of params.keys()) {
    setValue(key, params.get(key));
  }

  return (
    <div
      className={classNames(
        "bg-gray-200 dark:bg-gray-800 p-4 rounded-md my-8",
        loading && "animate-pulse",
      )}
    >
      <form onSubmit={handleSubmit(onSubmit)}>
        <h3 className="text-xl">Arguments</h3>
        {queryArgumentsAndValues({
          query: query.query,
          params,
        }).map((arg) => {
          const [value, type] = arg.value.split("::");
          return (
            <QueryVariableInput
              key={arg.name}
              type={type}
              value={value.replace(/'/g, "")}
              options={arg.options}
              {...register(arg.name)}
              onChange={(e: any) => setValue(arg.name, e.target.value)}
            />
          );
        })}
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded-md mt-4"
        >
          Run Query
        </button>
      </form>
    </div>
  );
};

export default QueryVariables;
