"use client";

import axios from "axios";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { Props } from "../Tag";

export const Add = ({ selected, setSelected }: Props): JSX.Element => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    // setError,
  } = useForm();

  const submitHandler = async (data: { [key in string]: string }) => {
    await axios
      .post("/api/add", JSON.stringify(data), {
        headers: {
          "Content-Type": `application/json`,
        },
      })
      .then((res) => {
        console.log(res.data);
        if (setSelected) setSelected({ keyword: "" });
        setValue("content", "");
        setValue("title", "");
      });
  };

  return (
    <div className="memo_wrap">
      <form onSubmit={handleSubmit(submitHandler)}>
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
        <label>Content(추가할 내용 및 생성할 내용들)</label>
        <textarea
          {...register("content", { required: { value: true, message: "is required" } })}
          // onKeyDown={(e) => {
          //   console.log((e.target as EventTarget & { value: string }).value);
          // }}
        />
        {errors.content && <p>{errors.content.message as string}</p>}
        <button type="submit">제출</button>
      </form>
    </div>
  );
};
