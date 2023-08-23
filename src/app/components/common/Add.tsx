"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { Props } from "../Tag";
import { MdfileViewer } from "./MdfileViewer";
import { useMutation, useQueryClient } from "react-query";
import { postsAddApi } from "./functions/myapi";

export const Add = ({ selected, setSelected }: Omit<Props, "posts">): JSX.Element => {
  const [content, setContent] = useState("");
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    getValues,
    // setError,
  } = useForm();

  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: postsAddApi,
    onSuccess: () => {
      if (setSelected) setSelected({ keyword: "" });
      setValue("content", "");
      setValue("title", "");
      setContent("");
      queryClient.invalidateQueries({ queryKey: "postsData" });
    },
  });

  return (
    <div className="memo_wrap">
      <form onSubmit={handleSubmit((data) => mutation.mutate(data))}>
        <label>Title</label>
        <input
          {...register("title", {
            required: { value: true, message: "is required" },
            pattern: {
              value: /^[a-zA-Z0-9]*$/,
              message: "only english words and number are allowed",
            },
            value: selected?.keyword,
            onChange(e) {
              if (setSelected) {
                setSelected({ keyword: e.currentTarget.value });
              }
            },
          })}
          value={selected?.keyword}
        />
        {errors.title && <p>{errors.title.message as string}</p>}

        <div className="content_wrap">
          <div className="write_area">
            <label>Content (add / generate)</label>
            <textarea
              {...register("content", {
                required: { value: true, message: "is required" },
              })}
              onChange={(e) => {
                setContent(e.currentTarget.value);
              }}
            />
          </div>
          <div className="written_area">
            <label>Viwer</label>
            <MdfileViewer mdPost={content} />
          </div>
        </div>
        {errors.content && <p>{errors.content.message as string}</p>}
        <button type="submit">Submit</button>
      </form>
    </div>
  );
};
