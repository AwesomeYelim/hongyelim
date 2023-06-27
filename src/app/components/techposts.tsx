"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Post } from "@/service/posts";
import Heart from "./common/heart";

export default function Category({ posts }: { posts: Post[] }) {
  const [selected, setSelected] = useState<Post[]>(posts);
  /** tag 별 category 생성  */
  const tag = posts.map((item) => item.tag).filter((item, i, arr) => arr.indexOf(item) === i);

  return (
    <div className="posts_wrapper">
      <nav className="category">
        {["All", ...tag].map((keyword) => {
          return (
            <p
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
      </nav>
      <div className="list_wrapper">
        <ul className="list">
          {selected.map(({ id, title, image, like }) => {
            return (
              <li key={id}>
                <Link href={`/posts/${title}`}>
                  <Image src={`/images/${image}.png`} alt={image} width={300} height={300} />
                  {title}
                  <div className="like_wrap">
                    <span className="like">{like}</span>
                    <Heart id={id} />
                  </div>
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
