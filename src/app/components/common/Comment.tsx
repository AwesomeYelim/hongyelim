/* eslint-disable @next/next/no-img-element */
"use client";

import { CommentEl, Post, User } from "@/service/posts";
import { useSession } from "next-auth/react";
import { useForm } from "react-hook-form";
import { useQuery, useMutation, useQueryClient } from "react-query";
import { getTargetPostApi } from "./functions/myapi";
import { useEffect, useState } from "react";
import axios from "axios";

import "./Comment.scss";

export const Comment = (props: Post): JSX.Element => {
  const { data: session } = useSession();
  const { id, title } = props;
  const [comments, setComments] = useState([]);

  const { data } = useQuery({
    queryKey: `${id}_${title}`,
    queryFn: (data) => getTargetPostApi(data.queryKey[0]),
  });

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
          "Content-Type": `application/json`,
        },
      })
      .then((res) => {
        setComments(res.data.post.comments);
      });
  };

  const deleteCommentApi = async (data: CommentEl & { queryKey: string }) => {
    await axios.delete(`/api/${data.queryKey}/comment`, { data }).then((res) => {
      setComments(res.data.post.comments);
    });
  };

  const mutation = useMutation({
    mutationFn: postsCommentApi,
    onSuccess: () => {
      setValue("content", "");
      queryClient.invalidateQueries({ queryKey: `${id}_${title}` });
    },
  });

  useEffect(() => {
    setComments(data?.post?.comments);
  }, [data?.post?.comments]);

  return (
    <>
      <div className="comment_wrap">
        <form
          onSubmit={handleSubmit((data) => {
            return mutation.mutate({
              queryKey: `${id}_${title}`,
              contents: data.content,
              userInfo: session?.user as User,
              com_created_at: Math.floor(+new Date() / 1000),
            });
          })}>
          <label>comment</label>
          <textarea
            {...register("content", {
              required: { value: true, message: "is required" },
            })}
            placeholder={session?.user ? "댓글을 작성하세요." : "댓글 작성은 로그인이 필요합니다. 🐧"}
            disabled={!session?.user}
          />
          {errors.content && <p>{errors.content.message as string}</p>}
          <button type="submit" disabled={!session?.user}>
            Submit
          </button>
        </form>
        <div className="commented-wrap">
          {data &&
            comments?.map((el: CommentEl) => {
              const date = new Date(el.com_created_at * 1000).toLocaleDateString("ko-kr", {
                year: "numeric",
                month: "short",
                day: "numeric",
              });

              return (
                <div className="commentedEl-wrap" key={el.com_created_at}>
                  <div className="cm_img_wrap">
                    <img
                      src={el.userInfo.image}
                      style={{ width: 25, height: 25, borderRadius: "50%" }}
                      alt="comment-img"
                    />
                    {el.userInfo.name}
                    {el.userInfo.email === session?.user?.email && (
                      <i
                        className="bin"
                        onClick={() => {
                          deleteCommentApi({ ...el, queryKey: `${id}_${title}` });
                        }}
                      />
                    )}
                  </div>
                  <span>{date}</span>
                  <p>{el.contents}</p>
                </div>
              );
            })}
        </div>
      </div>
    </>
  );
};
