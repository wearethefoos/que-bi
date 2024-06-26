"use client";

import { FC, useEffect, useState } from "react";
import Editor from "./editor";
import { useForm, SubmitHandler } from "react-hook-form";
import request from "axios";
import { Query } from "@prisma/client";
import { useRouter } from "next/navigation";
import Link from "next/link";

type Props = Partial<Query>;

export const QueryForm: FC<Props> = (props) => {
  const [query, setQuery] = useState(props.query || "-- write your query here");
  const router = useRouter();
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<Query>({
    defaultValues: {
      ...props,
      query,
    },
  });

  useEffect(() => {
    if (props.id && setValue) {
      request
        .get(`/api/queries/${props.id}`)
        .then((res) => {
          setValue("query", res.data.query);
          setQuery(res.data.query);
        })
        .catch((err) => {
          console.error("error", err);
        });
    }
  }, [props.id, setValue]);

  const updateQuery = (value: string) => {
    setValue("query", value);
    setQuery(value);
  };

  const onSubmit: SubmitHandler<Query> = (data) => {
    console.log(data);
    if (data.id) {
      request
        .put(`/api/queries/${data.id}`, data)
        .then((res) => {
          console.log("success", res);
          router.push(`/queries/${data.id}`);
        })
        .catch((err) => {
          console.error("error", err);
        });
      return;
    }

    request
      .post("/api/queries", data)
      .then((res) => {
        console.log("success", res);
        router.push(`/queries/${res.data.id}`);
      })
      .catch((err) => {
        console.error("error", err);
      });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="flex flex-col mt-8">
        <label className="text-lg font-bold">Query Name</label>
        <input
          className="border border-gray-200 dark:bg-gray-800 dark:border-gray-800 rounded-md p-2 mt-1"
          {...register("name", { required: true })}
        />
        {errors.name && (
          <span className="text-red-500">A name is required</span>
        )}
      </div>
      <div className="flex flex-col mt-8">
        <label className="text-lg font-bold">Query</label>
        <Editor
          value={query}
          setValue={updateQuery}
          {...register("query", { required: true })}
        />
      </div>
      <div className="flex flex-col mt-8">
        <label className="text-lg font-bold">Description</label>
        <textarea
          className="border border-gray-200 dark:bg-gray-800 dark:border-gray-800 rounded-md p-2 mt-1 h-64"
          {...register("description")}
        />
      </div>
      {/* <div className="flex flex-col mt-8">
    <label className="text-lg font-bold">Tags</label>
    <input className="border border-gray-300 rounded-md p-2 mt-2" />
  </div> */}
      <div className="flex flex-row mt-8 items-center gap-4 justify-end">
        {props.id && <Link href={`/queries/${props.id}`}>Cancel</Link>}
        <button className="bg-blue-500 text-white rounded-md p-2 mt-2">
          Save
        </button>
      </div>
    </form>
  );
};
