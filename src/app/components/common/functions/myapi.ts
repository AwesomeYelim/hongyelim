import axios from "axios";

export const getPostApi = async () => {
  return axios.get("/api").then((res) => {
    return res.data;
  });
};
