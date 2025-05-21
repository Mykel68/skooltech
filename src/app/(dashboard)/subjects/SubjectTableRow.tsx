import { Subject } from "./types";
import { TableRow, TableCell } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";

type Props = {
  subject: Subject;
  onApprove: () => void;
  onDisapprove: () => void;
  onDelete: () => void;
};

export function SubjectTableRow({
  subject,
  onApprove,
  onDisapprove,
  onDelete,
}: Props) {
  return (
    <TableRow>
      <TableCell>{subject.class_name}</TableCell>
      <TableCell>{subject.grade_level}</TableCell>
      <TableCell>{subject.name}</TableCell>
      <TableCell>{subject.teacher_name}</TableCell>
      <TableCell>{subject.teacher_email}</TableCell>
      <TableCell>
        <div className="flex items-center gap-3 flex-wrap">
          <Badge
            className={
              subject.is_approved
                ? "bg-green-600 text-white"
                : "bg-yellow-300 text-black"
            }
          >
            {subject.is_approved ? "Approved" : "Pending"}
          </Badge>
          {subject.is_approved ? (
            <Button size="sm" variant="destructive" onClick={onDisapprove}>
              Disapprove
            </Button>
          ) : (
            <Button size="sm" onClick={onApprove}>
              Approve
            </Button>
          )}
          <Button size="icon" variant="ghost" onClick={onDelete}>
            <Trash2 className="w-4 h-4 text-red-500" />
          </Button>
        </div>
      </TableCell>
    </TableRow>
  );
}
