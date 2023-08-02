import path from "path";
import { promises as fs } from "fs";

export type Post = {
  id: number;
  title: string;
  content: string;
  image: string;
  tag: string;
  like: boolean;
  like_count: number;
};

export async function getPosts(): Promise<Post[]> {
  const filePath = path.join(process.cwd(), "data", "posts.json");
  const data = await fs.readFile(filePath, "utf-8");
  const dataObj = JSON.parse(data);
  return dataObj;
}

export async function getTest(): Promise<string> {
  process.cwd();
  const filePath = path.join(process.cwd(), "data", "posts.json");
  // const data = await fs.readFile(filePath, "utf-8");
  return filePath;
}

export async function getPost(title: string): Promise<{ post?: Post; mdPost: string }> {
  // const { v4 } = require("uuid");
  // const uuid = v4();
  // console.log(uuid);
  // const nets = networkInterfaces();
  // console.log(ip.address());

  // const app = express();
  // app.get("/main", (req, res) => {
  //   res.send("main");
  //   // console.log(getClientIp(req));
  // });

  // app.listen(3001, () => {
  //   console.log("Express server started at port 3003");
  // });

  const mdPath = path.join(process.cwd(), "data/md", `${title}.md`);
  const mdPost = await fs.readFile(mdPath, "utf-8");
  const posts = await getPosts();
  const post = posts.find((item: Post) => item.title === title);

  return { post, mdPost };
}
