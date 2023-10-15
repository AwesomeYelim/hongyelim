"use client";

import { useForm } from "react-hook-form";
import { Selected } from "../Tag";
import MdfileViewer from "./MdfileViewer";
import { useMutation, useQueryClient } from "react-query";
import { postsAddApi } from "./functions/myapi";

export const Add = ({
  selected,
  setSelected,
}: {
  selected: Selected;
  setSelected: React.Dispatch<React.SetStateAction<Selected>>;
}): JSX.Element => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    // setError,
    watch,
  } = useForm();

  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: postsAddApi,
    onSuccess: () => {
      if (setSelected) setSelected({ keyword: "" });
      setValue("content", "");
      setValue("title", "");
      setValue("tag", "");
      setValue("sub", "");
      queryClient.invalidateQueries({ queryKey: "postsData" });
    },
  });

  return (
    <div className="memo_wrap">
      <form onSubmit={handleSubmit((data) => mutation.mutate(data))}>
        <label>Sub</label>
        <input
          {...register("sub", {
            required: { value: true, message: "is required" },
          })}
        />
        {errors.sub && <p>{errors.sub.message as string}</p>}
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

        <label>Tag</label>
        <input
          {...register("tag", {
            required: { value: true, message: "is required" },
            pattern: {
              value: /[a-zA-Z0-9],[a-zA-Z0-9]/g,
              message: "Please enter an English letter or a number containing commas",
            },
          })}
        />
        {errors.tag && <p>{errors.tag.message as string}</p>}

        <div className="content_wrap">
          <div className="write_area">
            <label>Content (add / generate)</label>
            <textarea
              {...register("content", {
                required: { value: true, message: "is required" },
              })}
            />
          </div>
          <div className="written_area">
            <label>Viwer</label>
            {/* <MdfileViewer mdPost={watch("content")} /> */}
          </div>
        </div>
        {errors.content && <p>{errors.content.message as string}</p>}
        <button type="submit">Submit</button>
      </form>
    </div>
  );
};
