"use client";

import { useParams } from "next/navigation";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { format, isBefore, isAfter, parseISO } from "date-fns";
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
import { useState, useEffect } from "react";
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

  const watchedStart = watch("start_date");
  const watchedEnd = watch("end_date");

  const { data: sessionDetails, isLoading: sessionLoading } = useQuery({
    queryKey: ["session", sessionId],
    queryFn: async () => {
      const res = await axios.get(`/api/session/get-by-id/${schoolId}/${sessionId}`);
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
      return await axios.post(`/api/term/create-new/${schoolId}/${sessionId}`, data);
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
    mutationFn: async (payload: any) => {
      return await axios.patch(
        `/api/term/update/${schoolId}/${sessionId}/${payload.term_id}`,
        payload.data
      );
    },
    onSuccess: () => {
      toast.success("Term updated successfully");
      queryClient.invalidateQueries({ queryKey: ["terms", sessionId] });
      reset();
      setEditingTerm(null);
      setDialogOpen(false);
    },
    onError: () => toast.error("Error updating term"),
  });

  const onSubmit = (formData: any) => {
    if (!sessionDetails) return;

    const sessionStart = parseISO(sessionDetails.start_date);
    const sessionEnd = parseISO(sessionDetails.end_date);
    const termStart = parseISO(formData.start_date);
    const termEnd = parseISO(formData.end_date);

    if (isBefore(termStart, sessionStart)) {
      setError("start_date", { type: "manual", message: "Start date cannot be before session start" });
      return;
    }

    if (isAfter(termEnd, sessionEnd)) {
      setError("end_date", { type: "manual", message: "End date cannot be after session end" });
      return;
    }

    if (isAfter(termStart, termEnd)) {
      setError("end_date", { type: "manual", message: "End date cannot be before start date" });
      return;
    }

    clearErrors();

    if (editingTerm) {
      updateTerm.mutate({
        term_id: editingTerm.term_id,
        data: {
          name: formData.name,
          start_date: formData.start_date,
          end_date: formData.end_date,
        },
      });
    } else {
      createTerm.mutate({
        name: formData.name,
        start_date: formData.start_date,
        end_date: formData.end_date,
      });
    }
  };

  const handleEditClick = (term: any) => {
    setEditingTerm(term);
    setDialogOpen(true);
    reset({
      name: term.name,
      start_date: term.start_date.slice(0, 10),
      end_date: term.end_date.slice(0, 10),
    });
  };

  const handleDialogClose = (open: boolean) => {
    if (!open) {
      setEditingTerm(null);
      reset();
      clearErrors();
    }
    setDialogOpen(open);
  };

  const handleToggleActive = (term: any) => {
    updateTerm.mutate({
      term_id: term.term_id,
      data: { is_active: !term.is_active },
    });
  };

  useEffect(() => {
    if (!sessionDetails) return;

    const sessionStart = parseISO(sessionDetails.start_date);
    const sessionEnd = parseISO(sessionDetails.end_date);

    if (watchedStart) {
      const termStart = parseISO(watchedStart);
      if (isBefore(termStart, sessionStart) || isAfter(termStart, sessionEnd)) {
        setError("start_date", {
          type: "manual",
          message: "Start date must be within session range",
        });
      } else {
        clearErrors("start_date");
      }
    }

    if (watchedEnd) {
      const termEnd = parseISO(watchedEnd);
      const termStart = watchedStart ? parseISO(watchedStart) : null;

      if (isBefore(termEnd, sessionStart) || isAfter(termEnd, sessionEnd)) {
        setError("end_date", {
          type: "manual",
          message: "End date must be within session range",
        });
      } else if (termStart && isAfter(termStart, termEnd)) {
        setError("end_date", {
          type: "manual",
          message: "End date cannot be before start date",
        });
      } else {
        clearErrors("end_date");
      }
    }
  }, [watchedStart, watchedEnd, sessionDetails]);

  return (
    <div className="p-6">
      {sessionLoading ? (
        <p>Loading session details...</p>
      ) : sessionDetails ? (
        <div className="mb-6 border-b pb-4">
          <h1 className="text-2xl font-bold">{sessionDetails.name}</h1>
          <p className="text-muted-foreground">
            {format(parseISO(sessionDetails.start_date), "PPP")} –{" "}
            {format(parseISO(sessionDetails.end_date), "PPP")}
          </p>
        </div>
      ) : (
        <p className="text-red-500">Failed to load session details.</p>
      )}

      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold">Terms</h2>
        <Dialog open={dialogOpen} onOpenChange={handleDialogClose}>
          <DialogTrigger asChild>
            <Button onClick={() => setDialogOpen(true)}>
              {editingTerm ? "Edit Term" : "Create New Term"}
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editingTerm ? "Edit Term" : "Create Term"}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <Label>Term Name</Label>
                <Input {...register("name", { required: "Term name is required" })} />
                {errors.name && <p className="text-sm text-red-500">{errors.name.message}</p>}
              </div>
              <div>
                <Label>Start Date</Label>
                <Input
                  type="date"
                  {...register("start_date", { required: "Start date is required" })}
                  min={sessionDetails?.start_date.slice(0, 10)}
                  max={sessionDetails?.end_date.slice(0, 10)}
                />
                {errors.start_date && <p className="text-sm text-red-500">{errors.start_date.message}</p>}
              </div>
              <div>
                <Label>End Date</Label>
                <Input
                  type="date"
                  {...register("end_date", { required: "End date is required" })}
                  min={sessionDetails?.start_date.slice(0, 10)}
                  max={sessionDetails?.end_date.slice(0, 10)}
                />
                {errors.end_date && <p className="text-sm text-red-500">{errors.end_date.message}</p>}
              </div>
              <DialogFooter>
                <Button type="submit" disabled={isSubmitting}>
                  {editingTerm ? "Update Term" : "Create Term"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Render terms */}
      {termsLoading ? (
        <p>Loading terms...</p>
      ) : (
        <div className="space-y-4">
          {termsData?.map((term: any) => (
            <div key={term.term_id} className="border p-4 rounded-md">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-lg font-semibold">{term.name}</h3>
                  <p className="text-sm text-muted-foreground">
                    {format(parseISO(term.start_date), "PPP")} –{" "}
                    {format(parseISO(term.end_date), "PPP")}
                  </p>
                  {term.is_active && (
                    <p className="text-sm text-green-600 font-semibold">Active</p>
                  )}
                </div>
                <div className="flex gap-2">
                  <Button size="sm" onClick={() => handleEditClick(term)}>
                    Edit
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => handleToggleActive(term)}>
                    {term.is_active ? "Deactivate" : "Activate"}
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
