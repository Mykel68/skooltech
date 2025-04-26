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
  school_name: string;
  school_code: string;
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
      withCredentials: true,
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
  async updateSchoolProfile(
    data: SchoolProfileFormData & { school_id: string }
  ): Promise<unknown> {
    try {
      // pull out school_id and the raw school_image value
      const { school_id, school_image, ...rest } = data;

      // start with everything else
      const payload: Record<string, any> = { ...rest };

      // only upload when it's really a File—never for a string URL
      if (school_image instanceof File) {
        const url = await uploadSchoolImage(school_image);
        payload.school_image = url;
      }

      // now strip out any undefined/null (so if you never touched school_image, it's gone)
      const filtered = Object.fromEntries(
        Object.entries(payload).filter(([, v]) => v != null)
      );

      console.log("[HttpClient] PATCH payload:", filtered);

      return (
        await this.client.patch(`/school/edit-profile/${school_id}`, filtered)
      ).data;
    } catch (err) {
      if (err instanceof Error)
        throw new Error(`School profile update failed: ${err.message}`);
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
