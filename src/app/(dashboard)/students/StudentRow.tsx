import { TableRow, TableCell } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Student } from "./page";

type Props = {
  student: Student;
  onToggleApproval: (userId: string, approve: boolean) => void;
};

export function StudentRow({ student, onToggleApproval }: Props) {
  return (
    <TableRow>
      <TableCell>{student.first_name}</TableCell>
      <TableCell>{student.last_name}</TableCell>
      <TableCell>{student.email}</TableCell>
      <TableCell>{student.class}</TableCell>
      <TableCell>{student.gender}</TableCell>
      <TableCell className="text-center">
        {student.is_approved ? "✅" : "❌"}
      </TableCell>
      <TableCell className="text-center">
        {student.is_approved ? (
          <Button
            size="sm"
            variant="destructive"
            onClick={() => onToggleApproval(student.user_id, false)}
          >
            Disapprove
          </Button>
        ) : (
          <Button
            size="sm"
            onClick={() => onToggleApproval(student.user_id, true)}
          >
            Approve
          </Button>
        )}
      </TableCell>
    </TableRow>
  );
}
