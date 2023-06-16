import fs from "fs";
import { getPosts, Post } from "@/service/posts";
import { NextResponse } from "next/server";
import path from "path";

export async function POST(req: Request, res: Response) {
  const data = await req.json();
  let posts = await getPosts();

  process.cwd();
  const filePath = path.join(process.cwd(), "data", "posts.json");
  if (!data) return NextResponse.json({ message: "Missing Data" });

  posts = posts.map((item) => {
    if (item.id === data.id) {
      return {
        ...item,
        like: item.like + 1,
      };
    }
    return item;
  }) as Post[];

  fs.writeFile(filePath, JSON.stringify(posts, null, 3), (err) => {
    NextResponse.json({ message: err });
  });

  return NextResponse.json({ message: "성공쓰~" });
}
