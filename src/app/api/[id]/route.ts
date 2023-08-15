import { getPost, getPosts, Post } from "@/service/posts";
import { NextResponse } from "next/server";

export async function GET(req: Request, res: Response) {
  const data = req.json();
  const post = await getPost(
    (res as Response & { params: { id: string } }).params.id
  );
  return NextResponse.json(post);
}
