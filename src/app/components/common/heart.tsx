"use client";

import { MouseEvent, useEffect, useState } from "react";
import axios from "axios";
import { Post } from "@/service/posts";
import classNames from "classnames";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { getTargetPostApi } from "./functions/myapi";
import "./heart.scss";

export default function Heart(props: Post) {
  const { id, title, like, like_count } = props;

  const { data } = useQuery({
    queryKey: `${id}_${title}`,
    queryFn: (data) => getTargetPostApi(data.queryKey[0]),
  });

  const [heartNum, setHeartNum] = useState({ like, like_count });
  const queryClient = useQueryClient();

  const submitHeart = async (e: MouseEvent) => {
    e.preventDefault();
    await axios
      .post(
        `/api/${id}_${title}/heart`,
        JSON.stringify({
          id,
          title,
        }),
        {
          headers: {
            "Content-Type": `application/json`,
          },
        }
      )
      .then((res) => {
        const { like, like_count } = res.data.res.find(
          (el: Post) => el.title === title
        );

        setHeartNum({
          like,
          like_count,
        });
        return res;
      });
  };

  const mutation = useMutation({
    mutationFn: submitHeart,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: `${id}_${title}` });
    },
  });

  useEffect(() => {
    if (data) {
      const {
        post: { like, like_count },
      } = data;
      setHeartNum({ like, like_count });
    }
  }, [data]);

  return (
    <div className="side_area">
      <div className="heart_wrap">
        <button onClick={(data) => mutation.mutate(data)}>
          <i className={classNames("heart", { active: heartNum.like })} />
        </button>
        <span className="like">{heartNum.like_count}</span>
      </div>
    </div>
  );
}
