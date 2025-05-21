"use client";

import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useUserStore } from "@/stores/userStore";
import { SubjectTableRow } from "./SubjectTableRow";
import { useSubjects } from "./useSubjects";
import { SubjectFormDialog } from "./SubjectFormDialog";

export default function SubjectTable() {
  const schoolId = useUserStore((s) => s.schoolId)!;
  const { classes, subjects, loadingSubjects, approve, disapprove, remove } =
    useSubjects(schoolId);

  return (
    <div className="p-4 space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold">Subjects</h2>
        <SubjectFormDialog schoolId={schoolId} classes={classes} />
      </div>

      {loadingSubjects ? (
        <p>Loading subjects...</p>
      ) : subjects.length > 0 ? (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Class</TableHead>
              <TableHead>Grade Level</TableHead>
              <TableHead>Subject</TableHead>
              <TableHead>Teacher</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {subjects.map((subject) => (
              <SubjectTableRow
                key={subject.subject_id}
                subject={subject}
                onApprove={() => approve.mutate(subject.subject_id)}
                onDisapprove={() => disapprove.mutate(subject.subject_id)}
                onDelete={() => remove.mutate(subject.subject_id)}
              />
            ))}
          </TableBody>
        </Table>
      ) : (
        <p>No subjects found.</p>
      )}
    </div>
  );
}
