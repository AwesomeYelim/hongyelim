import { getPosts } from "@/service/posts";
import Techlog from "../components/techposts";
import "./page.scss";
export default async function PostPage() {
  /** 비동기로 작동되는 정적포스팅은 ssg페이지에서 가져와야한다.  */
  const posts = await getPosts();

  return (
    <div className="techpost_page">
      <div className="title">Techlog</div>
      <Techlog posts={posts} />
    </div>
  );
}
