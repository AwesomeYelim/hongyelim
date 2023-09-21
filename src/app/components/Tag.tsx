"use client";

import { Post } from "@/service/posts";
import classNames from "classnames";
import { isEqual } from "lodash";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { useQuery } from "react-query";
import { useSetRecoilState } from "recoil";
import { styled } from "styled-components";
import { getPostsApi } from "./common/functions/myapi";
import { postsAtom, selectedTag } from "./Recoil";
import { PageNum } from "./Techlog";

export type Selected = {
  keyword: string;
  posts?: Post[];
};

export interface Props {
  offset?: number;
  pageNum?: [PageNum, React.Dispatch<React.SetStateAction<PageNum>>];
  pageNumInit?: PageNum;
  selected?: Selected;
  setSelected?: React.Dispatch<React.SetStateAction<Selected>>;
}

const TagWrap = styled.nav`
  display: flex;
  position: absolute;
  flex-direction: column;
  margin: 10px 0 10px 0;
  max-height: 500px;
  // max-width: 400px;
  overflow-y: auto;
  overflow-x: hidden;
  padding-left: 20px;
  top: 125px;
  right: -200px;
  width: 220px;

  box-sizing: border-box;
  p {
    cursor: pointer;
    margin: 5px 0 5px 0;
    font-size: 15px;
    border: 1px solid transparent;

    &:first-child {
      color: orange;
      border-bottom: 1px solid black !important;
      margin-right: 15px;
      padding-bottom: 10px;
      a {
        font-weight: 700;
      }
    }

    &.active {
      font-weight: 600;
    }

    span {
      margin-left: 5px;
      letter-spacing: 1.5px;
    }
  }
`;
export const Tag = ({ offset, pageNum, pageNumInit, selected, setSelected }: Props): JSX.Element => {
  const [list, setList] = useState<string[]>();
  const location = usePathname();
  const setPosts = useSetRecoilState(postsAtom);
  const setTag = useSetRecoilState(selectedTag);

  /**  tag 별 게시물 갯수  */
  const tagCount: { [key in string]: number } = {};

  const { data } = useQuery({
    queryKey: "All",
    queryFn: (data) => {
      return getPostsApi({ type: data.queryKey[0] });
    },
  });

  const { data: bitData } = useQuery({
    queryKey: ["Bit", pageNum?.[0]],
    queryFn: (data) =>
      getPostsApi({
        type: data.queryKey[0] as "Bit",
        condition: {
          offset: offset as number,
          startNum: data.queryKey[1] as PageNum,
        },
      }),
  });

  const { tag, title } = {
    /** tag 별 list   */
    tag: data
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
      .sort((a, b) => tagCount[b] - tagCount[a]), // tag 별 게시물 많은수

    /** title 별 list   */
    title: data?.map((item: Post) => item.title),
  };

  useEffect(() => {
    setPosts(data as Post[]);
    // prettier-ignore
    if(tag?.length || title?.length) {
      
      switch (location) {
        case "/": {
          setList(["Tag", ...((tag as string[]).filter(item => /^[a-z]/.test(item)))]);
        } break;
        case "/posts": {
          setList(["All", ...(tag as string[])]);
        } break;
        case "/memo": {
          setList(["Recommand Title", ...(title as string[])]);
        } break;
      }
    }
  }, [data]);

  useEffect(() => {
    /* 초깃값 일때 && 페이지 새로고침 시에만 state 설정 */
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
    <TagWrap className="tag_wrap">
      {list?.map((keyword) => {
        return (
          <p
            key={keyword}
            className={classNames({ active: keyword === selected?.keyword })}
            onClick={(e) => {
              if (setSelected) {
                const select = data?.filter((el: Post) => el.tag.includes(keyword));
                setSelected({
                  keyword: e.currentTarget.innerText.split("(")[0],
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
            {list[0] === "Tag" ? (
              <Link
                href="/posts"
                onClick={(e) => {
                  if (e.currentTarget.innerText !== "Tag") {
                    setTag(e.currentTarget.innerText);
                  }
                }}>
                {keyword}
              </Link>
            ) : keyword !== "All" && list[0] !== "Recommand Title" ? (
              <>
                {keyword}
                <span>({tagCount[keyword]})</span>
              </>
            ) : keyword === "All" ? (
              <>
                {keyword}
                <span>({data?.length})</span>
              </>
            ) : (
              keyword
            )}
          </p>
        );
      })}
    </TagWrap>
  );
};
