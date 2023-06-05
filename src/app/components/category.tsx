"use client";
import React, { useState } from "react";
import Image from "next/image";
import axios from "axios";
import Link from "next/link";
import { Post } from "@/service/posts";

export default function Category({ posts }: { posts: Post[] }) {
  const [selected, setSelected] = useState<Post[]>(posts);
  /** tag 별 category 생성  */
  const tag = posts.map((item) => item.tag).filter((item, i, arr) => arr.indexOf(item) === i);
  const inputStyle = { backgroundColor: "black", color: "white", margin: 10 };
  const submitHandler = async (e: any) => {
    e.preventDefault();
    const name = e.target.name.value;

    await axios
      .post(
        "/api/contact",
        JSON.stringify({
          name: 99,
        }),
        {
          headers: {
            "Content-Type": `application/json`,
          },
        }
      )
      .then((res) => {
        console.log(res);
      });
  };
  return (
    <>
      <div style={{ width: "inherit", display: "flex", flexDirection: "row-reverse" }}>
        <nav style={{ position: "fixed", right: 500, borderLeft: "3px solid grey", paddingLeft: 10 }}>
          {["All", ...tag].map((keyword) => {
            return (
              <p
                style={{ cursor: "pointer" }}
                key={keyword}
                onClick={() => {
                  const select = posts.filter((el) => el.tag === keyword);
                  setSelected(select);
                  if (keyword === "All") setSelected([...posts]);
                }}>
                {keyword}
              </p>
            );
          })}
        </nav>
        <ul style={{ display: "flex", flexWrap: "wrap", gap: 30 }}>
          {selected.map(({ id, title, image }) => {
            return (
              <li key={id}>
                <Link
                  href={`/posts/${title}`}
                  style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                  <Image src={`/images/${image}.png`} alt={image} width={300} height={300} />
                  {title}
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
      {/* <form
        style={{ display: "flex", flexDirection: "column", backgroundColor: "gray", width: 500 }}
        onSubmit={submitHandler}>
        <label htmlFor="name" className="mb-2 italic">
          Name
        </label>
        <input type="text" style={inputStyle} id="name" name="name" autoComplete="name" required />
        <button
          type="submit"
          className="px-4 py-2 font-bold text-white bg-blue-500 rounded-full hover:bg-blue-700"
          style={{ backgroundColor: "white", border: "solid 1px black" }}>
          전송
        </button>
      </form> */}
    </>
  );
}
