"use client";

import { Post } from "@/service/posts";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React from "react";
import LocalStorage from "./common/functions/localstorage";

export const DetailTag = (props: Post): JSX.Element => {
  const { tag } = props;
  const router = useRouter();
  //
  return (
    <div className="tag_area">
      {tag.map((el) => {
        return (
          <Link
            key={el}
            href="/posts"
            onClick={(e) => {
              LocalStorage.setItem("tag", e.currentTarget.innerText.split(" ")[1]);
            }}>
            # {el}
          </Link>
        );
      })}
    </div>
  );
};
