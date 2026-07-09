import Image from "next/image";
import Link from "next/link";
import { getPosts } from "@/service/posts";
import Reveal from "./components/Reveal";
import main from "../../public/images/main.jpg";
import "./styles/page.scss";

export const revalidate = 3600;

export default async function HomePage() {
  const posts = await getPosts();
  const recentPosts = posts
    .sort((a, b) => b.created_at - a.created_at)
    .slice(0, 6);

  const tagCount: Record<string, number> = {};
  posts.forEach((post) => {
    post.tag.forEach((t) => {
      tagCount[t] = (tagCount[t] || 0) + 1;
    });
  });
  const tags = Object.entries(tagCount)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 14);

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
        <Reveal>
          <p className="hero_eyebrow">개발 블로그</p>
        </Reveal>
        <Reveal delay={1}>
          <h1 className="hero_title">
            기록이 쌓여
            <br />
            <span className="accent">성장</span>이 됩니다
          </h1>
        </Reveal>
        <Reveal delay={2}>
          <p className="hero_sub">
            안녕하세요, 백엔드·보안 개발자 <b>예림</b>입니다.
            <br />
            Go로 이질적인 멀티플랫폼을 하나의 체계로 묶는 일을 합니다.
          </p>
        </Reveal>
        <Reveal delay={3}>
          <div className="hero_links">
            <Link href="/posts" className="cta_btn">
              글 보러가기
            </Link>
            <Link href="/profile" className="cta_link">
              About me →
            </Link>
          </div>
        </Reveal>
        <Reveal delay={2} className="hero_img_area">
          <div className="hero_img">
            <Image src={main} alt="Yelim" width={180} height={180} priority />
          </div>
        </Reveal>
      </section>

      <section className="recent_posts">
        <Reveal>
          <div className="section_header">
            <h2>최근 글</h2>
            <Link href="/posts">전체보기 →</Link>
          </div>
        </Reveal>
        <div className="post_grid">
          {recentPosts.map((post, i) => (
            <Reveal key={post.id} delay={i % 3}>
              <Link href={`/posts/${post.title}`} className="post_card">
                <div className="card_tags">
                  {post.tag.slice(0, 2).map((t) => (
                    <span key={t} className="card_tag">
                      {t}
                    </span>
                  ))}
                </div>
                <h3>{post.post_title}</h3>
                <p className="excerpt">{post.content}</p>
                <div className="card_meta">
                  <span className="date">{formatDate(post.created_at)}</span>
                  <span className="likes">♥ {post.heart_count}</span>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="tag_cloud">
        <Reveal>
          <h2>관심 있는 주제로 찾아보기</h2>
        </Reveal>
        <Reveal delay={1}>
          <div className="tags">
            {tags.map(([tag, count]) => (
              <Link
                key={tag}
                href={{ pathname: "/posts", query: { tag } }}
                className="tag_pill"
              >
                {tag} <span>{count}</span>
              </Link>
            ))}
          </div>
        </Reveal>
      </section>
    </div>
  );
}
