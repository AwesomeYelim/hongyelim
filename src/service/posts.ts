import path from "path";
import { promises as fs } from "fs";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../app/firebase";

export interface User {
  name: string;
  image: string;
  email: string;
}
export interface CommentEl {
  com_created_at: number[];
  contents: string;
  userInfo: User;
  children?: CommentEl[];
}

export type Post = {
  id: number;
  title: string;
  content: string;
  tag: string[];
  heart_count: number;
  heart: { [key in string]: boolean };
  created_at: number;
  comments?: CommentEl[];
  post_title: string;
};

export async function getPosts(): Promise<Post[]> {
  const fireposts = await getDocs(collection(db, "posts"));
  const posts: Post[] = [];

  fireposts.forEach((doc) => {
    posts.push(doc.data() as Post);
  });

  return posts;
}

export async function getPost(
  id_title: string
): Promise<{ post: Post; mdPost: string }> {
  const mdPath = path.join(process.cwd(), "data/md", `${id_title}.md`);

  // 단일 문서 쿼리 — 전체 컬렉션을 읽지 않는다
  const [mdPost, snapshot] = await Promise.all([
    fs.readFile(mdPath, "utf-8"),
    getDocs(query(collection(db, "posts"), where("title", "==", id_title))),
  ]);

  const post = snapshot.docs[0]?.data() as Post | undefined;

  return { post: post as Post, mdPost };
}
