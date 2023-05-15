"use client";
import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Post } from "@/service/posts";

export default function Category({ posts }: { posts: Post[] }) {
  const [selected, setSelected] = useState<Post[]>(posts);
  /** tag 별 category 생성  */
  const tag = posts.map((item) => item.tag).filter((item, i, arr) => arr.indexOf(item) === i);

  return (
    <>
      {["All", ...tag].map((keyword) => {
        return (
          <p
            style={{ cursor: "pointer" }}
            key={keyword}
            onClick={() => {
              const select = posts.filter((el) => el.tag === keyword);
              setSelected(select);
              if (keyword === "All") setSelected([...posts]);
            }}>
            {keyword}
          </p>
        );
      })}
      <ul>
        {selected.map(({ id, title, image }) => {
          return (
            <li key={id}>
              <Link href={`/posts/${title}`}>
                {title}
                <Image src={`/images/${image}.png`} alt={image} width={300} height={300} />
              </Link>
            </li>
          );
        })}
      </ul>
    </>
  );
}
