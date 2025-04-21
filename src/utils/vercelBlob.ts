"use server";
import { put } from "@vercel/blob";

export async function uploadSchoolImage(file: File): Promise<string> {
  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    throw new Error(
      "Vercel Blob token is not configured. Please set BLOB_READ_WRITE_TOKEN."
    );
  }

  try {
    const { url } = await put(
      `school-images/${Date.now()}-${file.name}`,
      file,
      {
        access: "public",
      }
    );
    return url;
  } catch (error) {
    throw new Error(
      `Failed to upload image: ${
        error instanceof Error ? error.message : "Unknown error"
      }`
    );
  }
}
