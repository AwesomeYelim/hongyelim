"use client";

import { Post } from "@/service/posts";
import axios from "axios";
import { ReactNode, useEffect } from "react";
import { useQuery } from "react-query";
import {
  atom,
  RecoilRoot,
  RecoilState,
  useRecoilState,
  useRecoilValue,
  useSetRecoilState,
} from "recoil";

type Props = {
  children: ReactNode;
};

export const postsAtom = atom<Post[]>({
  key: "posts",
  default: [],
});

export default function Recoil({ children }: Props) {
  const { data } = useQuery({
    queryKey: "postsData",
    queryFn: () =>
      axios.get("/api").then((res) => {
        return res.data;
      }),
  });

  const RecoilData = ({ children }: { children: ReactNode } | any) => {
    const setList = useSetRecoilState(postsAtom);

    useEffect(() => {
      setList(data);
      console.log(data);
    }, [data]);

    return children;
  };

  return (
    <RecoilRoot>
      <RecoilData>{children}</RecoilData>
    </RecoilRoot>
  );
}
