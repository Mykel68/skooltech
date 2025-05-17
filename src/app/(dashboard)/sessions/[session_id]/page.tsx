"use client";

import { useParams } from "next/navigation";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { format } from "date-fns";
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
import { useRef } from "react";
import { useUserStore } from "@/stores/userStore";

export default function IndividualSessionPage() {
  const { session_id: sessionId } = useParams();
  const queryClient = useQueryClient();
  const dialogCloseRef = useRef<HTMLButtonElement>(null);
  const schoolId = useUserStore((s) => s.schoolId)!;

  const { register, handleSubmit, reset, formState } = useForm({
    defaultValues: {
      name: "",
      start_date: "",
      end_date: "",
    },
  });

  // Fetch session details
  const { data: sessionDetails, isLoading: sessionLoading } = useQuery({
    queryKey: ["session", sessionId],
    queryFn: async () => {
      const res = await axios.get(
        `/api/session/get-by-id/${schoolId}/${sessionId}`
      );
      return res.data.data;
    },
  });

  // Fetch terms for the session
  const { data: termsData, isLoading: termsLoading } = useQuery({
    queryKey: ["terms", sessionId],
    queryFn: async () => {
      const res = await axios.get(`/api/term/list/${sessionId}`);
      return res.data.data; // assuming terms are in res.data.data
    },
  });

  // Create new term
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
      dialogCloseRef.current?.click();
    },
    onError: () => {
      toast.error("Error creating term");
    },
  });

  return (
    <div className="p-6">
      {/* Session Info */}
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

      {/* Term Header and Dialog */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold">Terms</h2>
        <Dialog>
          <DialogTrigger asChild>
            <Button>Create New Term</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create Term</DialogTitle>
            </DialogHeader>
            <form
              onSubmit={handleSubmit((data) => createTerm.mutate(data))}
              className="space-y-4"
            >
              <div>
                <Label>Term Name</Label>
                <Input {...register("name", { required: true })} />
              </div>
              <div>
                <Label>Start Date</Label>
                <Input
                  type="date"
                  {...register("start_date", { required: true })}
                />
              </div>
              <div>
                <Label>End Date</Label>
                <Input
                  type="date"
                  {...register("end_date", { required: true })}
                />
              </div>
              <DialogFooter className="mt-4">
                <Button type="submit" disabled={formState.isSubmitting}>
                  {formState.isSubmitting ? "Creating..." : "Create"}
                </Button>
                <button
                  type="button"
                  className="hidden"
                  ref={dialogCloseRef}
                ></button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* List of Terms */}
      {termsLoading ? (
        <p>Loading terms...</p>
      ) : termsData?.length > 0 ? (
        <ul className="space-y-2">
          {termsData.map((term: any) => (
            <li key={term.id} className="border p-4 rounded-md">
              <p className="font-semibold">{term.name}</p>
              <p className="text-sm text-muted-foreground">
                {format(new Date(term.start_date), "PPP")} -{" "}
                {format(new Date(term.end_date), "PPP")}
              </p>
            </li>
          ))}
        </ul>
      ) : (
        <p>No terms yet.</p>
      )}
    </div>
  );
}
