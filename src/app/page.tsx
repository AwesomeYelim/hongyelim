import { getPosts } from "@/service/posts";
import Image from "next/image";
import Link from "next/link";
import main from "../../public/images/main.png";

export default async function Home() {
  const posts = await getPosts();

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        flexDirection: "column",
        alignItems: "center",
        gap: 50,
      }}
    >
      <Image
        style={{ borderRadius: "100%" }}
        src={main}
        alt="main yelim"
        width={300}
        height={300}
        priority
      />
      <p>Hi there! this is yelim, I am frontEnd Developer</p>

      <ul style={{ display: "flex", gap: 10, flexWrap: "wrap", padding: 30 }}>
        {posts.map(({ id, title, image }) => {
          return (
            <li
              key={id}
              style={{  overflow: "hidden" }}
            >
              <Link
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: 20,
                }}
                href={`/posts/${title}`}
              >
                <Image
                  src={`/images/${image}.png`}
                  alt={image}
                  width={200}
                  height={200}
                />
                {title}
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
