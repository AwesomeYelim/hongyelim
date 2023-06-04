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
    // try {
    //   await fetch("/api/contact", {
    //     method: "POST",
    //     headers: {
    //       "Content-Type": "application/json",
    //     },
    //     body: JSON.stringify({
    //       name,
    //     }),
    //   }).then((result) => console.log(result));
    // } catch (err) {
    //   return console.log(err);
    // }
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
    // await fetch(`/api/contact`, {
    //   method: "POST",
    //   headers: {
    //     "Content-Type": "application/json",
    //   },
    //   body: JSON.stringify({
    //     name,
    //   }),
    // }).then((result) => console.log(result));
    // const result = await res.json();

    // console.log(res, result);
  };
  return (
    <>
      <div style={{ display: "flex", flexDirection: "row-reverse" }}>
        <nav>
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
        <ul style={{ display: "flex", gap: 30 }}>
          {selected.map(({ id, title, image }) => {
            return (
              <li key={id}>
                <Link href={`/posts/${title}`}>
                  {title}
                  <Image src={`/images/${image}.png`} alt={image} width={300} height={300} />
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
      <form
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
      </form>
    </>
  );
}
