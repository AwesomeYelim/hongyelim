"use client";
import React from "react";
import Image from "next/image";
import Link from "next/link";
import { getPosts } from "@/service/posts";

export default async function Category() {
  //   const posts = await getPosts();
  /** tag 별 category 생성  */
  //   const tag = posts.map((item) => item.tag).filter((item, i, arr) => arr.indexOf(item) === i);

  return (
    <>
      {/* {tag.map((keyword) => {
        return <p key={keyword}>{keyword}</p>;
      })}
      <ul>
        {posts.map(({ id, title, image }) => {
          return (
            <li key={id}>
              <Link href={`/posts/${title}`}>
                {title}
                <Image src={`/images/${image}.png`} alt={image} width={300} height={300} />
              </Link>
            </li>
          );
        })}
      </ul> */}
    </>
  );
}
