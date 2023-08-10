"use client";

import axios from "axios";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Props } from "../Tag";
import { MdfileViewer } from "./MdfileViewer";

export const Add = ({ selected, setSelected }: Props): JSX.Element => {
  const [content, setContent] = useState("");
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    getValues,
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
        setContent("");
      });
  };

  const click = async () => {
    await axios.get("/api/dbconfig").then((res) => {
      console.log(res.data);
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

        <div className="content_wrap">
          <div className="write_area">
            <label>Content (add / generate)</label>
            <textarea
              {...register("content", { required: { value: true, message: "is required" } })}
              onChange={(e) => {
                setContent(e.currentTarget.value);
              }}
              // onKeyDown={(e) => {
              //   console.log((e.target as EventTarget & { value: string }).value);
              // }}
            />
          </div>
          <div className="written_area">
            <label>Viwer</label>
            <MdfileViewer mdPost={content} />
          </div>
        </div>
        {errors.content && <p>{errors.content.message as string}</p>}
        <button type="submit" onClick={click}>
          Submit
        </button>
      </form>
    </div>
  );
};
