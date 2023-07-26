"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { Post } from "@/service/posts";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart } from "@fortawesome/free-solid-svg-icons";
import "./heart.scss";

export default function Heart({ id, like }: { id: number; like: number }) {
  const [data, setdata] = useState({
    id,
    like,
  });

  /** tag 별 category 생성  */
  const submitHandler = async (e: any) => {
    e.preventDefault();

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
        console.log(res.data);
        const resdata = res.data.map((el: any) => {
          return {
            id: el.id,
            like: el.like,
          };
        });
        setdata(resdata);
        console.log(resdata, data);

        // location.reload();
      });
  };

  // useEffect(() => {
  //   setdata({ id, like });
  //   console.log(data);
  // }, [data.like]);

  return (
    <div className="heart_wrap">
      <span className="like">{data.like}</span>
      <button onClick={submitHandler}>
        <i className="heart" />
        {/* <FontAwesomeIcon icon={faHeart} /> */}
      </button>
    </div>
  );
}
