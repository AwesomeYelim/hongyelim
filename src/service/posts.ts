import path from "path";
import { promises as fs } from "fs";
import { getServerSideSitemap, ISitemapField } from "next-sitemap";
import { collection, getDocs } from "firebase/firestore";
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
  let posts: Post[] = [];

  fireposts.forEach((doc) => {
    posts.push(doc.data() as Post);
  });

  // // seo 동적사이트 감지되도록
  // const sitemaps: ISitemapField[] = posts.map((idx: Post) => {
  //   return {
  //     // 페이지 경로
  //     loc: `${process.env.NEXTAUTH_URL || `http://localhost:3000`}/posts/${idx.title}`,
  //     // 변경일
  //     lastmod: new Date().toISOString(),
  //     changefreq: "daily",
  //     priority: 1,
  //   };
  // });

  // getServerSideSitemap(posts as any, sitemaps);

  return posts;
}

export async function getPost(id_title: string): Promise<{ post: Post; mdPost: string }> {
  const mdPath = path.join(process.cwd(), "data/md", `${id_title}.md`);

  const mdPost = await fs.readFile(mdPath, "utf-8");
  const posts = await getPosts();

  const post = posts.find((item) => item.title === id_title);

  return { post: post as Post, mdPost };
}
