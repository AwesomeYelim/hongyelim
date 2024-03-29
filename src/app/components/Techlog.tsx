"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Post } from "@/service/posts";
import classNames from "classnames";
import { Selected, Tag } from "./Tag";
import { useQuery } from "react-query";
import { getPostsApi } from "./common/functions/myapi";
import { useSession } from "next-auth/react";
import { PageNation } from "./common/PageNation";
import { useRecoilValue } from "recoil";
import { postsAtom } from "./Recoil";
import { useSearchParams } from "next/navigation";
import dateFn from "./common/functions/date";

export type PageNum = { current: number; total: number; selectedNum: number };

export default function Techlog() {
  const posts = useRecoilValue(postsAtom);
  const currentTag = useSearchParams().get("tag");
  const pageNumInit = { current: 1, total: 0, selectedNum: 0 };
  const pageNum = useState<PageNum>(pageNumInit);
  const offset = 5;

  const { data: session } = useSession();

  const { data } = useQuery({
    queryKey: ["Bit", pageNum[0]],
    queryFn: (data) => {
      return getPostsApi({
        type: data.queryKey[0] as "Bit",
        condition: {
          offset,
          startNum: data.queryKey[1] as { current: number; total: number },
        },
      });
    },
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

    if (currentTag) {
      setSelected({
        keyword: currentTag as string,
        posts: posts?.filter((el: Post) => el.tag.includes(currentTag)),
      });

      if (currentTag === "All") {
        setSelected({
          keyword: "All",
          posts: data,
        });
      }
    }
  }, [data, currentTag]);

  const props = {
    offset,
    pageNum,
    selected,
    currentTag: currentTag as string,
    setSelected,
    pageNumInit,
  };

  return (
    <div className="posts_wrapper">
      {data && <Tag {...props} />}
      <div className="list_wrapper">
        <ul className="list">
          {selected &&
            selected.posts?.map(
              ({
                id,
                title,
                heart_count,
                content,
                created_at,
                heart,
                post_title,
              }) => {
                return (
                  <li key={id}>
                    <div className="text_wrapper">
                      <Link
                        href={{
                          pathname: `/posts/${title}`,
                        }}
                      >
                        <h2>{post_title}</h2>
                      </Link>
                      <span>{content}</span>
                    </div>
                    <div className="bottom_wrap">
                      <span className="date">{dateFn(created_at)}</span>
                      <i
                        className={classNames("static_heart", {
                          like: heart?.[session?.user?.email as string],
                        })}
                      />
                      <span className="like">{heart_count}</span>
                    </div>
                  </li>
                );
              }
            )}
        </ul>
      </div>
      <PageNation {...props} />
    </div>
  );
}
