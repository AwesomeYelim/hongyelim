import React from "react";
import { Memo } from "../components/Memo";
import "./page.scss";

export default async function MemoPage() {
  return (
    <div className="memo_page">
      <h1>Memo for Memories</h1>
      <Memo />
    </div>
  );
}
