"use client";

import { MouseEvent, useEffect, useState } from "react";
import axios from "axios";
import { Post } from "@/service/posts";
import classNames from "classnames";
import "./heart.scss";

export default function Heart(props: Post) {
  const { id, like, like_count, title } = props;
  const [heartNum, setHeartNum] = useState({ like, like_count });

  const submitHandler = async (e: MouseEvent) => {
    e.preventDefault();
    await axios
      .post(
        "/api/posts",
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
        console.log(res.data.clientIp);

        const target = res.data.res.find((el: Post) => el.title === title);
        setHeartNum({
          like: target.like,
          like_count: target.like_count,
        });
      });
  };

  const callPost = async () => {
    await axios.get("/api/posts").then((res) => {
      const target = res.data.find((el: Post) => el.title === title);
      setHeartNum({ like: target.like, like_count: target.like_count });
    });
  };

  useEffect(() => {
    callPost();
  }, []);

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
