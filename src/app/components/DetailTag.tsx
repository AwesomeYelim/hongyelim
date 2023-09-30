"use client";

import { Post } from "@/service/posts";
import Link from "next/link";
import React from "react";

export const DetailTag = (props: Post): JSX.Element => {
  const { tag } = props;

  return (
    <div className="tag_area">
      {tag.map((el) => {
        return (
          <Link
            key={el}
            href={{
              pathname: "/posts",
              query: { tag: el },
            }}
          >
            # {el}
          </Link>
        );
      })}
    </div>
  );
};
