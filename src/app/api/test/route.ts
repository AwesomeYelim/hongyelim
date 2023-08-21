import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

export async function GET(req: Request, res: Response) {
  const prisma = new PrismaClient();
  // const user = await prisma.users.findMany();
  const posts = await prisma.post.findMany();
  return NextResponse.json(posts);
}
