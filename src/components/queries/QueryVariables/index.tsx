"use client";

import { useForm, SubmitHandler } from "react-hook-form";
import { queryArgumentsAndValues } from "@/lib/queries/variables";
import { useRouter } from "next/navigation";
import { FC } from "react";
import QueryVariableInput from "./Input";
import { useDebouncedCallback } from "use-debounce";

type Props = {
  query: string;
  params?: URLSearchParams;
};

const QueryVariables: FC<Props> = ({ query, params }) => {
  const router = useRouter();
  const { register, handleSubmit, setValue } = useForm<any>();

  const onSubmit: SubmitHandler<any> = (data) => {
    console.log(data);
    const url = new URL(window.location.pathname, window.location.origin);
    router.push(`${url.pathname}?${new URLSearchParams(data).toString()}`);
  };

  return (
    <div className="bg-neutral-200 p-4 rounded-md my-8">
      <form onSubmit={handleSubmit(onSubmit)}>
        <h3 className="text-xl">Arguments</h3>
        {queryArgumentsAndValues({
          query,
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
