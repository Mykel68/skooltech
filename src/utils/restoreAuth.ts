"use client";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";
import { DecodedToken } from "@/types/auth";
import { useUserStore } from "@/stores/userStore";

export function restoreUserFromCookie() {
  console.log("Hi");
  const token = Cookies.get("user_id");
  console.log(token);
  if (!token) return;

  try {
    const decoded = jwtDecode<DecodedToken>(token);
    console.log("[restoreAuth] Decoded token:", decoded);

    // If token expired, remove and bail
    if (decoded.exp * 1000 < Date.now()) {
      Cookies.remove("user_id");
      return;
    }

    // Hydrate Zustand store
    useUserStore.getState().setUser({
      userId: decoded.user_id,
      username: decoded.username,
      role: decoded.role,
      schoolId: decoded.school_id,
      firstName: decoded.first_name,
      lastName: decoded.last_name,
      email: decoded.email,
      schoolName: decoded.school_name,
      schoolImage: decoded.school_image,
      schoolCode: decoded.school_code,
    });
  } catch (err) {
    console.error("[restoreAuth] Failed to decode token:", err);
    Cookies.remove("user_id");
  }
}
