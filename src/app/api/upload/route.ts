import { NextRequest, NextResponse } from "next/server";
import { put } from "@vercel/blob";

export async function POST(req: NextRequest) {
  const formData = await req.formData();
  const file = formData.get("file");

  if (!file || typeof file === "string") {
    return NextResponse.json({ error: "Invalid file input" }, { status: 400 });
  }

  if (!(file instanceof Blob)) {
    return NextResponse.json(
      { error: "Input is not a Blob/File" },
      { status: 400 }
    );
  }

  const path = `school-logos/${Date.now()}-${(file as any).name || "upload"}`;

  const { url } = await put(path, file, {
    access: "public",
    token: process.env.BLOB_READ_WRITE_TOKEN!,
  });

  return NextResponse.json({ url });
}
