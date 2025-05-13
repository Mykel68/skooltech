"use client";

import { useUserStore } from "@/stores/userStore";
import SessionSetupForm from "./SessionSetupForm";
import AdminWelcomeDashboard from "./AdminWelcomeDashboard";

const AdminDashboard = () => {
  const session_id = useUserStore((s) => s.session_id);
  const isSchoolSetupComplete = !!session_id;

  return isSchoolSetupComplete ? (
    <AdminWelcomeDashboard />
  ) : (
    <SessionSetupForm />
  );
};

export default AdminDashboard;
