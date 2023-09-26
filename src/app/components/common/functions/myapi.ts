import { commentsTree } from "@/app/api/[id]/comment/route";
import { CommentEl, Post } from "@/service/posts";
import axios from "axios";
import { getDocs, collection, query, where } from "firebase/firestore";
import { db } from "../../../firebase";

type PostParam = {
  type: "All" | "Bit" | "One";
  condition?: { offset: number; startNum: { current: number; total: number } };
  target?: string;
};

export const getPostsApi = async ({ type, condition, target }: PostParam) => {
  const callData = (() => {
    let data;

    const idList =
      condition &&
      Array(condition.offset)
        .fill(condition.offset * (condition.startNum.current - 1))
        .map(
          (el, i) =>
            el -
            i +
            (condition.startNum.total % condition.offset ? condition.startNum.total % condition.offset : 2 * i + 1)
        );

    switch (type) {
      case "All": {
        data = collection(db, "posts");
        break;
      }
      case "Bit": {
        data = query(collection(db, "posts"), where("id", "in", idList));
        break;
      }
      case "One": {
        data = query(collection(db, "posts"), where("title", "==", target));
        break;
      }
    }

    return data;
  })();

  const fireposts = await getDocs(callData);

  let posts: Post[] = [];

  fireposts.forEach((doc) => {
    posts.push(doc.data() as Post);
  });

  posts = posts.sort((a, b) => b.id - a.id);

  return posts ? posts : [];
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
  const [post] = await getPostsApi({ type: "One", target: queryKey }).then((res) => {
    return res;
  });
  const mdPost = axios.get(`/api/${queryKey}`, {
    headers: {
      "Cache-Control": "no-store",
    },
  });

  return { post: { ...post, comments: post.comments ? commentsTree(post.comments) : [] } as Post, mdPost };
};
