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
import { transporter } from "@/app/nodemail";

export const sendEmail = async ({ arr, target, title }: { arr: CommentEl[]; target: CommentEl; title: string }) => {
  const relatedCo = arr.filter((item) => {
    const {com_created_at : ic, userInfo : {email : ie}} = item // prettier-ignore
    const {com_created_at : tc, userInfo : {email : te}} = target // prettier-ignore

    return tc.includes(ic.at(-1) as number) && ie !== te;
  });

  [...new Set(relatedCo.map((el) => el.userInfo.email))].forEach(async (email) => {
    transporter.sendMail(
      {
        from: `"Yelim Blog" <${process.env.NEXT_PUBLIC_NODEMAILER_USER}>`,
        to: email,
        subject: `${title} 게시물 comments`,
        text: `${target.userInfo.name} : ${target.contents}`,
      },
      (err, info) => {
        if (err) console.error(err);
        if (info) return info;
      }
    );
  });
};

export const commentsTree = (arr: CommentEl[]) => {
  /** length 긴 -> 적 */
  arr = arr.sort((a, b) => {
    const ac = a.com_created_at;
    const bc = b.com_created_at;
    const [al, bl] = [ac.at(-1), bc.at(-1)] as number[];
    if (ac.length === bc.length) return bl - al;
    return bc.length - ac.length;
  });

  const lengthOne = arr.filter((highData) => {
    [...arr].forEach((data) => {
      const h = highData.com_created_at;
      const d = data.com_created_at;
      const duplePrevent = !highData.children?.map((el) => el.com_created_at.at(-1)).includes(d.at(-1));

      if (h.at(-1) === d.at(-2) && duplePrevent) {
        (highData.children || (highData.children = [])).push(data);
      }
    });

    return highData?.com_created_at?.length === 1;
  });
  return lengthOne;
};

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
    ...user.data(),
    comments: user.data()?.comments
      ? {
          ...user.data()?.comments,
          [title]: user.data()?.comments[title] ? [...user.data()?.comments[title], rest] : [rest],
        }
      : { [title]: [rest] },
  });

  await updateDoc(postData, {
    comments: [...post.data()?.comments, { ...data }],
  });

  sendEmail({ arr: [...post.data()?.comments], target: data, title });

  const updatedPost = await getDoc(doc(db, "posts", title));

  return NextResponse.json({
    message: "success!",
    post: {
      ...updatedPost.data(),
      comments: commentsTree(updatedPost?.data()?.comments),
    },
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
              const c = el.com_created_at;
              // const target = c[c.length - 1];
              return !c.includes(+(targetKey as string));
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
        return !c.includes(+(targetKey as string));
      }),
    ],
  });

  const updatedPost = await getDoc(doc(db, "posts", title));

  return NextResponse.json({
    message: "success!",
    post: {
      ...updatedPost.data(),
      comments: commentsTree(updatedPost?.data()?.comments),
    },
  });
}
