import { NextResponse } from "next/server";
import { z } from "zod";
import axios from "axios";
import { cookies } from "next/headers";

const partialSchoolProfileSchema = z.object({
  name: z.string().min(2).optional(),
  address: z.string().min(5).optional(),
  phoneNumber: z.string().min(10).optional(),
  schoolImage: z.string().url().nullable().optional(),
});

export async function PATCH(
  request: Request,
  context: { params: { school_id: string } }
) {
  try {
    const { params } = await context;
    const body = await request.json();
    const validatedData = partialSchoolProfileSchema.parse(body);

    const filteredData = Object.fromEntries(
      Object.entries(validatedData).filter(([_, v]) => v !== undefined)
    );

    if (Object.keys(filteredData).length === 0) {
      return NextResponse.json({ error: "No data to update" }, { status: 400 });
    }

    const backendUrl = process.env.MAIN_BACKEND_URL;
    if (!backendUrl) {
      throw new Error("MAIN_BACKEND_URL is not set");
    }

    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const response = await axios.patch(
      `${backendUrl}/api/schools/profile/${params.school_id}`,
      filteredData,
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

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// ✅ GET school profile
export async function GET(
  _request: Request,
  context: { params: { school_id: string } }
) {
  try {
    const { params } = await context;
    const backendUrl = process.env.MAIN_BACKEND_URL;
    if (!backendUrl) {
      throw new Error("MAIN_BACKEND_URL is not set");
    }

    const cookieStore = await cookies();
    const token = cookieStore.get("s_id")?.value;

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const response = await axios.get(
      `${backendUrl}/api/schools/${params.school_id}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return NextResponse.json(response.data, { status: 200 });
  } catch (error) {
    if (axios.isAxiosError(error)) {
      return NextResponse.json(
        {
          error:
            error.response?.data?.message || "Failed to fetch school profile",
        },
        { status: error.response?.status || 500 }
      );
    }

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
