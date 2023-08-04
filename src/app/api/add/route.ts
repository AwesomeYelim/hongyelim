import fs from "fs";
import { getPosts, Post } from "@/service/posts";
import { NextResponse } from "next/server";
import path from "path";

export async function POST(req: Request, res: Response) {
  const data = await req.json();
  let posts = await getPosts();

  const target = posts.find((item) => item.title === data.title);

  process.cwd();
  const filePath = path.join(process.cwd(), "data", "md", `${target?.id}_${target?.title}.md`);

  if (!data) return NextResponse.json({ message: "Missing Data" });

  let mdFile: Buffer | string = fs.readFileSync(filePath);
  mdFile = mdFile.toString() + `\n\n${data.content}`;

  console.log(mdFile);

  fs.writeFile(filePath, mdFile, (err) => {
    NextResponse.json({ message: err });
  });
  // const target = posts.find((item) => {
  //   return item.id === data.id;
  // });

  return NextResponse.json({
    message: "성공쓰~",
    res: posts,
  });
}
