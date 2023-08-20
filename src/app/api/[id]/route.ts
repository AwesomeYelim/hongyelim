import { getPost, getPosts, Post } from "@/service/posts";
import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

export async function GET(req: Request, res: Response) {
  const prisma = new PrismaClient();
  // const posts = await prisma.post.findMany();

  // console.log(NextResponse.json(user));

  const data = req.json();
  const post = await getPost(
    (res as Response & { params: { id: string } }).params.id
  );
  // return NextResponse.json(posts);
  return NextResponse.json(post);
}
