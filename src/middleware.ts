import { doc, setDoc } from "firebase/firestore";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { db } from "./app/firebase";

export async function middleware(request: NextRequest) {
  // console.log("실행됩니까>?");
  // const postData = doc(db, "posts", "test");
  // await setDoc(postData, {
  //   id: 10,
  //   title: "test",
  //   content: "test",
  //   post_title: "test",
  //   heart: {},
  //   heart_count: 0,
  //   created_at: Math.floor(new Date().getTime() / 1000),
  //   comments: [],
  // });
  // return NextResponse.next();
}

// export const config = {
//   matcher: "/about/:path*",
// };
