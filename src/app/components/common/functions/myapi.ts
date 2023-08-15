import axios from "axios";

export const getPostApi = async () => {
  return axios.get("/api").then((res) => {
    return res.data;
  });
};

export const postAddApi = async (data: { [key in string]: string }) => {
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
