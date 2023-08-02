"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Post } from "@/service/posts";
import classNames from "classnames";
import axios from "axios";

export default function Techlog({ posts }: { posts: Post[] }) {
  const [selected, setSelected] = useState<{ keyword: string; posts: Post[] }>({ keyword: "All", posts: [...posts] });
  /** tag 별 category 생성  */

  const tag = posts.map((item) => item.tag).filter((item, i, arr) => arr.indexOf(item) === i);

  const callPost = async () => {
    await axios.get("/api/posts").then((res) => {
      setSelected({ keyword: "All", posts: res.data.res });
    });
  };

  useEffect(() => {
    callPost();
  }, []);

  return (
    <div className="posts_wrapper">
      <nav className="category">
        {["All", ...tag].map((keyword) => {
          return (
            <p
              key={keyword}
              className={classNames({ active: keyword === selected.keyword })}
              onClick={(e) => {
                const select = posts.filter((el) => el.tag === keyword);

                setSelected({ keyword: e.currentTarget.innerText, posts: select });

                if (keyword === "All") setSelected({ keyword: "All", posts: [...posts] });
              }}>
              {keyword}
            </p>
          );
        })}
      </nav>
      <div className="list_wrapper">
        <ul className="list">
          {selected &&
            selected.posts.map(({ id, title, image, like, like_count, content }) => {
              return (
                <li key={id}>
                  <Link href={`/posts/${title}`}>
                    <div className="text_wrapper">
                      <h4>{title}</h4>
                      <span>{content}</span>
                    </div>
                    {/* <Image src={`/images/${image}.png`} alt={image} width={700} height={700} /> */}
                    <div className="like_wrap">
                      <span className="like">{like_count}</span>
                      <i className="static_heart" />
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
