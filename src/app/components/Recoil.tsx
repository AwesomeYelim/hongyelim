"use client";

import { Post } from "@/service/posts";
import { ReactNode } from "react";
import { atom, RecoilRoot, useRecoilState, useRecoilValue } from "recoil";

type Props = {
  children: ReactNode;
  posts: Post[];
};

const postsAtom = atom({
  key: "posts",
  default: [],
});

export default function Recoil({ children, posts }: Props) {
  const RecoilData = ({ children }: any) => {
    const [list, setList] = useRecoilState(postsAtom);
    // const text = useRecoilValue(tex);
    // setText

    console.log(postsAtom);
    return children;
  };
  return (
    <RecoilRoot>
      <RecoilData>{children}</RecoilData>
    </RecoilRoot>
  );
}
