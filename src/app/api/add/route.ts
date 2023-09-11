import fs from "fs";
import { getPosts } from "@/service/posts";
import { NextResponse } from "next/server";
import path from "path";
import { doc, setDoc } from "firebase/firestore";
import { db } from "@/app/firebase";

export async function POST(req: Request, res: Response) {
  const data = await req.json();
  let posts = await getPosts();

  const target = posts.find((item) => item.title === data.title);

  process.cwd();

  const mdPath = (() => {
    if (target) {
      return path.join(process.cwd(), "data", "md", `${target?.title}.md`);
    } else {
      return path.join(process.cwd(), "data", "md", `${decodeURI(data.title)}.md`);
    }
  })();

  const postData = doc(db, "posts", data.title);

  // const filePath = path.join(process.cwd(), "data", "posts.json");

  if (!data) return NextResponse.json({ message: "Missing Data" });

  const isMd = fs.existsSync(mdPath);
  let mdFile: Buffer | string;

  /** 기존 md 유무에 따라 data 추가할지 수정할지 결정 */
  if (!isMd) {
    mdFile = `\n\n${data.content}`;

    await setDoc(postData, {
      id: posts.length + 1,
      title: data.title.replace(/\s/g, ""),
      content: (data.content.match(/#+\s(.+)/g) && data.content.match(/#+\s(.+)/g)[0]) || data.content,
      tag: data.tag.split(","),
      post_title: data.sub,
      heart: {},
      heart_count: 0,
      created_at: Math.floor(new Date().getTime() / 1000),
      comments: [],
    });
  } else {
    mdFile = fs.readFileSync(mdPath);
    mdFile = mdFile.toString() + `\n\n${data.content}`;
  }

  fs.writeFile(mdPath, mdFile, (err) => {
    NextResponse.json({ message: err });
  });

  return NextResponse.json({
    message: "성공쓰~",
    res: posts,
  });
}
