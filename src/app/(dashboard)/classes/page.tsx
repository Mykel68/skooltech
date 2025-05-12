import ClassTable from "@/components/tables/classTable";
import React from "react";

export default function page() {
  return (
    <div className="p-4 space-y-4">
      <h1 className="text-2xl font-bold">Class Management</h1>
      <ClassTable />
    </div>
  );
}
