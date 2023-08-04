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
    await axios.get("/api/heart").then((res) => {
      setSelected({ keyword: "All", posts: res.data });
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
            selected.posts.map(({ id, title, image, like, like_count, content, created_at }) => {
              const date = new Date(created_at * 1000).toLocaleDateString("ko-kr", {
                year: "numeric",
                month: "short",
                day: "numeric",
              });

              return (
                <li key={id}>
                  <Link href={`/posts/${id}_${title}`}>
                    <div className="text_wrapper">
                      <h2>{title}</h2>
                      <span>{content}</span>
                    </div>
                    {/* <Image src={`/images/${image}.png`} alt={image} width={700} height={700} /> */}
                    <div className="bottom_wrap">
                      <span className="date">{date}</span>
                      <i className={classNames("static_heart", { like })} />
                      <span className="like">{like_count}</span>
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
