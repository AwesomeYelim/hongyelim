import { getPosts } from "@/service/posts";

import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const posts = await getPosts();

  return NextResponse.json(posts);
}
