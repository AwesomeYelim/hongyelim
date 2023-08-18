import { MdfileViewer } from "@/app/components/common/MdfileViewer";
import { Comment } from "@/app/components/common/Comment";
import fs from "fs";
import Heart from "@/app/components/common/heart";
import { getPost } from "@/service/posts";
import Image from "next/image";
import { notFound } from "next/navigation";
import { PrevNextButton } from "@/app/components/PrevNextButton";
import { getSession, GetSessionParams } from "next-auth/react";
import { Utterance } from "@/app/components/common/Utterance";

type Props = {
  params:
    | {
        slug: string;
      }
    | GetSessionParams;
};

export default async function page({ params }: Props) {
  const { slug } = params as {
    slug: string;
  };
  const session = await getSession();

  console.log(session, "asdasd");
  const { post, mdPost } = await getPost(slug);
  if (!post) {
    notFound();
  }

  const { title, content, id } = post;

  let { image } = post;
  // fs.access(`public/images/${image}.png`, async (err) => {
  //   if (err) {
  //     image = "empty";
  //   }
  // });

  return (
    <>
      <h1>{title}`s Detail Page</h1>
      <div className="detail_img">
        <Image src={`/images/${image}.png`} alt={image} width={1000} height={1000} priority />
      </div>
      <Heart {...post} />
      <MdfileViewer mdPost={mdPost} useToc={true} />
      <PrevNextButton id={id} />
      <Utterance />
      {/* <Comment {...post} /> */}
    </>
  );
}
