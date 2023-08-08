import { getPosts } from "@/service/posts";
import React from "react";
import { Memo } from "../components/Memo";
import "./page.scss";

export default async function MemoPage() {
  const posts = await getPosts();

  return (
    <div className="memo_page">
      <h1>Memo for Memories</h1>
      <Memo posts={posts} />
    </div>
  );
}
