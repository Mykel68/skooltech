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

type Session = {
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
  const [formData, setFormData] = useState({
    name: "",
    start_date: "",
    end_date: "",
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
      setEditSession(null);
    },
    onError: () => {
      toast.error("Failed to update session");
    },
  });

  const handleEdit = (session: Session) => {
    setEditSession(session);
    setFormData({
      name: session.name,
      start_date: session.start_date.slice(0, 10),
      end_date: session.end_date.slice(0, 10),
    });
  };

  const handleSave = () => {
    if (!editSession) return;
    updateMutation.mutate({
      session_id: editSession.session_id,
      data: formData,
    });
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

      {isLoading ? (
        <p>Loading...</p>
      ) : (
        <ul className="space-y-4">
          {sessions.map((session: Session) => (
            <li
              key={session.session_id}
              className="border p-4 rounded-lg space-y-2"
            >
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
                <div className="flex gap-3">
                  <Button
                    variant="outline"
                    onClick={() => toggleActive(session)}
                  >
                    {session.is_active ? "Deactivate" : "Activate"}
                  </Button>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button onClick={() => handleEdit(session)}>Edit</Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Edit Session</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div>
                          <Label>Session Name</Label>
                          <Input
                            value={formData.name}
                            onChange={(e) =>
                              setFormData((f) => ({
                                ...f,
                                name: e.target.value,
                              }))
                            }
                          />
                        </div>
                        <div>
                          <Label>Start Date</Label>
                          <Input
                            type="date"
                            value={formData.start_date}
                            onChange={(e) =>
                              setFormData((f) => ({
                                ...f,
                                start_date: e.target.value,
                              }))
                            }
                          />
                        </div>
                        <div>
                          <Label>End Date</Label>
                          <Input
                            type="date"
                            value={formData.end_date}
                            onChange={(e) =>
                              setFormData((f) => ({
                                ...f,
                                end_date: e.target.value,
                              }))
                            }
                          />
                        </div>
                      </div>
                      <DialogFooter className="mt-4">
                        <Button
                          onClick={handleSave}
                          disabled={updateMutation.isPending}
                        >
                          {updateMutation.isPending ? "Saving..." : "Save"}
                        </Button>
                      </DialogFooter>
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
