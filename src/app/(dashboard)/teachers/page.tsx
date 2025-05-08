import { TeacherTable } from "@/components/tables/teachersTable";
import React from "react";

export default function Page() {
  return (
    <div className="p-4 space-y-4">
      <h1 className="text-2xl font-bold">Teacher Management</h1>
      <TeacherTable />
    </div>
  );
}
