import Image from "next/image";
import Link from "next/link";
import { getPosts } from "@/service/posts";
import main from "../../public/images/main.jpg";
import "./styles/page.scss";

export default async function HomePage() {
  const posts = await getPosts();
  const recentPosts = posts
    .sort((a, b) => b.created_at - a.created_at)
    .slice(0, 5);

  const tagCount: Record<string, number> = {};
  posts.forEach((post) => {
    post.tag.forEach((t) => {
      tagCount[t] = (tagCount[t] || 0) + 1;
    });
  });
  const tags = Object.entries(tagCount)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 15);

  const formatDate = (epoch: number) => {
    return new Date(epoch * 1000).toLocaleDateString("ko-kr", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="home_wrapper">
      <section className="hero">
        <div className="hero_text">
          <h1>Hello, I&apos;m <span className="accent">Yelim</span></h1>
          <p className="tagline">Done is better than perfect</p>
          <p className="sub">웹 개발자로서의 여정을 기록합니다.</p>
          <div className="hero_links">
            <Link href="/posts" className="cta_btn">Posts →</Link>
            <Link href="/profile" className="cta_link">About me</Link>
          </div>
        </div>
        <div className="hero_img">
          <Image
            src={main}
            alt="Yelim"
            width={160}
            height={160}
            priority
          />
        </div>
      </section>

      <section className="recent_posts">
        <div className="section_header">
          <h2>Recent Posts</h2>
          <Link href="/posts">모두 보기 →</Link>
        </div>
        <ul>
          {recentPosts.map((post) => (
            <li key={post.id}>
              <Link href={`/posts/${post.title}`}>
                <h3>{post.post_title}</h3>
                <span className="excerpt">{post.content}</span>
                <span className="date">{formatDate(post.created_at)}</span>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <section className="tag_cloud">
        <h2>Tags</h2>
        <div className="tags">
          {tags.map(([tag, count]) => (
            <Link
              key={tag}
              href={{ pathname: "/posts", query: { tag } }}
              className="tag_pill"
            >
              {tag} <span>({count})</span>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
