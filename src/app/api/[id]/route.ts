import { NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";

export async function GET(req: Request, res: Response) {
  const mdPath = path.join(process.cwd(), "data/md", `${(res as Response & { params: { id: string } }).params.id}.md`);

  const mdPost = await fs.readFile(mdPath, "utf-8");

  return NextResponse.json(mdPost);
}
