import { put } from "@vercel/blob";

export async function uploadSchoolImage(file: File): Promise<string> {
  const { url } = await put(`school-images/${Date.now()}-${file.name}`, file, {
    access: "public",
  });
  return url;
}
