"use client";

import axios from "axios";
import { Post } from "@/service/posts";
import Link from "next/link";
import { useEffect, useState } from "react";
import { styled } from "styled-components";

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

export const Button = ({ id }: { id: number }): JSX.Element => {
  const [idTitle, setIdTitle] = useState<{ prev: string[]; next: string[] }>({ prev: [], next: [] });

  const callPost = async () => {
    await axios.get("/api/posts").then((res) => {
      const prev = res.data.find((el: Post) => el.id === id - 1);
      const next = res.data.find((el: Post) => el.id === id + 1);

      if (prev && next) {
        setIdTitle({
          prev: [prev.id, prev.title, `${prev.id}_${prev.title}`],
          next: [next.id, next.title, `${next.id}_${next.title}`],
        });
      } else if (!next && prev) {
        setIdTitle({ prev: [prev.id, prev.title, `${prev.id}_${prev.title}`], next: ["", "", ""] });
      } else if (!prev && next) {
        setIdTitle({ prev: ["", "", ""], next: [next.id, next.title, `${next.id}_${next.title}`] });
      }
    });
  };

  useEffect(() => {
    callPost();
  }, []);

  return (
    <BtnWrap className="btn_wrap">
      <Link href={`/posts/${idTitle.prev[2]}`}>◀ 이전글 {idTitle.prev[1]}</Link>
      <Link href={`/posts/${idTitle.next[2]}`}>{idTitle.next[1]} 다음글 ▶</Link>
    </BtnWrap>
  );
};
