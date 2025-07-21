import { NextResponse } from "next/server";
import { z } from "zod";
import axios from "axios";
import { cookies } from "next/headers";
import { backendClient } from "@/lib/backendClient";

// ✅ GET school profile
export async function GET(
  _request: Request,
  context: {
    params: Promise<{
      school_id: string;
      session_id: string;
      term_id: string;
      class_id: string;
    }>;
  }
) {
  try {
    const { school_id } = await context.params;
    const { session_id } = await context.params;
    const { term_id } = await context.params;
    const { class_id } = await context.params;
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
      `${backendUrl}/api/student-scores/${school_id}/students/${class_id}/results?session_id=${session_id}&term_id=${term_id}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return NextResponse.json(response.data, { status: 200 });
  } catch (error) {
    console.log("error", error);
    if (axios.isAxiosError(error)) {
      return NextResponse.json(
        {
          error: error.response?.data?.message || "Failed to fetch results",
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
