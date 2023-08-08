import { getPosts } from "@/service/posts";
import React from "react";
import { Tag } from "../components/Tag";
import { Add } from "../components/common/Add";
import "./page.scss";
import { Memo } from "../components/Memo";

export default async function MemoPage() {
  const posts = await getPosts();

  return (
    <div className="memo_page">
      <div className="memo_title">
        <h1>Memo</h1>
        <h1>for</h1>
        <h1>Memories</h1>
      </div>
      <Memo posts={posts} />
    </div>
  );
}
