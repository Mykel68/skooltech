// components/session/SessionCard.tsx
"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { format } from "date-fns";
import { useState } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

const sessionSchema = z.object({
  name: z.string().min(1, "Session name is required"),
  start_date: z.string().min(1, "Start date is required"),
  end_date: z.string().min(1, "End date is required"),
});

type Session = {
  session_id: string;
  name: string;
  start_date: string;
  end_date: string;
  is_active: boolean;
};

type Props = {
  session: Session;
  schoolId: string;
};

export function SessionCard({ session, schoolId }: Props) {
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [editSession, setEditSession] = useState<Session | null>(null);
  const queryClient = useQueryClient();

  const editForm = useForm({
    resolver: zodResolver(sessionSchema),
    defaultValues: {
      name: session.name,
      start_date: session.start_date.slice(0, 10),
      end_date: session.end_date.slice(0, 10),
    },
  });

  const updateMutation = useMutation({
    mutationFn: async (payload: {
      session_id: string;
      data: Partial<Session>;
    }) => {
      return axios.patch(
        `/api/session/activate/${schoolId}/${payload.session_id}`,
        payload.data
      );
    },
    onSuccess: () => {
      toast.success("Session updated");
      queryClient.invalidateQueries({ queryKey: ["sessions", schoolId] });
      setOpenEditDialog(false);
      setEditSession(null);
    },
    onError: () => {
      toast.error("Failed to update session");
    },
  });

  const toggleActive = () => {
    updateMutation.mutate({
      session_id: session.session_id,
      data: { is_active: !session.is_active },
    });
  };

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
          <Button variant="outline" onClick={toggleActive}>
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
                  if (editSession) {
                    updateMutation.mutate({
                      session_id: editSession.session_id,
                      data,
                    });
                  }
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
