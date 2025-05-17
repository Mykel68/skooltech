"use client";

import { useForm } from "react-hook-form";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import toast from "react-hot-toast";
import { useParams } from "next/navigation";
import { useRef } from "react";

export default function TermsPage() {
  const queryClient = useQueryClient();
  const dialogCloseRef = useRef<HTMLButtonElement>(null);
  const { session_id: sessionId } = useParams(); // assuming /session/[id]

  const {
    register,
    handleSubmit,
    reset,
    formState: { isSubmitting },
  } = useForm({
    defaultValues: {
      name: "",
      start_date: "",
      end_date: "",
    },
  });

  const { data: terms, isLoading } = useQuery({
    queryKey: ["terms", sessionId],
    queryFn: async () => {
      const res = await axios.get(`/api/term/list/${sessionId}`);
      return res.data;
    },
  });

  const createTerm = useMutation({
    mutationFn: async (data: any) => {
      return await axios.post(`/api/term/create-new/${sessionId}`, data);
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
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold">Terms</h1>
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
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? "Creating..." : "Create"}
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

      {isLoading ? (
        <p>Loading terms...</p>
      ) : (
        <ul className="space-y-2">
          {terms?.length ? (
            terms.map((term: any) => (
              <li key={term.id} className="border p-4 rounded-md">
                <p className="font-semibold">{term.name}</p>
                <p className="text-sm text-muted-foreground">
                  {new Date(term.startDate).toLocaleDateString()} -{" "}
                  {new Date(term.endDate).toLocaleDateString()}
                </p>
              </li>
            ))
          ) : (
            <p>No terms yet.</p>
          )}
        </ul>
      )}
    </div>
  );
}
