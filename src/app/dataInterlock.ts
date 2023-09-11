import { db } from "./firebase";
import { doc, getDocs, setDoc, collection } from "firebase/firestore";
import { Post } from "@/service/posts";
import fs from "fs";
import path from "path";

async function dataInterlock() {
  const fireposts = await getDocs(collection(db, "posts"));

  let posts: Post[] = [];

  /** firebase 에 있는 data 배열 */
  fireposts.forEach((doc) => {
    posts.push(doc.data() as Post);
  });

  /** firebase 에 있는 data 배열의 titles */
  const postTitles = posts.map((el) => el.title);

  /** md 폴더에 있는 md file list */
  const existingMd = fs.readdirSync(path.join(process.cwd(), "data", "md")).map((el) => el.split(".")[0]);

  /** md file list 기준으로 firebase 에 없는 title 구분  */
  const differTargets = existingMd.filter((mdTitle) => !postTitles.includes(mdTitle));

  if (differTargets.length) {
    differTargets.forEach(async (title) => {
      const postData = doc(db, "posts", title);
      const mdPath = path.join(process.cwd(), "data", "md", `${title}.md`);

      let mdFile: Buffer | string;
      mdFile = fs.readFileSync(mdPath);
      mdFile = mdFile.toString();

      await setDoc(postData, {
        id: posts.length + 1,
        title,
        content: mdFile.match(/#+\s(.+)/g)?.[0] || "", // mdfile contents 의 시작글
        post_title: `${title} 에 대하여...`,
        heart: {},
        heart_count: 0,
        created_at: Math.floor(new Date().getTime() / 1000),
        comments: [],
      });
    });
  }
}

dataInterlock();
