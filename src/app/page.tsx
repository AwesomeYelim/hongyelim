import { getPosts } from "@/service/posts";
import Image from "next/image";
import Link from "next/link";
import main from "../../public/images/main.png";
import "./page.scss";

export default async function Home() {
  const posts = await getPosts();

  return (
    <div className="main_wrapper">
      <Image className="main_img" src={main} alt="main yelim" width={300} height={300} priority />
      <p>Hi there! this is yelim, I am frontEnd Developer</p>

      <ul className="main_posts">
        {posts.map(({ id, title, image }) => {
          return (
            <li key={id}>
              <Link href={`/posts/${title}`}>
                <Image src={`/images/${image}.png`} alt={image} width={200} height={200} />
                {title}
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
