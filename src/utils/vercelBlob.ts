"use server";
import { put } from "@vercel/blob";

export async function uploadSchoolImage(file: File): Promise<string> {
  // console.log("BLOB_READ_WRITE_TOKEN:", process.env.BLOB_READ_WRITE_TOKEN);
  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    throw new Error(
      "Vercel Blob token is not configured. Please set BLOB_READ_WRITE_TOKEN."
    );
  }

  const { url } = await put(`school-images/${Date.now()}-${file.name}`, file, {
    access: "public",
    token: process.env.BLOB_READ_WRITE_TOKEN,
  });
  return url;
}

export async function uploadAttachment(
  file: File,
  folder: string = "file"
): Promise<string> {
  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    throw new Error(
      "Vercel Blob token is not configured. Please set BLOB_READ_WRITE_TOKEN."
    );
  }

  const path = `${folder}/${Date.now()}-${file.name}`;

  const { url } = await put(path, file, {
    access: "public",
    token: process.env.BLOB_READ_WRITE_TOKEN,
  });

  return url;
}
