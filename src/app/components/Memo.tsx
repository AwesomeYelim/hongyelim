"use client";

import { Post } from "@/service/posts";
import { useState } from "react";
import { Add } from "./common/Add";
import { Selected, Tag } from "./Tag";

export const Memo = ({ posts }: { posts: Post[] }): JSX.Element => {
  const [selected, setSelected] = useState<Selected>({ keyword: "" });

  const props = {
    posts,
    selected,
    setSelected,
  };

  return (
    <>
      <Add {...props} />
      <Tag {...props} />
    </>
  );
};
