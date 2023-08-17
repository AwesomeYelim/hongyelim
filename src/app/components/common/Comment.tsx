/* eslint-disable @next/next/no-img-element */
"use client";

import { CommentEl, Post } from "@/service/posts";
import { useSession } from "next-auth/react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useQuery } from "react-query";
import { getTargetPostApi } from "./functions/myapi";
import "./Comment.scss";

export const Comment = (props: Post): JSX.Element => {
  const { data: session } = useSession();
  const { id, title } = props;

  const [comments, setComments] = useState("");
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    getValues,
    // setError,
  } = useForm();

  const { data } = useQuery({
    queryKey: `${id}_${title}`,
    queryFn: (data) => getTargetPostApi(data.queryKey[0]),
  });

  return (
    <div className="comment_wrap">
      <form onSubmit={handleSubmit(() => {})}>
        <label>comment</label>
        <textarea
          {...register("content", {
            required: { value: true, message: "is required" },
          })}
          onChange={(e) => {
            setComments(e.currentTarget.value);
          }}
          placeholder="댓글을 작성하세요."
        />
        {errors.content && <p>{errors.content.message as string}</p>}
        <button type="submit">Submit</button>
      </form>
      <div className="commented-wrap">
        {data &&
          data.post.comment.map((el: CommentEl) => {
            const date = new Date(el.com_created_at * 1000).toLocaleDateString("ko-kr", {
              year: "numeric",
              month: "short",
              day: "numeric",
            });
            return (
              <div className="commentedEl-wrap" key={el.com_created_at}>
                <div className="cm_img_wrap">
                  <img src={el.img} style={{ width: 25, height: 25, borderRadius: "50%" }} alt="comment-img" />
                  {el.user_name}
                </div>
                <span>{date}</span>
                <p>{el.content}</p>
              </div>
            );
          })}
      </div>
    </div>
  );
};
