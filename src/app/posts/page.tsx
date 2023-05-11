import { getPosts } from "@/service/posts";
import Image from "next/image";
import Link from "next/link";
import Category from "../components/category";

export default async function PostPage() {
  const posts = await getPosts();
  /** tag 별 category 생성  */
  const tag = posts.map((item) => item.tag).filter((item, i, arr) => arr.indexOf(item) === i);

  return (
    <div>
      <div>This is PostPage</div>
      {/* @ts-expect-error Async Server Component */}
      <Category />

      {tag.map((keyword) => {
        return <p key={keyword}>{keyword}</p>;
      })}
      <ul>
        {posts.map(({ id, title, image }) => {
          return (
            <li key={id}>
              <Link href={`/posts/${title}`}>
                {title}
                <Image src={`/images/${image}.png`} alt={image} width={300} height={300} />
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
