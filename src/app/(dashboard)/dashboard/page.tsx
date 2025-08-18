"use client";

import { useUserStore } from "@/stores/userStore";
import SessionSetupForm from "./SessionSetupForm";
import AdminDashboardPage from "./dashboard";
import SuperAdminDashboard from "./SuperAdminDashboard";
// import AdminWelcomeDashboard from "./AdminWelcomeDashboard";

const AdminDashboard = () => {
  const { role_names, session_id, term_id } = useUserStore();
  const isSuperAdmin = role_names?.includes("Super Admin");

  const isSchoolSetupComplete = !!session_id && !!term_id;

  return (
    <div className="min-h-screen bg-background">
      {isSuperAdmin ? (
        <SuperAdminDashboard />
      ) : isSchoolSetupComplete ? (
        <AdminDashboardPage />
      ) : (
        <SessionSetupForm />
      )}
    </div>
  );
};

export default AdminDashboard;
