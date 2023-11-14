import React, { Dispatch } from "react";
import { useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "react-query";
import axios from "axios";
import { CommentEl, User } from "@/service/posts";
import { Session } from "next-auth";
import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { db } from "@/app/firebase";
import { commentsTree, sendEmail } from "@/app/api/[id]/comment/route";

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

    const title = data.queryKey;

    const userData = doc(db, "user", session?.user?.email as string);
    const user = await getDoc(userData);

    const postData = doc(db, "posts", title);
    const post = await getDoc(postData);

    const { userInfo, ...rest } = data;

    /** 사용자별 게시물 comments 상태  업데이트 */
    await setDoc(userData, {
      ...user.data(),
      comments: user.data()?.comments
        ? {
            ...user.data()?.comments,
            [title]: user.data()?.comments[title]
              ? [...user.data()?.comments[title], rest]
              : [rest],
          }
        : { [title]: [rest] },
    });

    await updateDoc(postData, {
      comments: [...post.data()?.comments, { ...data }],
    });

    sendEmail({ arr: [...post.data()?.comments], target: data, title });

    const updatedPost = await getDoc(doc(db, "posts", title));

    setComments(commentsTree(updatedPost?.data()?.comments));

    // await axios
    //   .post(`/api/${data.queryKey}/comment`, JSON.stringify(data), {
    //     headers: {
    //       "Content-Type": `application/json`,
    //     },
    //   })
    //   .then((res) => {
    //     setComments(res.data.post.comments);
    //   });
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
