"use client";

import { useState } from "react";
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
import { TeacherRow } from "./TeacherRow";
import { DeleteTeacherDialog } from "./dialogs/DeleteTeacherDialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

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

export default function TeacherTable() {
  const schoolId = useUserStore((s) => s.schoolId)!;
  const queryClient = useQueryClient();
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const {
    data: teachers,
    isLoading,
    error,
  } = useQuery<Teacher[], Error>({
    queryKey: ["teachers", schoolId],
    queryFn: () => fetchTeachers(schoolId),
    enabled: !!schoolId,
  });

  const toggleApproval = async (userId: string, approve: boolean) => {
    await axios.patch(`/api/user/verify-teacher/${userId}`, {
      is_approved: approve,
    });
    queryClient.invalidateQueries({ queryKey: ["teachers", schoolId] });
  };

  const deleteTeacher = async () => {
    if (!deleteId) return;
    await axios.delete(`/api/user/delete/${deleteId}`);
    setDeleteId(null);
    queryClient.invalidateQueries({ queryKey: ["teachers", schoolId] });
  };

  if (isLoading)
    return <div className="p-4 text-muted-foreground">Loading…</div>;
  if (error)
    return <div className="p-4 text-destructive">Error: {error.message}</div>;
  if (!teachers || teachers.length === 0)
    return <div className="p-4 text-muted-foreground">No teachers found.</div>;

  return (
    <div className="p-0.5 w-full max-w-7xl mx-auto">
      <Card className="rounded-2xl">
        <CardHeader className="pb-4">
          <CardTitle className="text-xl font-bold">All Teachers</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Username</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>First Name</TableHead>
                <TableHead>Last Name</TableHead>
                <TableHead>Role</TableHead>
                <TableHead className="text-center">Approved</TableHead>
                <TableHead className="text-center">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {teachers.map((teacher) => (
                <TeacherRow
                  key={teacher.user_id}
                  teacher={teacher}
                  onToggleApproval={toggleApproval}
                  onDeleteClick={setDeleteId}
                />
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <DeleteTeacherDialog
        open={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={deleteTeacher}
      />
    </div>
  );
}
