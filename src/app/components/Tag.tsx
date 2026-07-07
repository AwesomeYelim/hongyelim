"use client";

import { Post } from "@/service/posts";
import classNames from "classnames";
import { isEqual } from "lodash";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { usePostsStore } from "@/store/posts";
import { getPostsApi } from "./common/functions/myapi";
import { PageNum } from "./Techlog";

export type Selected = {
  keyword: string;
  posts?: Post[];
};

export interface Props {
  offset?: number;
  pageNum?: [PageNum, React.Dispatch<React.SetStateAction<PageNum>>];
  pageNumInit?: PageNum;
  currentTag?: string;
  selected?: Selected;
  setSelected?: React.Dispatch<React.SetStateAction<Selected>>;
}

export const Tag = ({ offset, pageNum, pageNumInit, currentTag, selected, setSelected }: Props): JSX.Element => {
  const [list, setList] = useState<string[]>();
  const location = usePathname();
  const setPosts = usePostsStore((s) => s.setPosts);

  /**  tag 별 게시물 갯수  */
  const tagCount: { [key in string]: number } = {};

  const { data } = useQuery({
    queryKey: ["All"],
    queryFn: () => {
      return getPostsApi({ type: "All" });
    },
  });

  const { data: bitData } = useQuery({
    queryKey: ["Bit", pageNum?.[0]],
    queryFn: () =>
      getPostsApi({
        type: "Bit",
        condition: {
          offset: offset as number,
          startNum: pageNum?.[0] as PageNum,
        },
      }),
    enabled: !!offset && !!pageNum,
  });

  const { tagList, title } = {
    /** tag 별 list   */
    tagList: data
      ?.map((item: Post) => item.tag)
      .flat()
      .filter((item, i, arr) => {
        if (tagCount[item]) {
          tagCount[item] += 1;
        } else {
          tagCount[item] = 1;
        }
        return arr.indexOf(item) === i;
      })
      .sort((a, b) => tagCount[b] - tagCount[a]),

    /** title 별 list   */
    title: data?.map((item: Post) => item.title),
  };

  useEffect(() => {
    if (data) setPosts(data as Post[]);
    if(tagList?.length || title?.length) {
      switch (location) {
        case "/": {
          setList([...((tagList as string[]).filter(item => /^[a-z]/.test(item)))]);
        } break;
        case "/posts": {
          setList(["All", ...(tagList as string[])]);
        } break;
        case "/memo": {
          setList(["Recommand Title", ...(title as string[])]);
        } break;
      }
    }
  }, [data]);

  useEffect(() => {
    if (pageNum && (isEqual(pageNum[0], pageNumInit) || (!pageNum[0].current && !pageNum[0].total))) {
      pageNum[1](() => {
        return {
          current: Math.ceil((data?.length as number) / (offset as number)),
          total: data?.length as number,
          selectedNum: 1,
        };
      });
    }
  }, []);

  return (
    <nav className="tag_wrap">
      {list?.map((keyword) => {
        return (
          <Link
            key={keyword}
            href={{
              pathname: "/posts",
              query: { tag: keyword },
            }}
            className={classNames({ active: keyword === selected?.keyword })}
            onClick={(e) => {
              if (setSelected) {
                const clickedKeyword = e.currentTarget.innerText.replace(/\s*\(\d+\)\s*$/, "");
                const select = data?.filter((el: Post) => el.tag.includes(clickedKeyword));
                setSelected({
                  keyword: e.currentTarget.innerText,
                  posts: select,
                });

                if (e.currentTarget.innerText.includes("All"))
                  setSelected({
                    keyword: "All",
                    posts: [...(bitData as Post[])],
                  });
                if (e.currentTarget.innerText === "Recommand Title") {
                  setSelected({ keyword: "" });
                }
              }
            }}>
            {
              keyword !== "All" && list[0] !== "Recommand Title" ? (
                <>
                  {keyword}
                  {!!tagCount[keyword] && <span>({tagCount[keyword]})</span>}
                </>
              ) : keyword === "All" ? (
                <>
                  {keyword}
                  <span>({data?.length})</span>
                </>
              ) : (
                keyword
              )
            }
          </Link>
        );
      })}
    </nav>
  );
};
