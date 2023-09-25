import React, { Dispatch, SetStateAction, useState } from "react";
import { useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "react-query";
import axios from "axios";
import { CommentEl, User } from "@/service/posts";
import { Session } from "next-auth";

export interface AddProps {
  com_created_at?: number[];
  comments: CommentEl[];
  setComments: Dispatch<CommentEl[]>;
  title: string;
  session: Session;
}

export const AddComment = (props: AddProps) => {
  const { comments, setComments, title, session, com_created_at } = props;
  console.log(props);

  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm();

  const postsCommentApi = async (data: CommentEl & { queryKey: string }) => {
    await axios
      .post(`/api/${data.queryKey}/comment`, JSON.stringify(data), {
        headers: {
          "Cache-Control": "no-store",
          "Content-Type": `application/json`,
        },
      })
      .then((res) => {
        setComments(res.data.post.comments);
      });
  };

  const mutation = useMutation({
    mutationFn: postsCommentApi,
    onSuccess: () => {
      setValue("content", "");
      queryClient.invalidateQueries({ queryKey: title });
    },
  });

  return (
    <form
      onSubmit={handleSubmit((data) => {
        return mutation.mutate({
          queryKey: title,
          contents: data.content,
          userInfo: session?.user as User,
          com_created_at: com_created_at
            ? [...com_created_at, Math.floor(+new Date() / 1000)]
            : [Math.floor(+new Date() / 1000)],
        });
      })}>
      <label>comment</label>
      <textarea
        {...register("content")}
        placeholder={session?.user ? "댓글을 작성하세요." : "댓글 작성은 로그인이 필요합니다. 🐧"}
        disabled={!session?.user}
      />
      {errors.content && <p>{errors.content.message as string}</p>}
      <button type="submit" disabled={!session?.user}>
        Submit
      </button>
    </form>
  );
};
