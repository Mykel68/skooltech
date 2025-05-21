"use client";

import axios from "axios";
import { useUserStore } from "@/stores/userStore";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StudentRow } from "./StudentRow";

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
  const { data } = await axios.get(`/api/user/get-students/${schoolId}`);
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
    enabled: !!schoolId,
  });

  const toggleApproval = async (userId: string, approve: boolean) => {
    await axios.patch(`/api/user/verify-student/${userId}`, {
      is_approved: approve,
    });
    queryClient.invalidateQueries({ queryKey: ["students", schoolId] });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl font-bold">All Students</CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <p className="text-muted-foreground">Loading students...</p>
        ) : error ? (
          <p className="text-red-500">Error: {error.message}</p>
        ) : students && students.length > 0 ? (
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
              {students.map((student) => (
                <StudentRow
                  key={student.user_id}
                  student={student}
                  onToggleApproval={toggleApproval}
                />
              ))}
            </TableBody>
          </Table>
        ) : (
          <p className="text-muted-foreground">
            No students found for this school.
          </p>
        )}
      </CardContent>
    </Card>
  );
}

export default StudentTable;
