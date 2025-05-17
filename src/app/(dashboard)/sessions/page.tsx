"use client";

import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { useUserStore } from "@/stores/userStore";
import { format } from "date-fns";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useRouter } from "next/navigation";

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

export default function SessionPage() {
  const router = useRouter();
  const schoolId = useUserStore((s) => s.schoolId);
  const queryClient = useQueryClient();
  const [editSession, setEditSession] = useState<Session | null>(null);
  const [openCreateDialog, setOpenCreateDialog] = useState(false);
  const [openEditDialog, setOpenEditDialog] = useState(false);

  const createForm = useForm({
    resolver: zodResolver(sessionSchema),
    defaultValues: {
      name: "",
      start_date: "",
      end_date: "",
    },
  });

  const editForm = useForm({
    resolver: zodResolver(sessionSchema),
    defaultValues: {
      name: "",
      start_date: "",
      end_date: "",
    },
  });

  const { data: sessions = [], isLoading } = useQuery({
    queryKey: ["sessions", schoolId],
    queryFn: async () => {
      const res = await axios.get(`/api/session/get-all-session/${schoolId}`);
      return res.data.data;
    },
    enabled: !!schoolId,
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

  const createMutation = useMutation({
    mutationFn: async (data: z.infer<typeof sessionSchema>) => {
      const res = await axios.post(`/api/session/create-new/${schoolId}`, data);
      return res.data;
    },
    onSuccess: () => {
      toast.success("Session created");
      queryClient.invalidateQueries({ queryKey: ["sessions", schoolId] });
      setOpenCreateDialog(false);
      createForm.reset();
    },
    onError: () => {
      toast.error("Failed to create session");
    },
  });

  const handleEdit = (session: Session) => {
    setEditSession(session);
    editForm.reset({
      name: session.name,
      start_date: session.start_date.slice(0, 10),
      end_date: session.end_date.slice(0, 10),
    });
    setOpenEditDialog(true);
  };

  const toggleActive = (session: Session) => {
    updateMutation.mutate({
      session_id: session.session_id,
      data: { is_active: !session.is_active },
    });
  };

  return (
    <div className="p-6 space-y-6">
      <h2 className="text-xl font-bold">School Sessions</h2>

      {/* Create Session */}
      <Dialog open={openCreateDialog} onOpenChange={setOpenCreateDialog}>
        <DialogContent>
          <DialogHeader className="flex justify-between items-center">
            <DialogTitle>New Session</DialogTitle>
            <DialogTrigger asChild>
              <Button>Create New Session</Button>
            </DialogTrigger>
          </DialogHeader>
          <form
            onSubmit={createForm.handleSubmit((data) => {
              createMutation.mutate(data);
            })}
            className="space-y-4"
          >
            <div>
              <Label>Session Name</Label>
              <Input {...createForm.register("name")} />
            </div>
            <div>
              <Label>Start Date</Label>
              <Input type="date" {...createForm.register("start_date")} />
            </div>
            <div>
              <Label>End Date</Label>
              <Input type="date" {...createForm.register("end_date")} />
            </div>
            <DialogFooter className="mt-4">
              <Button type="submit" disabled={createMutation.isPending}>
                {createMutation.isPending ? "Creating..." : "Create"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {isLoading ? (
        <p>Loading...</p>
      ) : (
        <ul className="space-y-4">
          {sessions.map((session: Session) => (
            <li
              key={session.session_id}
              className="border p-4 rounded-lg space-y-2"
            >
              <div
                className="flex justify-between items-center cursor-pointer"
                onClick={() => router.push(`/sessions/${session.session_id}`)}
              >
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
                <div className="flex gap-3">
                  <Button
                    variant="outline"
                    onClick={() => toggleActive(session)}
                  >
                    {session.is_active ? "Deactivate" : "Activate"}
                  </Button>
                  <Dialog
                    open={openEditDialog}
                    onOpenChange={setOpenEditDialog}
                  >
                    <DialogTrigger asChild>
                      <Button onClick={() => handleEdit(session)}>Edit</Button>
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
                          <Input
                            type="date"
                            {...editForm.register("start_date")}
                          />
                        </div>
                        <div>
                          <Label>End Date</Label>
                          <Input
                            type="date"
                            {...editForm.register("end_date")}
                          />
                        </div>
                        <DialogFooter className="mt-4">
                          <Button
                            type="submit"
                            disabled={updateMutation.isPending}
                          >
                            {updateMutation.isPending ? "Saving..." : "Save"}
                          </Button>
                        </DialogFooter>
                      </form>
                    </DialogContent>
                  </Dialog>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
