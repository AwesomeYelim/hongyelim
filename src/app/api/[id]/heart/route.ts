/**
 * 1. 컴포넌트 : src\app\api\[id]\heart\route.ts
 * 2. 작성일 : 2023.08.25 / 17시 45분 22초
 * 3. 작성자 : 홍예림
 * 4. 설명 : 게시물 heart 클릭시 user 별 세팅되는 api 모듈
 */

import { NextResponse } from "next/server";
import { getDoc, doc, updateDoc, setDoc } from "firebase/firestore";
import { db } from "../../../firebase";
import { getServerSession } from "next-auth";

export async function POST(req: Request, res: Response) {
  const data = await req.json();
  const { title } = data;

  const session = await getServerSession();

  if (!data) return NextResponse.json({ message: "Missing Data" });
  const userData = doc(db, "user", session?.user?.email as string);
  const postData = doc(db, "posts", title);

  const user = await getDoc(userData);
  const post = () => getDoc(postData);

  try {
    if (session?.user?.email && data) {
      /** 사용자가 원하는 heart 상태  */
      const userHeart = user.data()?.heart ? !user.data()?.heart[title] : true;

      /** 사용자별 게시물 heart 상태 세팅 & 업데이트 */
      await setDoc(userData, {
        ...user.data(),
        heart: user.data()?.heart ? { ...user.data()?.heart, [title]: userHeart } : { [title]: userHeart },
      });

      /** 게시물별 heart 개수 상태 업데이트 */
      await updateDoc(postData, {
        heart: {
          ...(await post()).data()?.heart,
          [session?.user?.email]: userHeart,
        },
        heart_count: userHeart
          ? (await post()).data()?.heart_count + 1
          : (await post()).data()?.heart_count > 0 && (await post()).data()?.heart_count - 1,
      });

      return NextResponse.json({
        message: "success!",
        post: (await post()).data(),
      });
    }
  } catch (err) {
    console.log(err);
  }
}
