import { CommentEl } from "@/service/posts";
import axios from "axios";

export const getPostsApi = async () => {
  return axios.get("/api").then((res) => {
    return res.data;
  });
};

export const postsAddApi = async (data: { [key in string]: string }) => {
  await axios
    .post("/api/add", JSON.stringify(data), {
      headers: {
        "Content-Type": `application/json`,
      },
    })
    .then((res) => {
      console.log(res.data);
    });
};

export const postsCommentApi = async (
  data: CommentEl & { queryKey: string }
) => {
  await axios
    .post(`/api/${data.queryKey}/comment`, JSON.stringify(data), {
      headers: {
        "Content-Type": `application/json`,
      },
    })
    .then((res) => {
      getTargetPostApi(data.queryKey);
    });
};

export const getTargetPostApi = async (queryKey: string) => {
  return axios.get(`/api/${queryKey}`).then((res) => {
    return res.data;
  });
};
