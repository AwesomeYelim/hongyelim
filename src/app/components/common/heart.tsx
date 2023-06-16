"use client";
import React from "react";
import axios from "axios";
import { Post } from "@/service/posts";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart } from "@fortawesome/free-solid-svg-icons";
import "./heart.scss";

export default function Heart({ id }: { id: number }) {
  /** tag 별 category 생성  */
  const inputStyle = { backgroundColor: "black", color: "white", margin: 10 };
  const submitHandler = async (e: any) => {
    e.preventDefault();

    // const name = e.target.name.value;

    await axios
      .post(
        "/api/contact",
        JSON.stringify({
          id,
        }),
        {
          headers: {
            "Content-Type": `application/json`,
          },
        }
      )
      .then((res) => {
        console.log(res);
        location.reload();
      });
  };

  return (
    <button onClick={submitHandler}>
      {/* <i className="heart" /> */}
      <FontAwesomeIcon icon={faHeart} />
    </button>
    // <form
    //   style={{
    //     display: "flex",
    //     flexDirection: "column",
    //     backgroundColor: "gray",
    //     width: 500,
    //   }}

    // >
    //   <label htmlFor="name" className="mb-2 italic">
    //     Name
    //   </label>
    //   <input
    //     type="text"

    //     required
    //   />
    //   <button type="submit">
    // <FontAwesomeIcon icon={faHeart} />

    //   </button>
    // </form>
  );
}
