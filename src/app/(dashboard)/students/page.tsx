import { StudentTable } from "@/components/tables/studentTable";
import React from "react";

export default function page() {
  return (
    <div className="p-4 space-y-4">
      <h1 className="text-2xl font-bold">Student Management</h1>
      <StudentTable />
    </div>
  );
}
