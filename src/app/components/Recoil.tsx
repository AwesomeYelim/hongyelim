"use client";

import { Post } from "@/service/posts";
import { ReactNode } from "react";
import { atom, RecoilRoot } from "recoil";

type Props = {
  children: ReactNode;
};

export const postsAtom = atom<Post[]>({
  key: "posts",
  default: [],
});

export const selectedTag = atom<string>({
  key: "tag",
  default: '',
});

export default function Recoil({ children }: Props) {
  return <RecoilRoot>{children}</RecoilRoot>;
}
