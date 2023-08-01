import { MdfileViewer } from "@/app/components/common/MdfileViewer";
import Heart from "@/app/components/common/heart";
import { getPost } from "@/service/posts";
import Image from "next/image";
import { notFound } from "next/navigation";

type Props = {
  params: {
    slug: string;
  };
};

export default async function page({ params: { slug } }: Props) {
  const { post, mdPost } = await getPost(slug);
  if (!post) {
    notFound();
  }
  const { title, image, content } = post;

  return (
    <>
      <h1>{title}`s Detail Page</h1>
      <div className="detail_img">
        <Image src={`/images/${image}.png`} alt={image} width={1000} height={1000} priority />
      </div>
      <p>{content}</p>
      <Heart {...post} />
      <MdfileViewer mdPost={mdPost} />
    </>
  );
}
