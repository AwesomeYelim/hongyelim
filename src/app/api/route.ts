import { getPosts } from "@/service/posts";

import { NextResponse } from "next/server";

export async function GET(req: Request) {
  req.headers.set("Cache-Control", "public, max-age=3600");
  const posts = await getPosts();

  return NextResponse.json(posts);
}
