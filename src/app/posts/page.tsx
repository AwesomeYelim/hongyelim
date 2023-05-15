import { getPosts } from "@/service/posts";
import Category from "../components/category";

export default async function PostPage() {
  /** 비동기로 작동되는 정적포스팅은 ssg페이지에서 가져와야한다.  */
  const posts = await getPosts();

  return (
    <div>
      <div>This is PostPage</div>
      <Category posts={posts} />
    </div>
  );
}
