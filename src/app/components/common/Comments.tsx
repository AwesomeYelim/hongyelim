/* eslint-disable @next/next/no-img-element */
"use client";

import { CommentEl } from "@/service/posts";
import axios from "axios";
import { useSession } from "next-auth/react";
import { useQuery } from "react-query";
import { getTargetPostApi } from "./functions/myapi";
import { useEffect, useState } from "react";
import { AddComment, AddProps } from "./AddComment";
import { Session } from "next-auth";

import "./Comments.scss";
import dateFn from "./functions/date";

export const Comments = ({ title }: { title: string }): JSX.Element => {
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

  const Comment = (el: CommentEl) => {
    const createdAt = el.com_created_at;
    const lastAt = createdAt[createdAt.length - 1];
    addProps["com_created_at"] = el.com_created_at;
    addProps["lastAt"] = lastAt;
    addProps["setOpenReply"] = setOpenReply;

    return (
      <div
        className="commentedEl_wrap"
        style={{ marginLeft: 15 * createdAt.length }}
      >
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
                  com_created_at: [lastAt],
                });
              }}
            />
          )}
        </div>
        <span>{dateFn(lastAt)}</span>
        <p>{el.contents}</p>
        {openReply?.[lastAt] ? (
          <>
            <AddComment {...addProps} />
            <span
              className="cm_cancel"
              onClick={() => {
                setOpenReply({ [lastAt]: false });
              }}
            >
              취소하기
            </span>
          </>
        ) : (
          <p
            className="cm_reply"
            onClick={() => {
              setOpenReply({ [lastAt]: true });
            }}
          >
            <span>⏎</span>답글 달기
          </p>
        )}
        {!!el.children?.length &&
          el.children.map((child) => {
            return <Comment key={JSON.stringify(child)} {...child} />;
          })}
      </div>
    );
  };

  return (
    <>
      <div className="comment_wrap">
        <AddComment {...addProps} />
        <div className="commented_wrap">
          {data &&
            comments?.map((el: CommentEl) => {
              return <Comment key={JSON.stringify(el)} {...el} />;
            })}
        </div>
      </div>
    </>
  );
};
