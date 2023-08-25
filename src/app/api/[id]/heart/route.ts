/**
 * 1. 컴포넌트 : src\app\api\[id]\heart\route.ts
 * 2. 작성일 : 2023.08.25 / 17시 45분 22초
 * 3. 작성자 : 홍예림
 * 4. 설명 : 게시물 heart 클릭시 user 별 세팅되는 api 모듈
 */

import { NextResponse } from "next/server";
import { getDoc, doc, updateDoc } from "firebase/firestore";
import { db } from "../../../firebase";
import { getServerSession } from "next-auth";

export async function POST(req: Request, res: Response) {
  const data = await req.json();
  const { title } = data;

  const session = await getServerSession();

  if (!data) return NextResponse.json({ message: "Missing Data" });
  // const commentData = doc(db, "comment", "1691116346");
  const userData = doc(db, "user", session?.user?.email as string);
  const postData = doc(db, "posts", title);

  const user = await getDoc(userData);
  const post = await getDoc(postData);
  // const comment = await getDoc(commentData);

  // const newComment = comment.data();
  // newComment.id = comment.id;
  // if (newComment.userInfo) {
  //   newComment.userInfo.get().then((res) => {
  //     newComment.userData = res.data;
  //     console.log(newComment);
  //   });
  // }

  try {
    if (session?.user?.email && data) {
      /** 사용자가 원하는 heart 상태  */
      const userHeart = !user.data()?.heart[title];

      await updateDoc(userData, {
        heart: { ...user.data()?.heart, [title]: userHeart },
      });
      await updateDoc(postData, {
        heart: { ...post.data()?.heart, [session?.user?.email]: userHeart },
        heart_count: userHeart ? post.data()?.heart_count + 1 : post.data()?.heart_count - 1,
      });

      const updatedPost = await getDoc(doc(db, "posts", title));

      return NextResponse.json({
        message: "success!",
        post: updatedPost.data(),
      });
    }
  } catch (err) {
    console.log(err);
  }
}
