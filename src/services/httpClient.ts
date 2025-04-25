import axios, { AxiosInstance } from "axios";
import { jwtDecode } from "jwt-decode";
import { SchoolFormData } from "@/types/school";
import { LoginFormData } from "@/types/login";
import { ProfileFormData } from "@/types/profile";
import { SchoolProfileFormData } from "@/types/schoolProfile";
import { uploadSchoolImage } from "@/utils/vercelBlob";

interface DecodedToken {
  user_id: string;
  username: string;
  role: string;
  school_id: string;
  email: string;
  first_name: string;
  last_name: string;
  iat: number;
  exp: number;
}

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

  async loginUser(
    data: LoginFormData
  ): Promise<{ token: string; decoded: DecodedToken }> {
    try {
      const response = await this.client.post("/auth/login", {
        ...data,
        agreeToTerms: undefined,
      });
      console.log("[HttpClient] Login API response:", response.data);
      const { token } = response.data;

      if (!token) {
        throw new Error("No token received from backend");
      }

      try {
        const decoded = jwtDecode<DecodedToken>(token);
        console.log("[HttpClient] Decoded token:", decoded);
        return { token, decoded };
      } catch (decodeError) {
        throw new Error("Failed to decode token");
      }
    } catch (error) {
      if (error instanceof Error) {
        console.error("[HttpClient] Login error:", error.message);
        throw new Error(`Login failed: ${error.message}`);
      }
      throw new Error("Login failed: Unknown error");
    }
  }

  async logoutUser(): Promise<void> {
    try {
      await this.client.post("/auth/logout");
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Logout failed: ${error.message}`);
      }
      throw new Error("Logout failed: Unknown error");
    }
  }

  async updateSchoolProfile(data: SchoolProfileFormData): Promise<unknown> {
    try {
      let imageUrl: string | null = null;
      if (data.school_image) {
        imageUrl = await uploadSchoolImage(data.school_image);
      }

      // Filter out undefined or null fields
      const filteredData = Object.fromEntries(
        Object.entries({
          ...data,
          schoolImage: imageUrl,
        }).filter(([_, value]) => value !== undefined && value !== null)
      );

      console.log("[HttpClient] Filtered school profile data:", filteredData);

      const response = await this.client.patch(
        "/school/edit-profile",
        filteredData
      );
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
      // Filter out undefined or null fields
      const filteredData = Object.fromEntries(
        Object.entries(data).filter(
          ([_, value]) => value !== undefined && value !== null
        )
      );

      console.log("[HttpClient] Filtered user profile data:", filteredData);

      const response = await this.client.patch(
        "/user/edit-profile",
        filteredData
      );
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
export const logoutUser = httpClient.logoutUser.bind(httpClient);
export const updateSchoolProfile =
  httpClient.updateSchoolProfile.bind(httpClient);
export const updateUserProfile = httpClient.updateUserProfile.bind(httpClient);
