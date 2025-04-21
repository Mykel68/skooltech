import axios, { AxiosInstance } from "axios";
import { SchoolFormData } from "@/types/school";
import { LoginFormData } from "@/types/login";
import { ProfileFormData } from "@/types/profile";
import { SchoolProfileFormData } from "@/types/schoolProfile";
import { uploadSchoolImage } from "@/utils/vercelBlob";

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

  async loginUser(data: LoginFormData): Promise<unknown> {
    try {
      const response = await this.client.post("/login", {
        ...data,
        agreeToTerms: undefined, // Exclude from API payload
      });

      return response.data;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Login failed: ${error.message}`);
      }
      throw new Error("Login failed: Unknown error");
    }
  }

  async updateSchoolProfile(data: SchoolProfileFormData): Promise<unknown> {
    try {
      let imageUrl: string | null = null;
      if (data.schoolImage) {
        imageUrl = await uploadSchoolImage(data.schoolImage);
      }

      const response = await this.client.patch("/school/profile", {
        ...data,
        schoolImage: imageUrl,
      });

      return response.data;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`School profile update failed: ${error.message}`);
      }
      throw new Error("School profile update failed: Unknown error");
    }
  }

  async updateUserProfile(data: ProfileFormData): Promise<unknown> {
    try {
      const response = await this.client.patch("/user/profile", data);

      return response.data;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`User profile update failed: ${error.message}`);
      }
      throw new Error("User profile update failed: Unknown error");
    }
  }
}

export const httpClient = new HttpClient();
export const registerSchool = httpClient.registerSchool.bind(httpClient);
export const loginUser = httpClient.loginUser.bind(httpClient);
export const updateSchoolProfile =
  httpClient.updateSchoolProfile.bind(httpClient);
export const updateUserProfile = httpClient.updateUserProfile.bind(httpClient);
