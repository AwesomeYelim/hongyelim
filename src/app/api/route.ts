import { getPosts } from "@/service/posts";
import { NextResponse } from "next/server";

export async function GET() {
  // req.headers.set("etag", "false");
  const posts = await getPosts();

  return NextResponse.json(posts);
}
