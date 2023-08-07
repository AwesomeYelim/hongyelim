"use client";

import axios from "axios";
import { useForm } from "react-hook-form";
import { Props } from "../Tag";

export const Add = ({ selected, setSelected }: Props): JSX.Element => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
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
            required: true,
            pattern: {
              value: /^[a-zA-Z0-9]*$/,
              message: "사용할수 없는 식임",
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
        {errors.title && <p>title is required.</p>}
        <label>Content(추가할 내용 및 생성할 내용들)</label>
        <textarea
          {...register("content", { required: true })}
          // onKeyDown={(e) => {
          //   console.log((e.target as EventTarget & { value: string }).value);
          // }}
        />
        {errors.content && <p>Please enter contnent</p>}
        {/* <input {...register("age", { pattern: /\d+/ })} /> */}

        <button type="submit">제출</button>
      </form>
    </div>
  );
};
