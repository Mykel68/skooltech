import axios, { AxiosInstance } from "axios";
import { SchoolFormData } from "@/types/school";
import { uploadSchoolImage } from "@/app/upload/route";

export class HttpClient {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: "/api",
      headers: {
        "Content-Type": "application/json",
      },
    });
  }

  async registerSchool(data: SchoolFormData): Promise<unknown> {
    try {
      let imageUrl: string | null = null;
      if (data.school_image) {
        imageUrl = await uploadSchoolImage(data.school_image);
      }

      const response = await this.client.post("/school/register", {
        ...data,
        school_image: imageUrl,
      });

      return response.data;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Registration failed: ${error.message}`);
      }
      throw new Error("Registration failed: Unknown error");
    }
  }
}

export const httpClient = new HttpClient();
export const registerSchool = httpClient.registerSchool.bind(httpClient);
