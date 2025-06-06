"use client";

import { useParams } from "next/navigation";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { format, isBefore, isAfter } from "date-fns";
import toast from "react-hot-toast";
import { useForm } from "react-hook-form";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { useUserStore } from "@/stores/userStore";

export default function IndividualSessionPage() {
  const { session_id: sessionId } = useParams();
  const queryClient = useQueryClient();
  const schoolId = useUserStore((s) => s.schoolId)!;
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingTerm, setEditingTerm] = useState<any>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
    watch,
    setError,
    clearErrors,
  } = useForm({
    defaultValues: {
      name: "",
      start_date: "",
      end_date: "",
    },
  });

  const startDate = watch("start_date");
  const endDate = watch("end_date");

  const { data: sessionDetails, isLoading: sessionLoading } = useQuery({
    queryKey: ["session", sessionId],
    queryFn: async () => {
      const res = await axios.get(
        `/api/session/get-by-id/${schoolId}/${sessionId}`
      );
      return res.data.data;
    },
  });

  const { data: termsData, isLoading: termsLoading } = useQuery({
    queryKey: ["terms", sessionId],
    queryFn: async () => {
      const res = await axios.get(`/api/term/list/${sessionId}`);
      return res.data.data;
    },
  });

  const createTerm = useMutation({
    mutationFn: async (data: any) => {
      return await axios.post(
        `/api/term/create-new/${schoolId}/${sessionId}`,
        data
      );
    },
    onSuccess: () => {
      toast.success("Term created successfully");
      queryClient.invalidateQueries({ queryKey: ["terms", sessionId] });
      reset();
      setDialogOpen(false);
    },
    onError: () => toast.error("Error creating term"),
  });

  const updateTerm = useMutation({
    mutationFn: async (data: any) => {
      return await axios.put(`/api/term/update/${editingTerm.id}`, data);
    },
    onSuccess: () => {
      toast.success("Term updated");
      queryClient.invalidateQueries({ queryKey: ["terms", sessionId] });
      reset();
      setEditingTerm(null);
      setDialogOpen(false);
    },
    onError: () => toast.error("Error updating term"),
  });

  const toggleActive = useMutation({
    mutationFn: async (term: any) => {
      return await axios.patch(`/api/term/toggle-active/${term.id}`);
    },
    onSuccess: () => {
      toast.success("Term status updated");
      queryClient.invalidateQueries({ queryKey: ["terms", sessionId] });
    },
    onError: () => toast.error("Failed to update status"),
  });

  const onSubmit = (data: any) => {
    if (!sessionDetails) return;

    const sessionStart = new Date(sessionDetails.start_date);
    const sessionEnd = new Date(sessionDetails.end_date);
    const termStart = new Date(data.start_date);
    const termEnd = new Date(data.end_date);

    if (isBefore(termStart, sessionStart)) {
      setError("start_date", {
        type: "manual",
        message: "Start date cannot be before session start date",
      });
      return;
    }

    if (isAfter(termEnd, sessionEnd)) {
      setError("end_date", {
        type: "manual",
        message: "End date cannot be after session end date",
      });
      return;
    }

    if (isAfter(termStart, termEnd)) {
      setError("end_date", {
        type: "manual",
        message: "End date cannot be before start date",
      });
      return;
    }

    clearErrors();

    if (editingTerm) {
      updateTerm.mutate(data);
    } else {
      createTerm.mutate(data);
    }
  };

  const handleEditClick = (term: any) => {
    setEditingTerm(term);
    setDialogOpen(true);
    reset({
      name: term.name,
      start_date: term.start_date,
      end_date: term.end_date,
    });
  };

  const handleDialogClose = () => {
    setEditingTerm(null);
    reset();
    setDialogOpen(false);
  };

  return (
    <div className="p-6">
      {sessionLoading ? (
        <p>Loading session details...</p>
      ) : sessionDetails ? (
        <div className="mb-6 border-b pb-4">
          <h1 className="text-2xl font-bold">{sessionDetails.name}</h1>
          <p className="text-muted-foreground">
            {format(new Date(sessionDetails.start_date), "PPP")} –{" "}
            {format(new Date(sessionDetails.end_date), "PPP")}
          </p>
        </div>
      ) : (
        <p className="text-red-500">Failed to load session details.</p>
      )}

      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold">Terms</h2>
        <Dialog open={dialogOpen} onOpenChange={handleDialogClose}>
          <DialogTrigger asChild>
            <Button onClick={() => setDialogOpen(true)}>Create New Term</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {editingTerm ? "Edit Term" : "Create Term"}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <Label>Term Name</Label>
                <Input
                  {...register("name", { required: "Term name is required" })}
                />
                {errors.name && (
                  <p className="text-sm text-red-500">{errors.name.message}</p>
                )}
              </div>
              <div>
                <Label>Start Date</Label>
                <Input
                  type="date"
                  {...register("start_date", {
                    required: "Start date is required",
                  })}
                />
                {errors.start_date && (
                  <p className="text-sm text-red-500">
                    {errors.start_date.message}
                  </p>
                )}
              </div>
              <div>
                <Label>End Date</Label>
                <Input
                  type="date"
                  {...register("end_date", {
                    required: "End date is required",
                  })}
                />
                {errors.end_date && (
                  <p className="text-sm text-red-500">
                    {errors.end_date.message}
                  </p>
                )}
              </div>
              <DialogFooter className="mt-4">
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting
                    ? editingTerm
                      ? "Updating..."
                      : "Creating..."
                    : editingTerm
                    ? "Update"
                    : "Create"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {termsLoading ? (
        <p>Loading terms...</p>
      ) : termsData?.length > 0 ? (
        <ul className="space-y-2">
          {termsData.map((term: any) => (
            <li key={term.id} className="border p-4 rounded-md">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-semibold">{term.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {format(new Date(term.start_date), "PPP")} –{" "}
                    {format(new Date(term.end_date), "PPP")}
                  </p>
                  <p
                    className={`text-sm ${
                      term.is_active ? "text-green-600" : "text-gray-500"
                    }`}
                  >
                    {term.is_active ? "Active" : "Inactive"}
                  </p>
                </div>
                <div className="space-x-2">
                  <Button
                    variant="outline"
                    onClick={() => handleEditClick(term)}
                  >
                    Edit
                  </Button>
                  <Button
                    variant="secondary"
                    onClick={() => toggleActive.mutate(term)}
                    disabled={toggleActive.isPending}
                  >
                    {term.is_active ? "Deactivate" : "Activate"}
                  </Button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p>No terms yet.</p>
      )}
    </div>
  );
}
