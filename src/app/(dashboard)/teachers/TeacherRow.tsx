import { Button } from "@/components/ui/button";
import { TableRow, TableCell } from "@/components/ui/table";
import { Trash2 } from "lucide-react";
import { Teacher } from "./page"; // or update import if moved to types

type Props = {
  teacher: Teacher;
  onToggleApproval: (userId: string, approve: boolean) => void;
  onDeleteClick: (userId: string) => void;
};

export function TeacherRow({
  teacher,
  onToggleApproval,
  onDeleteClick,
}: Props) {
  return (
    <TableRow>
      <TableCell>{teacher.username}</TableCell>
      <TableCell>{teacher.email}</TableCell>
      <TableCell>{teacher.first_name}</TableCell>
      <TableCell>{teacher.last_name}</TableCell>
      <TableCell>{teacher.role}</TableCell>
      <TableCell className="text-center">
        {teacher.is_approved ? "✅" : "❌"}
      </TableCell>
      <TableCell>
        <div className="flex gap-2 justify-center items-center">
          <Button
            size="sm"
            variant={teacher.is_approved ? "destructive" : "default"}
            onClick={() =>
              onToggleApproval(teacher.user_id, !teacher.is_approved)
            }
            className="w-24"
          >
            {teacher.is_approved ? "Disapprove" : "Approve"}
          </Button>
          <Button
            size="icon"
            variant="ghost"
            onClick={() => onDeleteClick(teacher.user_id)}
          >
            <Trash2 className="w-4 h-4 text-red-500" />
          </Button>
        </div>
      </TableCell>
    </TableRow>
  );
}
