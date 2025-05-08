// components/TeacherTable.tsx
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

export type Teacher = {
  user_id: string;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  role: string;
  school_id: string;
  is_approved: boolean;
};

async function fetchTeachers(schoolId: string): Promise<Teacher[]> {
  const { data } = await axios.get<{ success: boolean; data: Teacher[] }>(
    `/api/user/get-teachers/${schoolId}`
  );
  if (!data.success) throw new Error("API returned success=false");
  return data.data;
}

export function TeacherTable() {
  const schoolId = useUserStore((s) => s.schoolId);
  const queryClient = useQueryClient();

  const {
    data: teachers,
    isLoading,
    error,
  } = useQuery<Teacher[], Error>({
    queryKey: ["teachers", schoolId],
    queryFn: () => fetchTeachers(schoolId),
    enabled: Boolean(schoolId),
  });

  if (isLoading) return <div>Loading…</div>;
  if (error) return <div>Error: {error.message}</div>;
  if (!teachers || teachers.length === 0)
    return <div>No teachers found for this school.</div>;

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Username</TableHead>
          <TableHead>Email</TableHead>
          <TableHead>First Name</TableHead>
          <TableHead>Last Name</TableHead>
          <TableHead>Role</TableHead>
          <TableHead>Approved</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {teachers.map((t) => (
          <TableRow key={t.user_id}>
            <TableCell>{t.username}</TableCell>
            <TableCell>{t.email}</TableCell>
            <TableCell>{t.first_name}</TableCell>
            <TableCell>{t.last_name}</TableCell>
            <TableCell>{t.role}</TableCell>
            <TableCell>{t.is_approved ? "✅" : "❌"}</TableCell>
            <TableCell>
              <Button
                size="sm"
                onClick={async () => {
                  await axios.post(`/api/teachers/${t.user_id}/approve`);
                  queryClient.invalidateQueries({
                    queryKey: ["teachers", schoolId],
                  });
                }}
              >
                Approve
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
