import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import axios from "axios";
import { backendClient } from "@/lib/backendClient";

export async function GET(
  _request: Request,
  context: {
    params: Promise<{ school_id: string; session_id: string; term_id: string }>;
  }
) {
  try {
    // ✅ Await the parameters correctly
    const { params } = await context;

    const backendUrl = process.env.MAIN_BACKEND_URL;
    if (!backendUrl) {
      throw new Error("MAIN_BACKEND_URL is not set");
    }

    const cookieStore = await cookies();
    const token = cookieStore.get("user_id")?.value;

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const response = await backendClient.get(
      `${backendUrl}/api/dashboard/${
        (
          await params
        ).school_id
      }/stats?session_id=${(await params).session_id}&term_id=${
        (
          await params
        ).term_id
      }`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return NextResponse.json(response.data, { status: 200 });
  } catch (error: any) {
    console.error("GET subject error:", error.message);

    if (axios.isAxiosError(error)) {
      return NextResponse.json(
        {
          error:
            error.response?.data?.message || "Failed to fetch dashboard stats",
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
