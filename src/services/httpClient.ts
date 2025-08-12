import axios, { AxiosInstance, AxiosError } from "axios";
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
  role_id: number;
  role_name: string;
  school_id: string;
  email: string;
  first_name: string;
  last_name: string;
  school_name: string;
  school_code: string;
  is_school_active: boolean;
  school_image: string;
  session_id: string;
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

  private handleError(action: string, error: unknown): never {
    if (axios.isAxiosError(error)) {
      const message =
        error.response?.data?.error ||
        error.response?.data?.message ||
        `${action} failed. Please try again.`;
      throw new Error(`${action} failed: ${message}`);
    }

    if (error instanceof Error) {
      throw new Error(`${action} failed: ${error.message}`);
    }

    throw new Error(`${action} failed: Unknown error`);
  }

  async registerSchool(data: SchoolFormData): Promise<unknown> {
    try {
      let imageUrl: string | null = null;

      if (
        data.school_image &&
        typeof data.school_image === "object" &&
        "name" in data.school_image &&
        "type" in data.school_image
      ) {
        // It's a File, upload it
        imageUrl = await uploadSchoolImage(data.school_image as File);
      } else if (typeof data.school_image === "string") {
        // Already a URL
        imageUrl = data.school_image;
      }

      const response = await this.client.post("/school/register", {
        ...data,
        school_image: imageUrl,
      });

      return response.data;
    } catch (error) {
      this.handleError("Registration", error);
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

      const { token } = response.data;

      if (!token) {
        throw new Error("No token received from backend");
      }

      const decoded = jwtDecode<DecodedToken>(token);
      return { token, decoded };
    } catch (error) {
      this.handleError("Login", error);
    }
  }

  async logoutUser(): Promise<void> {
    try {
      await this.client.post("/auth/logout");
    } catch (error) {
      this.handleError("Logout", error);
    }
  }

  async updateSchoolProfile(
    data: SchoolProfileFormData & { school_id: string }
  ): Promise<unknown> {
    try {
      const { school_id, school_image, ...rest } = data;
      const payload: Record<string, any> = { ...rest };

      if (school_image instanceof File) {
        const url = await uploadSchoolImage(school_image);
        payload.school_image = url;
      }

      const filtered = Object.fromEntries(
        Object.entries(payload).filter(([, v]) => v != null)
      );

      return (
        await this.client.patch(`/school/edit-profile/${school_id}`, filtered)
      ).data;
    } catch (error) {
      this.handleError("School profile update", error);
    }
  }

  async updateUserProfile(
    data: ProfileFormData & { user_id: string }
  ): Promise<unknown> {
    try {
      const { user_id, ...rest } = data;

      const filteredData = Object.fromEntries(
        Object.entries(rest).filter(
          ([_, value]) => value !== undefined && value !== null
        )
      );

      const response = await this.client.patch(
        `/user/edit-profile/${user_id}`,
        filteredData
      );

      return response.data;
    } catch (error) {
      this.handleError("User profile update", error);
    }
  }
}

// Exporting singleton instance
export const httpClient = new HttpClient();
export const registerSchool = httpClient.registerSchool.bind(httpClient);
export const loginUser = httpClient.loginUser.bind(httpClient);
export const logoutUser = httpClient.logoutUser.bind(httpClient);
export const updateSchoolProfile =
  httpClient.updateSchoolProfile.bind(httpClient);
export const updateUserProfile = httpClient.updateUserProfile.bind(httpClient);
