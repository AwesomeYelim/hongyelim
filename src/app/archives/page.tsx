import Link from "next/link";
import { getPosts } from "@/service/posts";
import "./page.scss";

export const revalidate = 3600;

export default async function ArchivesPage() {
  const posts = await getPosts();
  const sorted = posts.sort((a, b) => b.created_at - a.created_at);

  // Group by year-month
  const grouped: Record<string, typeof posts> = {};
  sorted.forEach((post) => {
    const date = new Date(post.created_at * 1000);
    const key = `${date.getFullYear()}.${String(date.getMonth() + 1).padStart(2, "0")}`;
    if (!grouped[key]) grouped[key] = [];
    grouped[key].push(post);
  });

  const formatDate = (epoch: number) => {
    const d = new Date(epoch * 1000);
    return `${String(d.getMonth() + 1).padStart(2, "0")}.${String(d.getDate()).padStart(2, "0")}`;
  };

  return (
    <div className="archive_page">
      <div className="ar_title">
        <h1>Archives</h1>
      </div>
      <span className="ar_sub">총 {posts.length}개의 글</span>

      <div className="timeline">
        {Object.entries(grouped).map(([yearMonth, items]) => (
          <div key={yearMonth} className="timeline_group">
            <h2 className="timeline_date">{yearMonth}</h2>
            <ul>
              {items.map((post) => (
                <li key={post.id}>
                  <Link href={`/posts/${post.title}`}>
                    <span className="post_date">{formatDate(post.created_at)}</span>
                    {post.post_title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}
