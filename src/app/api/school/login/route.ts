import { NextResponse } from "next/server";
import { z } from "zod";
import axios from "axios";
import { loginSchema } from "@/schema/loginSchema";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const validatedData = loginSchema.omit({ agreeToTerms: true }).parse(body);

    const backendUrl = process.env.MAIN_BACKEND_URL;
    if (!backendUrl) {
      throw new Error("MAIN_BACKEND_URL is not set");
    }

    const response = await axios.post(
      `${backendUrl}/api/auth/login`,
      validatedData
    );

    return NextResponse.json(response.data, { status: 200 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ errors: error.errors }, { status: 400 });
    }
    if (axios.isAxiosError(error)) {
      return NextResponse.json(
        { error: error.response?.data?.message || "Login failed" },
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
