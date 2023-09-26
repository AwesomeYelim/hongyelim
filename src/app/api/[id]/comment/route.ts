/**
 * 1. 컴포넌트 : src\app\api\[id]\comment\route.ts
 * 2. 작성일 : 2023.08.25 / 17시 45분 22초
 * 3. 작성자 : 홍예림
 * 4. 설명 : 게시물 comment 추가 및 삭제
 */

import { CommentEl } from "@/service/posts";
import { NextResponse } from "next/server";
import { getDoc, doc, updateDoc, setDoc } from "firebase/firestore";
import { db } from "../../../firebase";
import { getServerSession } from "next-auth";

export async function POST(req: Request, res: Response) {
  const data = await req.json();
  const title = data.queryKey;
  const session = await getServerSession();

  const userData = doc(db, "user", session?.user?.email as string);
  const user = await getDoc(userData);

  const postData = doc(db, "posts", title);
  const post = await getDoc(postData);

  const { userInfo, ...rest } = data;

  /** 사용자별 게시물 comments 상태  업데이트 */
  await setDoc(userData, {
    comments: {
      ...user.data()?.comments,
      [title]: user.data()?.comments[title]
        ? [...user.data()?.comments[title], rest]
        : [rest],
    },
  });

  const commentsTree = [...post.data()?.comments, { ...data }]
    .map((data: CommentEl, i, arr) => {
      const par = data?.com_created_at?.every((el) =>
        arr[i + 1]?.com_created_at?.includes(el)
      );

      if (par) {
        (data.children || (data.children = [])).push(arr[i + 1]);
      }

      return data;
    })
    .filter((data) => data?.com_created_at?.length === 1);


  await updateDoc(postData, {
    comments: commentsTree,
  });

  const updatedPost = await getDoc(doc(db, "posts", title));

  return NextResponse.json({
    message: "success!",
    post: updatedPost.data(),
  });
}

export async function DELETE(req: Request) {
  const { searchParams } = new URL(req.url);
  const targetKey = searchParams.get("data[com_created_at][0]");
  const queryKey = searchParams.get("data[queryKey]");
  const title = queryKey as string;
  const session = await getServerSession();

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
              const target = el.com_created_at[el.com_created_at.length - 1];
              return target !== +(targetKey as string);
            }),
          ]
        : [],
    },
  });

  await updateDoc(postData, {
    comments: [
      ...post.data()?.comments.filter((el: CommentEl) => {
        const target = el.com_created_at[el.com_created_at.length - 1];
        return target !== +(targetKey as string);
      }),
    ],
  });

  const updatedPost = await getDoc(doc(db, "posts", title));

  return NextResponse.json({
    message: "success!",
    post: updatedPost.data(),
  });
}
