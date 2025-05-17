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

type Session = {
  session_id: string;
  name: string;
  is_active: boolean;
};

export default function SessionPage() {
  const schoolId = useUserStore((s) => s.schoolId);
  const queryClient = useQueryClient();
  const [editSession, setEditSession] = useState<Session | null>(null);
  const [name, setName] = useState("");

  // Fetch sessions
  const { data: sessions = [], isLoading } = useQuery({
    queryKey: ["sessions", schoolId],
    queryFn: async () => {
      const res = await axios.get(`/api/session/get-all-session/${schoolId}`);
      return res.data.data;
    },
    enabled: !!schoolId,
  });

  // Update session
  const updateMutation = useMutation({
    mutationFn: async (payload: { session_id: string; name: string }) => {
      return axios.put(`/api/session/${payload.session_id}`, {
        name: payload.name,
      });
    },
    onSuccess: () => {
      toast.success("Session updated");
      queryClient.invalidateQueries({ queryKey: ["sessions", schoolId] });
      setEditSession(null);
    },
    onError: () => {
      toast.error("Failed to update session");
    },
  });

  return (
    <div className="p-6 space-y-6">
      <h2 className="text-xl font-bold">School Sessions</h2>

      {isLoading ? (
        <p>Loading sessions...</p>
      ) : (
        <ul className="space-y-4">
          {sessions.map((session: Session) => (
            <li
              key={session.session_id}
              className="border p-4 rounded-lg flex justify-between items-center"
            >
              <div>
                <p className="font-semibold">{session.name}</p>
                <p className="text-sm text-muted-foreground">
                  {session.is_active ? "Active" : "Inactive"}
                </p>
              </div>
              <Dialog>
                <DialogTrigger asChild>
                  <Button
                    onClick={() => {
                      setEditSession(session);
                      setName(session.name);
                    }}
                  >
                    Edit
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Edit Session</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <Label>Session Name</Label>
                    <Input
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                    />
                  </div>
                  <DialogFooter className="mt-4">
                    <Button
                      onClick={() => {
                        if (editSession) {
                          updateMutation.mutate({
                            session_id: editSession.session_id,
                            name,
                          });
                        }
                      }}
                      disabled={updateMutation.isPending}
                    >
                      {updateMutation.isPending ? "Updating..." : "Update"}
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
