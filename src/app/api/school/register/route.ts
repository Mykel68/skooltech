import { NextResponse } from "next/server";
import { z } from "zod";
import axios from "axios";
import { schoolRegistrationApiSchema } from "@/schema/schoolRegistrationSchema";

export async function POST(request: Request) {
  try {
    // console.log("[POST] Body:");
    const body = await request.json();
    const validatedData = schoolRegistrationApiSchema.parse(body);

    // console.log(validatedData);

    const backendUrl = process.env.MAIN_BACKEND_URL;
    if (!backendUrl) {
      throw new Error("MAIN_BACKEND_URL is not set");
    }

    const response = await axios.post(
      `${backendUrl}/api/schools/register`,
      validatedData
    );
    // console.log(response.data);

    return NextResponse.json(response.data, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ errors: error.errors }, { status: 400 });
    }
    if (axios.isAxiosError(error)) {
      return NextResponse.json(
        { error: error.response?.data?.message || "Registration failed" },
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
