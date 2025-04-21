import { NextResponse } from "next/server";
import { z } from "zod";
import axios from "axios";
import { cookies } from "next/headers";

const schoolProfileApiSchema = z.object({
  name: z.string().min(2),
  address: z.string().min(5),
  phoneNumber: z.string().min(10).optional(),
  schoolImage: z.string().url().nullable().optional(),
});

export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const validatedData = schoolProfileApiSchema.parse(body);

    const backendUrl = process.env.MAIN_BACKEND_URL;
    if (!backendUrl) {
      throw new Error("MAIN_BACKEND_URL is not set");
    }

    const token = cookies().get("token")?.value;
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const response = await axios.patch(
      `${backendUrl}/api/schools/profile`,
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
          error:
            error.response?.data?.message || "School profile update failed",
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
