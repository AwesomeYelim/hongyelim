"use client";

import React, { useEffect, useState } from "react";
import LocalStorage from "./common/functions/localstorage";
import Link from "next/link";
import { Post } from "@/service/posts";
import classNames from "classnames";
import { Selected, Tag } from "./Tag";
import { useQuery } from "react-query";
import { getPostsApi } from "./common/functions/myapi";

export default function Techlog() {
  const lo = LocalStorage.getItem("tag") as string;
  // const data = useRecoilValue(postsAtom);
  const { data } = useQuery({
    queryKey: "postsData",
    queryFn: getPostsApi,
  });

  const [selected, setSelected] = useState<Selected>({
    keyword: "All",
    posts: data,
  });

  useEffect(() => {
    setSelected({
      keyword: "All",
      posts: data,
    });
    if (lo) {
      setSelected({
        keyword: lo as string,
        posts: data.filter((el: Post) => el.tag === lo),
      });
      LocalStorage.removeItem("tag");
    }
  }, [data]);

  const props = {
    posts: data,
    selected,
    setSelected,
  };

  return (
    <div className="posts_wrapper">
      {data && <Tag {...props} />}
      <div className="list_wrapper">
        <ul className="list">
          {selected &&
            selected.posts?.map(
              ({ id, title, image, like, like_count, content, created_at }) => {
                const date = new Date(created_at * 1000).toLocaleDateString(
                  "ko-kr",
                  {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  }
                );

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
              }
            )}
        </ul>
      </div>
    </div>
  );
}
