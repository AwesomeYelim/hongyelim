import fs from "fs";
import path from "path";
import Image from "next/image";
import { MdfileViewer } from "@/app/components/common/MdfileViewer";
import { Comments } from "@/app/components/common/Comments";
import Heart from "@/app/components/common/heart";
import { getPost } from "@/service/posts";
import { notFound } from "next/navigation";
import { PrevNextButton } from "@/app/components/PrevNextButton";
import { GetSessionParams } from "next-auth/react";
import "./page.scss";
import { DetailTag } from "@/app/components/DetailTag";

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

  const { post, mdPost } = await getPost(slug);
  if (!post) {
    notFound();
  }
  /** img file이 있는지 확인 */
  const imgForm = ["png", "jpg", "jpeg", "gif"];
  const isImagepath = imgForm
    .map((el) => {
      return fs.existsSync(
        path.join(process.cwd(), "public", "images", `${post.title}.${el}`)
      );
    })
    .includes(true);

  const { title, id, tag } = post;

  return (
    <div className="detail_page_wrapper">
      <div className="detail_img">
        <Image
          src={`/images/${isImagepath ? title : "empty"}.png`}
          alt={title}
          width={1000}
          height={1000}
          priority
        />
      </div>
      <Heart {...post} />
      <MdfileViewer mdPost={mdPost} useToc={true} />
      <DetailTag {...post} />
      <PrevNextButton id={id} />
      <Comments {...post} />
    </div>
  );
}
