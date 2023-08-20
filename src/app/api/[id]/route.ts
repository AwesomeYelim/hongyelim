import { getPost, getPosts, Post } from "@/service/posts";
import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

export async function GET(req: Request, res: Response) {
  const prisma = new PrismaClient();
  console.log(prisma, "sadfsaf");

  const data = req.json();
  const post = await getPost(
    (res as Response & { params: { id: string } }).params.id
  );
  return NextResponse.json(post);
}
