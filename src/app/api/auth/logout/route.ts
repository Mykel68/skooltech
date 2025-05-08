import { NextResponse } from "next/server";

export async function POST() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      "Set-Cookie":
        "user_id=; HttpOnly; Path=/; Max-Age=0; SameSite=Strict; Secure",
    },
  });
}
