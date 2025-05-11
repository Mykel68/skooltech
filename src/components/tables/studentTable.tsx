// components/StudentTable.tsx
"use client";

import React from "react";
import axios from "axios";
import { useUserStore } from "@/stores/userStore";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";

export type Student = {
  user_id: string;
  first_name: string;
  last_name: string;
  email: string;
  class: string;
  gender: string;
  is_approved: boolean;
  school_id: string;
};

async function fetchStudents(schoolId: string): Promise<Student[]> {
  const { data } = await axios.get<{
    success: boolean;
    data: Student[];
  }>(`/api/user/get-students/${schoolId}`);
  if (!data.success) throw new Error("API returned success=false");
  return data.data;
}

export function StudentTable() {
  const schoolId = useUserStore((s) => s.schoolId)!;
  const queryClient = useQueryClient();

  const {
    data: students,
    isLoading,
    error,
  } = useQuery<Student[], Error>({
    queryKey: ["students", schoolId],
    queryFn: () => fetchStudents(schoolId),
    enabled: Boolean(schoolId),
  });

  const toggleApproval = async (userId: string, approve: boolean) => {
    await axios.patch(
      `/api/user/verify-student/${userId}`,
      { is_approved: approve },
      {}
    );
    queryClient.invalidateQueries({ queryKey: ["students", schoolId] });
  };

  if (isLoading) return <div>Loading…</div>;
  if (error) return <div>Error: {error.message}</div>;
  if (!students || students.length === 0)
    return <div>No students found for this school.</div>;

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>First Name</TableHead>
          <TableHead>Last Name</TableHead>
          <TableHead>Email</TableHead>
          <TableHead>Class</TableHead>
          <TableHead>Gender</TableHead>
          <TableHead className="text-center">Approved</TableHead>
          <TableHead className="text-center">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {students.map((s) => (
          <TableRow key={s.user_id}>
            <TableCell>{s.first_name}</TableCell>
            <TableCell>{s.last_name}</TableCell>
            <TableCell>{s.email}</TableCell>
            <TableCell>{s.class}</TableCell>
            <TableCell>{s.gender}</TableCell>
            <TableCell className="text-center">
              {s.is_approved ? "✅" : "❌"}
            </TableCell>
            <TableCell className="flex space-x-2">
              {s.is_approved ? (
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() => toggleApproval(s.user_id, false)}
                >
                  Disapprove
                </Button>
              ) : (
                <Button
                  size="sm"
                  onClick={() => toggleApproval(s.user_id, true)}
                >
                  Approve
                </Button>
              )}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
