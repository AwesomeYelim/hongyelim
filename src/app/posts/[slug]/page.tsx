import { MdfileViewer } from "@/app/components/common/MdfileViewer";
import fs from "fs";
import Heart from "@/app/components/common/heart";
import axios from "axios";
import { getPost } from "@/service/posts";
import Image from "next/image";
import { notFound } from "next/navigation";
import { GET } from "@/app/api/posts/route";

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
  const { title, content } = post;

  let { image } = post;
  fs.access(`public/images/${image}.png`, async (err) => {
    if (err) {
      image = "empty";
    }
  });

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
