import { getPosts } from "@/service/posts";
import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient(); // 인스턴스를 하나만 사용하고 여러개 만들지 않는다..

export async function GET() {
  try {
    const comment = await prisma.comment.findMany();
    const post = await prisma.post.findMany();
    const user = await prisma.user.findUnique({
      where: {
        email_age: {
          email: "uiop01900@gmail.com",
          age: 27,
        },
      },
    });
    const category = await prisma.category.findMany();
    return NextResponse.json(user);
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
    // const user = await prisma.user.update({
    //   where: { email: "uiop01900@gmail.com" },
    //   data: {
    //     age: {
    //       increment: 1,
    //     },
    //   },
    // });
    console.log(user);

    return NextResponse.json(user);
  } catch (err) {
    console.log(err);
  }
}
export async function DELETE(req: Request) {
  try {
    const data = await req.json();
    console.log(data);

    // const user = await prisma.user.deleteMany({
    //   where: { age: { gt: 10 } },
    // });
    // console.log(user);

    return NextResponse.json(data);
  } catch (err) {
    console.log(err);
  }
}
