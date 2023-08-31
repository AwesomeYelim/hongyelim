import axios from "axios";

export const getPostsApi = async () => {
  return axios
    .get("/api", {
      headers: {
        "Cache-Control": "no-store",
        Pragma: "no-store",
        Expires: "0",
      },
    })
    .then((res) => {
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

export const getTargetPostApi = async (queryKey: string) => {
  return axios.get(`/api/${queryKey}`).then((res) => {
    return res.data;
  });
};
