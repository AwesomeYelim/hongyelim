import { getPost } from "@/service/posts";
import Image from "next/image";
import { notFound } from "next/navigation";

type Props = {
  params: {
    slug: string;
  };
};

export default async function page({ params: { slug } }: Props) {
  const post = await getPost(slug);
  if (!post) {
    notFound();
  }
  const { title, image, content } = post;

  return (
    <>
      <h1>{title}`s Detail Page</h1>
      <Image src={`/images/${image}.png`} alt={image} width={300} height={300} />
      <p>{content}</p>
    </>
  );
}
