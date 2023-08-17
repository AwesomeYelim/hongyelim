"use client";

import { Post } from "@/service/posts";
import classNames from "classnames";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { styled } from "styled-components";
import LocalStorage from "./common/functions/localstorage";

export type Selected = {
  keyword: string;
  posts?: Post[];
};

export interface Props {
  posts: Post[];
  selected?: Selected;
  setSelected?: React.Dispatch<React.SetStateAction<Selected>>;
}
const TagWrap = styled.nav`
  display: flex;
  position: absolute;
  flex-direction: column;
  margin: 10px 0 10px 0;
  padding-left: 20px;
  top: 125px;
  right: -130px;
  width: 150px;

  box-sizing: border-box;
  p {
    cursor: pointer;
    margin: 5px 0 5px 0;
    font-size: 15px;
    border: 1px solid transparent;

    &:first-child {
      color: orange;
      border-bottom: 1px solid black !important;
      padding-bottom: 10px;
      a {
        font-weight: 700;
      }
    }

    &.active {
      font-weight: 600;
    }
  }
`;
export const Tag = ({ posts, selected, setSelected }: Props): JSX.Element => {
  const [list, setList] = useState<string[]>();
  const location = usePathname();

  const { tag, title } = {
    /** tag 별 list   */
    tag: posts.map((item: Post) => item.tag).filter((item, i, arr) => arr.indexOf(item) === i),
    /** title 별 list   */
    title: posts.map((item: Post) => item.title),
  };

  useEffect(() => {
    // prettier-ignore
    switch (location) {
      case "/": {
        setList(["Tag", ...tag]);
      } break;
      case "/posts": {
        setList(["All", ...tag]);
      } break;
      case "/memo": {
        setList(["Recommand Title", ...title]);
      } break;
    }
  }, [posts]);

  return (
    <TagWrap className="tag_wrap">
      {list?.map((keyword) => {
        return (
          <p
            key={keyword}
            className={classNames({ active: keyword === selected?.keyword })}
            onClick={(e) => {
              if (setSelected) {
                const select = posts.filter((el: Post) => el.tag === keyword);

                setSelected({
                  keyword: e.currentTarget.innerText,
                  posts: select,
                });

                if (keyword === "All") setSelected({ keyword, posts: [...posts] });
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
                    LocalStorage.setItem("tag", e.currentTarget.innerText);
                  }
                }}>
                {keyword}
              </Link>
            ) : (
              <>{keyword}</>
            )}
          </p>
        );
      })}
    </TagWrap>
  );
};
