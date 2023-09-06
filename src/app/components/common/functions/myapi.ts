import { Post } from "@/service/posts";
import axios from "axios";
import { getDocs, collection } from "firebase/firestore";
import { db } from "../../../firebase";

export const getPostsApi = async () => {
  // return axios.get("/api").then((res) => {
  //   return res.data;
  // });

  const fireposts = await getDocs(collection(db, "posts"));

  let posts: Post[] = [];

  fireposts.forEach((doc) => {
    posts.push(doc.data() as Post);
  });

  return posts ? posts : [];

  // const res = await fetch("/api", { cache: "no-store" });
  // const data = await res.json();
  // return data;
};

export const postsAddApi = async (data: { [key in string]: string }) => {
  await axios
    .post("/api/add", JSON.stringify(data), {
      headers: {
        "Content-Type": `application/json`,
        "Cache-Control": "no-store",
      },
    })
    .then((res) => {
      console.log(res.data);
    });
};

export const getTargetPostApi = async (queryKey: string) => {
  const posts = getPostsApi();

  const post = (await posts).find((item) => `${item.id}_${item.title}` === queryKey);
  const mdPost = axios.get(`/api/${queryKey}`, {
    headers: {
      "Cache-Control": "no-store",
    },
  });

  return { post: post as Post, mdPost };
};
