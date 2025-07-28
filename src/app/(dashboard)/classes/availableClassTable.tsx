import { Checkbox } from "@/components/ui/checkbox";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";

export function AvailableClassTable({
  availableClasses,
  selectedClasses,
  toggleSelection,
  selectAllRef,
  handleSelectAll,
  handleCreateSelected,
  isPending,
}: any) {
  const totalUncreated = availableClasses.filter(
    (cls: any) => !cls.created
  ).length;

  return (
    <div className="rounded-xl border bg-white p-4 shadow-sm">
      <div className="overflow-x-auto rounded-md">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[50px]">
                <Checkbox
                  ref={selectAllRef}
                  checked={selectedClasses.length === totalUncreated}
                  onCheckedChange={(checked) =>
                    handleSelectAll(checked === true)
                  }
                />
              </TableHead>
              <TableHead>Class Name</TableHead>
              <TableHead>Short Name</TableHead>
              <TableHead>Level</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {availableClasses.map((cls: any) => (
              <TableRow key={cls.short}>
                <TableCell>
                  <Checkbox
                    checked={selectedClasses.includes(cls.short)}
                    onCheckedChange={() => toggleSelection(cls.short)}
                    disabled={cls.created}
                  />
                </TableCell>
                <TableCell>{cls.name}</TableCell>
                <TableCell>{cls.short}</TableCell>
                <TableCell>{cls.grade_level}</TableCell>
                <TableCell>
                  {cls.created ? (
                    <span className="rounded bg-green-100 px-2 py-1 text-xs font-medium text-green-700">
                      Created
                    </span>
                  ) : (
                    <span className="rounded bg-yellow-100 px-2 py-1 text-xs font-medium text-yellow-700">
                      Not Created
                    </span>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <div className="mt-4 flex justify-end">
        <Button onClick={handleCreateSelected} disabled={isPending}>
          {isPending ? "Creating..." : "Create Selected"}
        </Button>
      </div>
    </div>
  );
}
