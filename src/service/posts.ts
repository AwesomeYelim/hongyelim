import path from "path";
import { promises as fs } from "fs";

export type CommentEl = {
  user_name: string;
  img: string;
  content: string;
  com_created_at: number;
};

export type Post = {
  id: number;
  title: string;
  content: string;
  image: string;
  tag: string;
  like: boolean;
  like_count: number;
  created_at: number;
  comment: Comment[];
};

export async function getPosts(): Promise<Post[]> {
  const filePath = path.join(process.cwd(), "data", "posts.json");
  const data = await fs.readFile(filePath, "utf-8");
  const dataObj = JSON.parse(data);
  return dataObj;
}

export async function getPost(id_title: string): Promise<{ post: Post; mdPost: string }> {
  const mdPath = path.join(process.cwd(), "data/md", `${id_title}.md`);
  const mdPost = await fs.readFile(mdPath, "utf-8");
  const posts = await getPosts();
  const post = posts.find((item: Post) => `${item.id}_${item.title}` === id_title);

  return { post: post as Post, mdPost };
}
