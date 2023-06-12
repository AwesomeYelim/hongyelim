import { getPosts } from "@/service/posts";
import { NextResponse } from "next/server";

export async function POST(request: Request, response: Response) {
  const data = await request.json();
  const posts = await getPosts();

  return NextResponse.json({ message: "성공쓰~" });
}

// export const POST = async (req: Request, res: Response) => {
//   const postData = await req.json(); // 보내준 JSON 데이터를 받아 데이터를 담아준다.
//   // process.cwd() > 현재 경로
//   // const filePath = path.join(process.cwd(), "public", "data", "post.json");
//   // if (!postData) return NextResponse.json({ message: "Missing Data" });
//   console.log(postData);
//   // const posts = await getPosts();

//   // const arr = [...posts];
//   // arr.push(postData);
//   // arr.sort((a, b) => (a.id > b.id ? -1 : 1));

//   // fs.writeFile(filePath, JSON.stringify(arr));
//   return NextResponse.json({ message: "" });
// };
