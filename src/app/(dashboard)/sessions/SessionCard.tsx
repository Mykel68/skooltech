import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { UseFormReturn } from "react-hook-form";

type Session = {
  session_id: string;
  name: string;
  start_date: string; // ISO string like "2025-01-01"
  end_date: string;
  is_active: boolean;
};

type Props = {
  session: Session;
  setEditSession: (session: Session) => void;
  editForm: UseFormReturn<{
    name: string;
    start_date: string;
    end_date: string;
  }>;
  openEditDialog: boolean;
  setOpenEditDialog: (open: boolean) => void;
  updateMutation: {
    mutate: (params: {
      session_id: string;
      data: {
        name: string;
        start_date: string;
        end_date: string;
      };
    }) => void;
    isPending: boolean;
  };
  toggleActive: (session: Session) => void;
};

export function SessionCard({
  session,
  setEditSession,
  editForm,
  openEditDialog,
  setOpenEditDialog,
  updateMutation,
  toggleActive,
}: Props) {
  const handleEdit = () => {
    setEditSession(session);
    editForm.reset({
      name: session.name,
      start_date: session.start_date.slice(0, 10),
      end_date: session.end_date.slice(0, 10),
    });
    setOpenEditDialog(true);
  };

  return (
    <div className="border p-4 rounded-2xl shadow-sm">
      <div className="flex justify-between items-center">
        <div>
          <p className="font-semibold text-lg">{session.name}</p>
          <p className="text-sm text-muted-foreground">
            {format(new Date(session.start_date), "MMM dd, yyyy")} -{" "}
            {format(new Date(session.end_date), "MMM dd, yyyy")}
          </p>
          <p className="flex items-center gap-2 text-sm mt-1">
            <span
              className={`h-2 w-2 rounded-full ${
                session.is_active ? "bg-green-500" : "bg-red-500"
              }`}
            ></span>
            {session.is_active ? "Active" : "Inactive"}
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => toggleActive(session)}>
            {session.is_active ? "Deactivate" : "Activate"}
          </Button>
          <Dialog open={openEditDialog} onOpenChange={setOpenEditDialog}>
            <DialogTrigger asChild>
              <Button onClick={handleEdit}>Edit</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Edit Session</DialogTitle>
              </DialogHeader>
              <form
                onSubmit={editForm.handleSubmit((data) => {
                  updateMutation.mutate({
                    session_id: session.session_id,
                    data,
                  });
                })}
                className="space-y-4"
              >
                <div>
                  <Label>Session Name</Label>
                  <Input {...editForm.register("name")} />
                </div>
                <div>
                  <Label>Start Date</Label>
                  <Input type="date" {...editForm.register("start_date")} />
                </div>
                <div>
                  <Label>End Date</Label>
                  <Input type="date" {...editForm.register("end_date")} />
                </div>
                <DialogFooter className="mt-4">
                  <Button type="submit" disabled={updateMutation.isPending}>
                    {updateMutation.isPending ? "Saving..." : "Save"}
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </div>
  );
}
