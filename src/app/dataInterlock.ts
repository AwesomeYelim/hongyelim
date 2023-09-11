import { db } from "./firebase";
import { doc, setDoc } from "firebase/firestore";

async function dataInterlock() {
  const postData = doc(db, "posts", "test");

  await setDoc(postData, {
    id: 10,
    title: "test",
    content: "test",
    post_title: "test",
    heart: {},
    heart_count: 0,
    created_at: Math.floor(new Date().getTime() / 1000),
    comments: [],
  });
}

dataInterlock();
