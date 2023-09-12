import { db } from "./firebase";
import { doc, getDocs, setDoc, collection } from "firebase/firestore";
import { Post } from "@/service/posts";
import fs from "fs";
import path from "path";

async function getData() {
  const fireposts = await getDocs(collection(db, "posts"));
  let posts: Post[] = [];
  /** firebase 에 있는 data 배열 */
  fireposts.forEach((doc) => {
    posts.push(doc.data() as Post);
  });
  return posts;
}

async function dataInterlock() {
  const posts = await getData();

  /** firebase 에 있는 data 배열의 titles */
  const postTitles = posts.map((el) => el.title);

  /** md 폴더에 있는 md file list */
  const existingMd = fs.readdirSync(path.join(process.cwd(), "data", "md")).map((el) => el.split(".")[0]);

  /** md file list 기준으로 firebase 에 없는 title 구분  */
  const differTargets = existingMd.filter((mdTitle) => !postTitles.includes(mdTitle));

  if (differTargets.length) {
    let idCount = 0;

    differTargets.forEach(async (title) => {
      const postData = doc(db, "posts", title);
      const mdPath = path.join(process.cwd(), "data", "md", `${title}.md`);

      let mdFile: Buffer | string;
      mdFile = fs.readFileSync(mdPath);
      mdFile = mdFile.toString();

      const splitTitles = title.split(/(?<=[a-z])(?=[A-Z])/); // camelcase 중간대문자 기준으로 tag 생성

      const restLetter = splitTitles.shift();

      await setDoc(postData, {
        id: posts.length === 1 || !posts.length ? idCount : posts.length + 1,
        title,
        content: mdFile.match(/#+\s(.+)/g)?.[0] || "", // mdfile contents 의 시작글
        post_title: `[${restLetter}] ${[...splitTitles].join("")}` || "",
        heart: {},
        heart_count: 0,
        created_at: Math.floor(new Date().getTime() / 1000) + idCount,
        tag: [restLetter, ...splitTitles] || [],
        comments: [],
      });

      idCount++;
    });

    // // 오래된순 => 최신순 => 왠만하면 db업데이트는 사용하지 않는걸로 resource 소모가 너무큼..
    // posts
    //   .sort((a, b) => a.created_at - b.created_at)
    //   .forEach((el, i) => {
    //     setDoc(doc(db, "posts", el.title), {
    //       ...el,
    //       id: i + 1,
    //     });
    //   });
  }

  return;
}

dataInterlock();
