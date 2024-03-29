"use client";

import { Post } from "@/service/posts";
import Link from "next/link";
import { useEffect, useState } from "react";
import { styled } from "styled-components";
import { getPostsApi } from "./common/functions/myapi";
import { useQuery } from "react-query";

const BtnWrap = styled.div`
  display: flex;
  justify-content: space-between;
  margin: 50px auto;
  a {
    display: flex;
    align-items: center;
    border: 1px solid #ccc;
    color: #4c4c4c;
    padding: 10px;
    border-radius: 5px;
    font-size: 13px;
    &:first-child {
      justify-content: flex-start;
    }
    &:last-child {
      justify-content: flex-end;
    }
  }
`;

export const PrevNextButton = ({ id }: { id: number }): JSX.Element => {
  const [idTitle, setIdTitle] = useState<{ prev: string[]; next: string[] }>({
    prev: [],
    next: [],
  });

  const { data } = useQuery({
    queryKey: 'All',
    queryFn: (data) => getPostsApi({type : data.queryKey[0]}),
  });

  const callPost = () => {
    const prev = data?.find((el: Post) => el.id === id + 1);
    const next = data?.find((el: Post) => el.id === id - 1);

    if (prev && next) {
      setIdTitle({
        prev: [String(prev.id), prev.title],
        next: [String(next.id), next.title],
      });
    } else if (!next && prev) {
      setIdTitle({
        prev: [String(prev.id), prev.title],
        next: ["", ""],
      });
    } else if (!prev && next) {
      setIdTitle({
        prev: ["", ""],
        next: [String(next.id), next.title],
      });
    }
  };

  useEffect(() => {
    if (data) callPost();
  }, [data]);

  return (
    <BtnWrap className="btn_wrap">
      {idTitle.prev[1] && <Link href={`/posts/${idTitle.prev[1]}`}>◀ 이전글 {idTitle.prev[1]}</Link>}
      {idTitle.next[1] && <Link href={`/posts/${idTitle.next[1]}`}>{idTitle.next[1]} 다음글 ▶</Link>}
    </BtnWrap>
  );
};
