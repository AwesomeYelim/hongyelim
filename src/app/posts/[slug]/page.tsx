import fs from "fs";
import path from "path";
import Image from "next/image";
import MdfileViewer from "@/app/components/common/MdfileViewer";
import { Comments } from "@/app/components/common/Comments";
import Heart from "@/app/components/common/heart";
import { getPost } from "@/service/posts";
import { notFound } from "next/navigation";
import { PrevNextButton } from "@/app/components/PrevNextButton";
import { DetailTag } from "@/app/components/DetailTag";
import "./page.scss";

type Props = {
  params: {
    slug: string;
  };
};

/** 정적 생성 + 1시간 캐시 (ISR) — 요청마다 Firestore를 읽지 않는다 */
export const revalidate = 3600;

export async function generateStaticParams() {
  const mdDir = path.join(process.cwd(), "data/md");
  const files = fs.readdirSync(mdDir).filter((f) => f.endsWith(".md"));
  return files.map((f) => ({ slug: f.replace(/\.md$/, "") }));
}

export default async function page({ params }: Props) {
  const { slug } = params;

  const { post, mdPost } = await getPost(slug);
  if (!post) {
    notFound();
  }
  /** img file이 있는지 확인 */
  const imgForm = ["png", "jpg", "jpeg", "gif"];
  const isImagepath = imgForm
    .map((el) => {
      return fs.existsSync(path.join(process.cwd(), "public", "images", `${post.title}.${el}`));
    })
    .includes(true);

  const { title, id } = post;

  return (
    <div className="detail_page_wrapper">
      <div className="detail_img">
        <Image
          src={`/images/${isImagepath ? title : "empty"}.png`}
          alt={post.post_title || title}
          width={1000}
          height={1000}
          loading="eager"
          priority
        />
      </div>
      <Heart {...post} />
      <MdfileViewer {...post} mdPost={mdPost} useToc={true} />
      <DetailTag {...post} />
      <PrevNextButton id={id} />
      <Comments {...post} />
    </div>
  );
}
