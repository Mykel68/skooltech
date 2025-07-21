import { NextResponse } from "next/server";
import { z } from "zod";
import axios from "axios";
import { cookies } from "next/headers";

const classSchemaa = z.object({
  name: z.string().min(2),
  start_date: z.string().min(1),
  end_date: z.string().min(1),
  //   school_code: z.string().min(1),
});

export async function POST(
  request: Request,
  // tell TS that params is a Promise
  { params }: { params: Promise<{ school_id: string }> }
) {
  try {
    // await params before destructuring
    const { school_id } = await params;

    const body = await request.json();
    // console.log("[POST] Body:", body);
    const validated = classSchemaa.parse(body);

    const backendUrl = process.env.MAIN_BACKEND_URL!;
    const token = (await cookies()).get("user_id")?.value;
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const resp = await axios.post(
      `${backendUrl}/api/sessions/${school_id}`,
      validated,
      { headers: { Authorization: `Bearer ${token}` } }
    );

    return NextResponse.json(resp.data, { status: 200 });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ errors: err.errors }, { status: 400 });
    }
    if (axios.isAxiosError(err)) {
      return NextResponse.json(
        { error: err.response?.data?.message || "Failed to create session" },
        { status: err.response?.status || 500 }
      );
    }
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
