// app/api/school/edit-profile/[school_id]/route.ts

import { NextResponse } from "next/server";
import { z } from "zod";
import axios from "axios";
import { cookies } from "next/headers";

const partialSchoolProfileSchema = z.object({
  name: z.string().min(2).optional(),
  address: z.string().min(5).optional(),
  phone_number: z.string().min(10).optional(),
  school_code: z.string().min(1).optional(),
  school_image: z.string().url().nullable().optional(),
});

export async function PATCH(
  request: Request,
  // tell TS that params is a Promise
  { params }: { params: Promise<{ school_id: string }> }
) {
  try {
    // await params before destructuring
    const { school_id } = await params;

    const body = await request.json();
    const validated = partialSchoolProfileSchema.parse(body);

    const filteredData = Object.fromEntries(
      Object.entries(validated).filter(([, v]) => v != null)
    );

    if (Object.keys(filteredData).length === 0) {
      return NextResponse.json({ error: "No data to update" }, { status: 400 });
    }

    const backendUrl = process.env.MAIN_BACKEND_URL!;
    const token = (await cookies()).get("s_id")?.value;
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const resp = await axios.patch(
      `${backendUrl}/api/schools/profile/${school_id}`,
      filteredData,
      { headers: { Authorization: `Bearer ${token}` } }
    );

    return NextResponse.json(resp.data, { status: 200 });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ errors: err.errors }, { status: 400 });
    }
    if (axios.isAxiosError(err)) {
      return NextResponse.json(
        { error: err.response?.data?.message || "Update failed" },
        { status: err.response?.status || 500 }
      );
    }
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
