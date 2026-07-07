"use client";

import { MouseEvent, useEffect, useState } from "react";
import { Post } from "@/service/posts";
import classNames from "classnames";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast, { Toaster } from "react-hot-toast";
import { getTargetPostApi } from "./functions/myapi";
import { useSession } from "next-auth/react";
import { getDoc, doc, updateDoc, setDoc } from "firebase/firestore";
import { db } from "@/app/firebase";

import "./heart.scss";

export default function Heart(props: Post) {
  const { data: session } = useSession();
  const queryClient = useQueryClient();

  const { title, heart_count, heart } = props;
  const [heartNum, setHeartNum] = useState({
    heart: heart[session?.user?.email as string],
    heart_count,
  });

  const { data } = useQuery({
    queryKey: [title],
    queryFn: () => getTargetPostApi(title),
  });

  const submitHeart = async (e: MouseEvent) => {
    e.preventDefault();
    if (!session?.user?.email) {
      return toast("please login");
    }
    const userData = doc(db, "user", session?.user?.email as string);
    const postData = doc(db, "posts", title);

    const user = await getDoc(userData);
    const post = () => getDoc(postData);

    const userHeart = user.data()?.heart ? !user.data()?.heart[title] : true;

    try {
      await setDoc(userData, {
        ...user.data(),
        heart: user.data()?.heart
          ? { ...user.data()?.heart, [title]: userHeart }
          : { [title]: userHeart },
      });

      await updateDoc(postData, {
        heart: {
          ...(await post()).data()?.heart,
          [session?.user?.email as string]: userHeart,
        },
        heart_count: userHeart
          ? (await post()).data()?.heart_count + 1
          : (await post()).data()?.heart_count - 1,
      });

      setHeartNum({
        heart: heart[session?.user?.email as string],
        heart_count,
      });

      return (await post()).data();
    } catch (err) {
      console.log(err);
    }
  };

  const mutation = useMutation({
    mutationFn: submitHeart,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [title] });
    },
  });

  useEffect(() => {
    if (data) {
      const {
        post: { heart, heart_count },
      } = data;
      setHeartNum({
        heart: heart[session?.user?.email as string],
        heart_count,
      });
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
