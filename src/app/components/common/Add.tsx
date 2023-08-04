"use client";

import axios from "axios";
import { FormEvent } from "react";
import { useForm } from "react-hook-form";

export const Add = (): JSX.Element => {
  const {
    register,
    handleSubmit,
    formState: { errors },
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
      });
  };

  return (
    <div className="contact_wrap">
      {/* <h1>무엇을 추가할 것인가 쿄쿄쿄</h1> */}

      {/* <textarea
        onKeyDown={(e) => {
          console.log((e.target as EventTarget & { value: string }).value);
        }}
      /> */}
      <form onSubmit={handleSubmit(submitHandler)}>
        <input {...register("title")} />
        <input {...register("content", { required: true })} />
        {errors.lastName && <p>Last name is required.</p>}
        {/* <input {...register("age", { pattern: /\d+/ })} /> */}
        {errors.age && <p>Please enter number for age.</p>}
        <input type="submit" />
      </form>
    </div>
  );
};
