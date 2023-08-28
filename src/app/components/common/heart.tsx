"use client";

import { MouseEvent, useEffect, useState } from "react";
import axios from "axios";
import { Post } from "@/service/posts";
import classNames from "classnames";
import { useMutation, useQuery, useQueryClient } from "react-query";
import toast, { Toaster } from "react-hot-toast";
import { getTargetPostApi } from "./functions/myapi";
import { useSession } from "next-auth/react";
import "./heart.scss";

export default function Heart(props: Post) {
  const { data: session } = useSession();
  const queryClient = useQueryClient();

  const { id, title, heart_count, heart } = props;
  const [heartNum, setHeartNum] = useState({
    heart: heart[session?.user?.email as string],
    heart_count,
  });

  const { data } = useQuery({
    queryKey: `${id}_${title}`,
    queryFn: (data) => getTargetPostApi(data.queryKey[0]),
  });

  const submitHeart = async (e: MouseEvent) => {
    e.preventDefault();
    if (!session?.user?.email) {
      return toast("please login");
    }
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
        const { heart, heart_count } = res.data.post;

        setHeartNum({
          heart: heart[session?.user?.email as string],
          heart_count,
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
        post: { heart, heart_count },
      } = data;
      setHeartNum({ heart: heart[session?.user?.email as string], heart_count });
    }
  }, [data, session?.user]);

  return (
    <div className="side_area">
      <Toaster />
      <div className="heart_wrap">
        <button onClick={(data) => mutation.mutate(data)}>
          <i className={classNames("heart", { active: heartNum.heart })} />
        </button>
        <span className="like">{heartNum.heart_count}</span>
      </div>
    </div>
  );
}
