"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import { getPost, Post } from "@/service/posts";
import classNames from "classnames";
import "./heart.scss";

export default function Heart(props: Post) {
  const { id, like, like_count, title } = props;
  const [heartNum, setHeartNum] = useState({ like, like_count });

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
        const target = res.data.res.find((el: Post) => el.title === title);
        setHeartNum({
          like: target.like,
          like_count: target.like_count,
        });
      });
  };

  return (
    <div className="side_area">
      <div className="heart_wrap">
        <button onClick={submitHandler}>
          <i className={classNames("heart", { active: heartNum.like })} />
        </button>
        <span className="like">{heartNum.like_count}</span>
      </div>
    </div>
  );
}
