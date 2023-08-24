"use client";

import { MouseEvent, useEffect, useState } from "react";
import axios from "axios";
import { Post } from "@/service/posts";
import classNames from "classnames";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { getTargetPostApi } from "./functions/myapi";
import { collection, addDoc, getDocs, doc, setDoc, updateDoc, getDoc } from "firebase/firestore";
import { db } from "../../../app/firebase";

import { DefaultSession } from "next-auth";
import "./heart.scss";
import { useSession } from "next-auth/react";

export default function Heart(props: Post) {
  const { data: session } = useSession();

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
        const { like, like_count } = res.data.res.find((el: Post) => el.title === title);

        setHeartNum({
          like,
          like_count,
        });
        return res;
      });
  };

  const userHeart = async (user: DefaultSession["user"]) => {
    // const db = getFirestore(app);
    // const id = await addDoc(collection(db, "user"), user);
    const id = await getDocs(collection(db, "user"));
    const one = await getDoc(doc(db, "user", user?.email as string));
    console.log(one.data());

    // id.forEach((doc) => {
    //   console.log(doc.id, doc.data());
    // });
    try {
      if (user?.email) {
        const data = doc(db, "user", user?.email as string);
        console.log(data.firestore);
        const obj: { [key in string]: boolean } = {};
        obj[title] = true;
        await updateDoc(data, {
          heart: { ...one.data()?.heart, ...obj },
        });
      }
    } catch (err) {
      console.log(err);
    }

    // await updateDoc(data, {
    //   heart: 1,
    // });
  };

  const mutation = useMutation({
    mutationFn: submitHeart,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: `${id}_${title}` });
    },
  });

  useEffect(() => {
    userHeart(session?.user);

    if (data) {
      const {
        post: { like, like_count },
      } = data;
      setHeartNum({ like, like_count });
    }
  }, [data, session?.user]);
  console.log(session?.user);

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
