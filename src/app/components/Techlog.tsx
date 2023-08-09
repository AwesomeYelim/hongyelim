"use client";

import React, { useEffect, useState } from "react";
import LocalStorage from "./common/functions/localstorage";
import Link from "next/link";
import { Post } from "@/service/posts";
import classNames from "classnames";
import axios from "axios";
import { Selected, Tag } from "./Tag";

export default function Techlog({ posts }: { posts: Post[] }) {
  const lo = LocalStorage.getItem("tag") as string;

  const [selected, setSelected] = useState<Selected>({
    keyword: "All",
    posts: [],
  });

  const callPost = async () => {
    await axios.get("/api/heart").then((res) => {
      setSelected({
        keyword: "All",
        posts: res.data,
      });
      if (lo) {
        if (lo === "Tag") {
          setSelected({
            keyword: "All",
            posts: res.data,
          });
        } else {
          setSelected({
            keyword: lo as string,
            posts: res.data.filter((el: Post) => el.tag === lo),
          });
        }

        console.log(selected);

        LocalStorage.removeItem("tag");
      }
    });
  };

  useEffect(() => {
    callPost();
  }, []);

  const props = {
    posts,
    selected,
    setSelected,
  };

  return (
    <div className="posts_wrapper">
      <Tag {...props} />
      <div className="list_wrapper">
        <ul className="list">
          {selected &&
            selected.posts?.map(({ id, title, image, like, like_count, content, created_at }) => {
              const date = new Date(created_at * 1000).toLocaleDateString("ko-kr", {
                year: "numeric",
                month: "short",
                day: "numeric",
              });

              return (
                <li key={id}>
                  <div className="text_wrapper">
                    <Link href={`/posts/${id}_${title}`}>
                      <h2>{title}</h2>
                    </Link>
                    <span>{content}</span>
                  </div>
                  {/* <Image src={`/images/${image}.png`} alt={image} width={700} height={700} /> */}
                  <div className="bottom_wrap">
                    <span className="date">{date}</span>
                    <i className={classNames("static_heart", { like })} />
                    <span className="like">{like_count}</span>
                  </div>
                </li>
              );
            })}
        </ul>
      </div>
    </div>
  );
}
