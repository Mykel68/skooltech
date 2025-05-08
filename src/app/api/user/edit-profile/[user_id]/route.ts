import { NextResponse } from "next/server";
import { z } from "zod";
import axios from "axios";
import { cookies } from "next/headers";

const partialUserSchema = z.object({
  first_name: z.string().min(1).optional(),
  last_name: z.string().min(1).optional(),
  email: z.string().email().optional(),
  username: z.string().min(3).optional(),
});

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ user_id: string }> }
) {
  try {
    // 1) await params before destructuring
    const { user_id } = await params;

    // 2) parse & validate incoming body
    const body = await request.json();
    const validated = partialUserSchema.parse(body);

    // 3) strip undefined/null
    const filtered = Object.fromEntries(
      Object.entries(validated).filter(([, v]) => v != null)
    );

    if (Object.keys(filtered).length === 0) {
      return NextResponse.json({ error: "No data to update" }, { status: 400 });
    }

    // 4) grab your backend URL & auth token
    const backendUrl = process.env.MAIN_BACKEND_URL!;
    const token = (await cookies()).get("s_id")?.value;
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // 5) call the correct user-profile endpoint (note singular “user”)
    const resp = await axios.patch(
      `${backendUrl}/api/users/profile/${user_id}`,
      filtered,
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
