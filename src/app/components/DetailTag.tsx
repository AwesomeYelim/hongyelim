"use client";

import { Post } from "@/service/posts";
import Link from "next/link";
import React from "react";
import { useSetRecoilState } from "recoil";
import { selectedTag } from "./Recoil";

export const DetailTag = (props: Post): JSX.Element => {
  const { tag } = props;
  const setTag = useSetRecoilState(selectedTag);
  
  return (
    <div className="tag_area">
      {tag.map((el) => {
        return (
          <Link
            key={el}
            href="/posts"
            onClick={(e) => {
              setTag(e.currentTarget.innerText.split(" ")[1])

            }}>
            # {el}
          </Link>
        );
      })}
    </div>
  );
};
