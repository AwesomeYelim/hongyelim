import Techlog from "../components/Techlog";
import "./page.scss";

export default async function PostPage() {
  return (
    <div className="techpost_page">
      <div className="post_title">
        <h1>Just Remember !</h1>
        <span>off the top of my head....</span>
      </div>
      <Techlog />
    </div>
  );
}
