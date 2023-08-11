"use client";

import { Post } from "@/service/posts";
import classNames from "classnames";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { atom, useRecoilState, useRecoilValue } from "recoil";
import LocalStorage from "./common/functions/localstorage";
import "./Tag.scss";

export type Selected = {
  keyword: string;
  posts?: Post[];
};

export interface Props {
  posts: Post[];
  selected?: Selected;
  setSelected?: React.Dispatch<React.SetStateAction<Selected>>;
}

// const tex = atom({
//   key: "yelim", // unique ID (with respect to other atoms/selectors)
//   default: "asdasdasd", // default value (aka initial value)
// });

export const Tag = ({ posts, selected, setSelected }: Props): JSX.Element => {
  const [list, setList] = useState<string[]>();
  const location = usePathname();

  const { tag, title } = {
    /** tag 별 list   */
    tag: posts.map((item) => item.tag).filter((item, i, arr) => arr.indexOf(item) === i),
    /** title 별 list   */
    title: posts.map((item) => item.title),
  };

  // // const [text, setText] = useRecoilState(textState);
  // const text = useRecoilValue(tex);

  // console.log(text);

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
  }, []);

  return (
    <nav className="tag_wrap">
      {list?.map((keyword) => {
        return (
          <p
            key={keyword}
            className={classNames({ active: keyword === selected?.keyword })}
            onClick={(e) => {
              if (setSelected) {
                const select = posts.filter((el) => el.tag === keyword);

                setSelected({ keyword: e.currentTarget.innerText, posts: select });

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
                  if (e.currentTarget.innerText === "Tag") {
                    LocalStorage.setItem("tag", "All");
                  }
                  LocalStorage.setItem("tag", e.currentTarget.innerText);
                }}>
                {keyword}
              </Link>
            ) : (
              <>{keyword}</>
            )}
          </p>
        );
      })}
    </nav>
  );
};
