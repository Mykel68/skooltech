import { NextResponse } from "next/server";
import axios from "axios";
import { cookies } from "next/headers";

export async function PATCH(
  request: Request,
  context: { params: Promise<{ school_id: string; session_id: string }> }
) {
  const { school_id } = await context.params;
  const { session_id } = await context.params;
  console.log("school_id", school_id);
  console.log("session_id", session_id);
  const backendUrl = process.env.MAIN_BACKEND_URL;
  if (!backendUrl) throw new Error("MAIN_BACKEND_URL is not set");

  const cookieStore = await cookies();
  // make sure this matches whatever your auth cookie is actually called
  const token = cookieStore.get("user_id")?.value;
  const body = await request.json();
  //   console.log("→ token from cookie:", token);

  if (!token) {
    return NextResponse.json(
      { error: "Unauthorized: no token" },
      { status: 401 }
    );
  }

  try {
    const response = await axios.patch(
      `${backendUrl}/api/sessions/${school_id}/${session_id}`,
      body,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return NextResponse.json(response.data, { status: 200 });
  } catch (err) {
    if (axios.isAxiosError(err)) {
      console.error("Backend error:", err.response?.data);
      return NextResponse.json(
        {
          error: err.response?.data?.message || "Failed to activate session",
        },
        { status: err.response?.status || 500 }
      );
    }
    console.error(err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
