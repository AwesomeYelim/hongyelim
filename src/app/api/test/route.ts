import { getPosts } from "@/service/posts";
import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient(); // 인스턴스를 하나만 사용하고 여러개 만들지 않는다..

export async function GET() {
  try {
    const comment = await prisma.comment.findMany();
    const post = await prisma.post.findMany();
    const user = await prisma.user.findMany();
    const category = await prisma.category.findMany();
    return NextResponse.json(post);
  } catch (err) {
    console.log(err);
  }
}

export async function POST(req: Request) {
  try {
    const data = await req.json();
    console.log(data);

    const user = await prisma.user.create({
      data: {
        age: data.age,
        email: data.email,
      },
    });
    console.log(user);

    return NextResponse.json(user);
  } catch (err) {
    console.log(err);
  }
}
