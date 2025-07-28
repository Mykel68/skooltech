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

    // console.log(response.data);

    const { token } = response.data.data;

    // Set the token as an HTTP-only cookie
    const cookie = `user_id=${token}; HttpOnly; Path=/; Max-Age=3600; SameSite=Strict; Secure`;

    return new NextResponse(
      JSON.stringify({ message: "Login successful", token }),
      {
        status: 200,
        headers: {
          "Set-Cookie": cookie,
        },
      }
    );
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
