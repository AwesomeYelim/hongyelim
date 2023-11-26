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
import dateFn from "./functions/date";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "@/app/firebase";
import { commentsTree } from "@/app/api/[id]/comment/route";
import "./Comments.scss";

export const Comments = ({ title }: { title: string }): JSX.Element => {
  const { data: session } = useSession();

  const [comments, setComments] = useState<CommentEl[]>([]);
  const [openReply, setOpenReply] = useState<{ [key in number]: boolean }>();

  const { data } = useQuery({
    queryKey: title,
    queryFn: (data) => getTargetPostApi(data.queryKey[0]),
  });

  const deleteCommentApi = async (data: CommentEl & { queryKey: string }) => {
    const targetKey = data["com_created_at"][0];
    const title = data.queryKey as string;

    const postData = doc(db, "posts", title);
    const post = await getDoc(postData);

    const userData = doc(db, "user", session?.user?.email as string);
    const user = await getDoc(userData);

    /** 사용자별 게시물 comments 상태 세팅 & 업데이트 */
    await updateDoc(userData, {
      comments: {
        ...user.data()?.comments,
        [title]: user.data()?.comments[title]
          ? [
              ...user.data()?.comments[title]?.filter((el: CommentEl) => {
                const c = el.com_created_at;
                // const target = c[c.length - 1];
                return !c.includes(targetKey);
              }),
            ]
          : [],
      },
    });

    await updateDoc(postData, {
      comments: [
        ...post.data()?.comments.filter((el: CommentEl) => {
          const c = el.com_created_at;
          // const target = c[c.length - 1];
          // return target !== +(targetKey as string);
          return !c.includes(targetKey);
        }),
      ],
    });

    const updatedPost = await getDoc(doc(db, "posts", title));

    setComments(commentsTree(updatedPost?.data()?.comments));

    // await axios
    //   .delete(`/api/${data.queryKey}/comment`, {
    //     params: { data },
    //   })
    //   .then((res) => {
    //     setComments(res.data.post.comments);
    //   });
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
