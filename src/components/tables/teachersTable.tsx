"use client";

import React, { useState } from "react";
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
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogFooter,
} from "@/components/ui/dialog";
import { Trash2 } from "lucide-react";

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
  const schoolId = useUserStore((s) => s.schoolId)!;
  const queryClient = useQueryClient();
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [open, setOpen] = useState(false); // modal visibility

  const {
    data: teachers,
    isLoading,
    error,
  } = useQuery<Teacher[], Error>({
    queryKey: ["teachers", schoolId],
    queryFn: () => fetchTeachers(schoolId),
    enabled: Boolean(schoolId),
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
    setOpen(false);
    queryClient.invalidateQueries({ queryKey: ["teachers", schoolId] });
  };

  if (isLoading) return <div>Loading…</div>;
  if (error) return <div>Error: {error.message}</div>;
  if (!teachers || teachers.length === 0)
    return <div>No teachers found for this school.</div>;

  return (
    <>
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
          {teachers.map((t) => (
            <TableRow key={t.user_id}>
              <TableCell>{t.username}</TableCell>
              <TableCell>{t.email}</TableCell>
              <TableCell>{t.first_name}</TableCell>
              <TableCell>{t.last_name}</TableCell>
              <TableCell>{t.role}</TableCell>
              <TableCell className="text-center">
                {t.is_approved ? "✅" : "❌"}
              </TableCell>
              <TableCell className="flex space-x-4 items-center justify-center">
                {t.is_approved ? (
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => toggleApproval(t.user_id, false)}
                  >
                    Disapprove
                  </Button>
                ) : (
                  <Button
                    size="sm"
                    onClick={() => toggleApproval(t.user_id, true)}
                  >
                    Approve
                  </Button>
                )}
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() => {
                    setDeleteId(t.user_id);
                    setOpen(true);
                  }}
                >
                  <Trash2 className="w-4 h-4 mr-1" />
                  Delete
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* Single shared dialog instance */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <p className="text-sm">
            Are you sure you want to delete this teacher?
          </p>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={deleteTeacher}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
