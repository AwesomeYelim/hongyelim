import axios from "axios";

export const getPostsApi = async () => {
  // return axios.get("/api").then((res) => {
  //   return res.data;
  // });
  const res = await fetch("/api", { cache: "no-store" });
  const data = await res.json();
  return data;
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
  return axios
    .get(`/api/${queryKey}`, {
      headers: {
        "Cache-Control": "no-store",
      },
    })
    .then((res) => {
      return res.data;
    });
};
