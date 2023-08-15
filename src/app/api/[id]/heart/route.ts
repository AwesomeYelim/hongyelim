import fs from "fs";
import { getPost, getPosts, Post } from "@/service/posts";
import { NextResponse } from "next/server";
import path from "path";

export async function POST(req: Request, res: Response) {
  const data = await req.json();
  const targetPost = await getPost(
    (res as Response & { params: { id: string } }).params.id
  );
  let posts = await getPosts();
  const clientIp = req.headers.get("x-forwarded-for");

  process.cwd();
  const filePath = path.join(process.cwd(), "data", "posts.json");
  if (!data) return NextResponse.json({ message: "Missing Data" });

  posts = posts.map((item) => {
    if (item.id === targetPost.post?.id) {
      return {
        ...item,
        like: !item.like,
        like_count: item.like ? item.like_count - 1 : item.like_count + 1,
      };
    }
    return item;
  }) as Post[];

  fs.writeFile(filePath, JSON.stringify(posts, null, 3), (err) => {
    NextResponse.json({ message: err });
  });

  return NextResponse.json({
    message: "성공쓰~",
    res: posts,
    clientIp,
  });
}
