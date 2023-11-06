import React, { Dispatch } from "react";
import { useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "react-query";
import axios from "axios";
import { CommentEl, User } from "@/service/posts";
import { Session } from "next-auth";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/app/firebase";

export interface AddProps {
  com_created_at?: number[];
  comments: CommentEl[];
  setComments: Dispatch<CommentEl[]>;
  title: string;
  session: Session;
  lastAt?: number;
  setOpenReply?: Dispatch<{ [key in number]: boolean }>;
}

export const AddComment = (props: AddProps) => {
  const {
    comments,
    setComments,
    title,
    session,
    com_created_at,
    setOpenReply,
    lastAt,
  } = props;

  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm();

  const postsCommentApi = async (data: CommentEl & { queryKey: string }) => {
    if (data["children"]) delete data["children"];


    await axios
      .post(`/api/${data.queryKey}/comment`, JSON.stringify(data), {
        headers: {
          // "Cache-Control": "no-store",
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
      (setOpenReply as Dispatch<{ [key in number]: boolean }>)({
        [lastAt as number]: false,
      });
      queryClient.invalidateQueries({ queryKey: title });
    },
  });

  return (
    <form
      style={{ left: com_created_at ? 40 : 0 }}
      onSubmit={handleSubmit((data) => {
        return mutation.mutate({
          queryKey: title,
          contents: data.content,
          userInfo: session?.user as User,
          com_created_at: com_created_at
            ? [...com_created_at, Math.floor(+new Date() / 1000)]
            : [Math.floor(+new Date() / 1000)],
        });
      })}
    >
      {!com_created_at && <label>comment</label>}
      <textarea
        {...register("content", {
          required: { value: true, message: "is required" },
        })}
        placeholder={
          session?.user
            ? "댓글을 작성하세요."
            : "댓글 작성은 로그인이 필요합니다. 🐧"
        }
        disabled={!session?.user}
      />
      {errors.content && <p>{errors.content.message as string}</p>}
      <button type="submit" disabled={!session?.user}>
        Submit
      </button>
    </form>
  );
};
