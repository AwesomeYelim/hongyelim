import { getPosts } from "@/service/posts";
import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient(); // 인스턴스를 하나만 사용하고 여러개 만들지 않는다..

export async function GET() {
  try {
    const comment = await prisma.comment.findMany();
    const post = await prisma.post.findMany();
    const user = await prisma.user.findMany();
    return NextResponse.json(comment);
  } catch (err) {
    console.log(err);
  }
}
export async function POST() {
  try {
    const comment = await prisma.comment.findMany();
    const post = await prisma.post.findMany();
    const user = await prisma.user.findMany();
    return NextResponse.json(comment);
  } catch (err) {
    console.log(err);
  }
}
