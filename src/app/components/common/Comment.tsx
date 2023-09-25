/* eslint-disable @next/next/no-img-element */
"use client";

import { CommentEl, Post, User } from "@/service/posts";
import axios from "axios";
import { useSession } from "next-auth/react";
import { useQuery } from "react-query";
import { getTargetPostApi } from "./functions/myapi";
import { Dispatch, useEffect, useState } from "react";
import { AddComment, AddProps } from "./AddComment";
import { Session } from "next-auth";

import "./Comment.scss";

export const Comment = ({ title }: { title: string }): JSX.Element => {
  const { data: session } = useSession();

  const [comments, setComments] = useState<CommentEl[]>([]);
  const [openReply, setOpenReply] = useState<{ [key in number]: boolean }>();

  const { data } = useQuery({
    queryKey: title,
    queryFn: (data) => getTargetPostApi(data.queryKey[0]),
  });

  const deleteCommentApi = async (data: CommentEl & { queryKey: string }) => {
    await axios
      .delete(`/api/${data.queryKey}/comment`, {
        headers: {
          "Cache-Control": "no-store",
        },
        params: { data },
      })
      .then((res) => {
        setComments(res.data.post.comments);
      });
  };

  useEffect(() => {
    setComments(data?.post?.comments as CommentEl[]);
  }, [data?.post?.comments]);

  const addProps: AddProps = {
    comments,
    setComments,
    title,
    session: session as Session,
  };

  return (
    <>
      <div className="comment_wrap">
        <AddComment {...addProps} />
        <div className="commented_wrap">
          {data &&
            comments?.map((el: CommentEl) => {
              const createdAt = el.com_created_at;
              const lastAt = createdAt[createdAt.length - 1];
              const date = new Date(lastAt * 1000).toLocaleDateString("ko-kr", {
                year: "numeric",
                month: "short",
                day: "numeric",
              });

              addProps["com_created_at"] = el.com_created_at;

              return (
                <div className="commentedEl_wrap" key={JSON.stringify(el.com_created_at)}>
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
                          deleteCommentApi({
                            ...el,
                            queryKey: title,
                          });
                        }}
                      />
                    )}
                  </div>
                  <span>{date}</span>
                  <p>{el.contents}</p>
                  {openReply?.[lastAt] ? (
                    <>
                      <AddComment {...addProps} />
                      <span
                        className="cm_cancel"
                        onClick={() => {
                          setOpenReply({ [lastAt]: false });
                        }}>
                        취소하기
                      </span>
                    </>
                  ) : (
                    <p
                      className="cm_reply"
                      onClick={() => {
                        setOpenReply({ [lastAt]: true });

                        // const newReply = {
                        //   com_created_at: Math.floor(new Date().getTime() / 1000),
                        //   contents: "",
                        //   userInfo: session?.user as User,
                        //   children: [],
                        // };
                        // el.children = el.children
                        //   ? [...el.children, newReply]
                        //   : [newReply];
                      }}>
                      <span>⏎</span>답글 달기
                    </p>
                  )}
                  {/* <Comment /> */}
                </div>
              );
            })}
        </div>
      </div>
    </>
  );
};
