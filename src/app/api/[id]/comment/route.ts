/**
 * 1. 컴포넌트 : src\app\api\[id]\comment\route.ts
 * 2. 작성일 : 2023.08.25 / 17시 45분 22초
 * 3. 작성자 : 홍예림
 * 4. 설명 : 게시물 comment 추가
 */

import { NextResponse } from "next/server";
import { getDoc, doc, updateDoc } from "firebase/firestore";
import { db } from "../../../firebase";
import { getServerSession } from "next-auth";

export async function POST(req: Request, res: Response) {
  const data = await req.json();
  const title = data.queryKey.split("_")[1];

  const postData = doc(db, "posts", title);

  const post = await getDoc(postData);

  await updateDoc(postData, {
    comments: [...post.data()?.comments, { ...data }],
  });
  // const newComment = comment.data();
  // newComment.id = comment.id;
  // if (newComment.userInfo) {
  //   newComment.userInfo.get().then((res) => {
  //     newComment.userData = res.data;
  //     console.log(newComment);
  //   });
  // }

  return NextResponse.json({
    message: "success!",
  });
}
