import { NextResponse } from "next/server";
import axios from "axios";
import { cookies } from "next/headers";

// GET user profile
export async function GET(
  request: Request,
  context: { params: Promise<{ user_id: string }> }
) {
  try {
    const params = await context.params; // Await the params here

    const backendUrl = process.env.MAIN_BACKEND_URL;
    if (!backendUrl) throw new Error("MAIN_BACKEND_URL is not set");

    const cookieStore = await cookies();
    const token = cookieStore.get("s_id")?.value;

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const response = await axios.get(
      `${backendUrl}/api/users/profile/${params.user_id}`, // Use awaited user_id
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
          error: error.response?.data?.message || "User profile fetch failed",
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

// // PATCH user profile
// export async function PATCH(
//   request: Request,
//   context: { params: Promise<{ user_id: string }> }
// ) {
//   try {
//     const params = await context.params; // Await the params here
//     const body = await request.json();

//     const backendUrl = process.env.MAIN_BACKEND_URL;
//     if (!backendUrl) throw new Error("MAIN_BACKEND_URL is not set");

//     const cookieStore = await cookies();
//     const token = cookieStore.get("s_id")?.value;

//     if (!token) {
//       return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
//     }

//     const response = await axios.put(
//       `${backendUrl}/api/users/profile/${params.user_id}`, // Use awaited user_id
//       body,
//       {
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       }
//     );

//     return NextResponse.json(response.data, { status: 200 });
//   } catch (error) {
//     if (error instanceof z.ZodError) {
//       return NextResponse.json({ errors: error.errors }, { status: 400 });
//     }

//     if (axios.isAxiosError(error)) {
//       return NextResponse.json(
//         {
//           error: error.response?.data?.message || "User profile update failed",
//         },
//         { status: error.response?.status || 500 }
//       );
//     }

//     console.error(error);
//     return NextResponse.json(
//       { error: "Internal server error" },
//       { status: 500 }
//     );
//   }
// }
