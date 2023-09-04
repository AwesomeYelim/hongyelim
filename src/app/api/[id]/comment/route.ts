/**
 * 1. 컴포넌트 : src\app\api\[id]\comment\route.ts
 * 2. 작성일 : 2023.08.25 / 17시 45분 22초
 * 3. 작성자 : 홍예림
 * 4. 설명 : 게시물 comment 추가 및 삭제
 */

import { CommentEl } from "@/service/posts";
import { NextResponse } from "next/server";
import { getDoc, doc, updateDoc } from "firebase/firestore";
import { db } from "../../../firebase";

export async function POST(req: Request, res: Response) {
  const data = await req.json();
  const title = data.queryKey.split("_")[1];

  const postData = doc(db, "posts", title);
  const post = await getDoc(postData);

  await updateDoc(postData, {
    comments: [...post.data()?.comments, { ...data }],
  });

  const updatedPost = await getDoc(doc(db, "posts", title));

  return NextResponse.json({
    message: "success!",
    post: updatedPost.data(),
  });
}

export async function DELETE(req: Request) {
  const { searchParams } = new URL(req.url);
  const targetKey = searchParams.get("data[com_created_at]");
  const queryKey = searchParams.get("data[queryKey]");
  const title = (queryKey as string).split("_")[1];

  const postData = doc(db, "posts", title);
  const post = await getDoc(postData);

  await updateDoc(postData, {
    comments: [
      ...post
        .data()
        ?.comments.filter(
          (el: CommentEl) => el.com_created_at !== +(targetKey as string)
        ),
    ],
  });

  const updatedPost = await getDoc(doc(db, "posts", title));

  return NextResponse.json({
    message: "success!",
    post: updatedPost.data(),
  });
}
