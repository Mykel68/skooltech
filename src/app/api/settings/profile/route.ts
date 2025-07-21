import { NextResponse } from "next/server";
import { z } from "zod";
import axios from "axios";
import { profileSchema } from "@/schema/profileSchema";
import { cookies } from "next/headers";

export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const validatedData = profileSchema.parse(body);

    const backendUrl = process.env.MAIN_BACKEND_URL;
    if (!backendUrl) {
      throw new Error("MAIN_BACKEND_URL is not set");
    }

    const cookieStore = await cookies();
    const token = cookieStore.get("user_id")?.value;

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const response = await axios.patch(
      `${backendUrl}/api/profile`,
      validatedData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return NextResponse.json(response.data, { status: 200 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ errors: error.errors }, { status: 400 });
    }
    if (axios.isAxiosError(error)) {
      return NextResponse.json(
        {
          error: error.response?.data?.message || "Profile update failed",
        },
        { status: error.response?.status || 500 }
      );
    }
    console.error(error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
