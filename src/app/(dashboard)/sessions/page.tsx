"use client";

import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { toast } from "sonner";
import { useUserStore } from "@/stores/userStore";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { SessionList } from "./SessionList";
import { CreateSessionDialog } from "./dialog/CreateSessionDialog";

export const sessionSchema = z.object({
  name: z.string().min(1, "Session name is required"),
  start_date: z.string().min(1, "Start date is required"),
  end_date: z.string().min(1, "End date is required"),
});

export type Session = {
  session_id: string;
  name: string;
  start_date: string;
  end_date: string;
  is_active: boolean;
};

export default function SessionPage() {
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
    onError: () => toast.error("Failed to create session"),
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
    onError: () => toast.error("Failed to update session"),
  });

  return (
    <Card className=" space-y-6">
      <CardHeader className="flex flex-row justify-between items-center">
        <CardTitle className="text-xl font-bold">School Sessions</CardTitle>
        <Button onClick={() => setOpenCreateDialog(true)}>
          Create New Session
        </Button>
      </CardHeader>

      <CardContent>
        <CreateSessionDialog
          open={openCreateDialog}
          setOpen={setOpenCreateDialog}
          form={createForm}
          mutation={createMutation}
        />

        <SessionList
          sessions={sessions}
          isLoading={isLoading}
          setEditSession={setEditSession}
          editForm={editForm}
          openEditDialog={openEditDialog}
          setOpenEditDialog={setOpenEditDialog}
          updateMutation={updateMutation}
          toggleActive={(session) =>
            updateMutation.mutate({
              session_id: session.session_id,
              data: { is_active: !session.is_active },
            })
          }
        />
      </CardContent>
    </Card>
  );
}
