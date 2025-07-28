"use client";

import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { SchoolClass } from "./types";
import axios from "axios";

const subjectSchema = z.object({
  class_id: z.string().min(1),
  name: z.string().min(2),
  short: z.string().min(1),
});

type Props = {
  schoolId: string;
  classes: SchoolClass[];
};

export function SubjectFormDialog({ schoolId, classes }: Props) {
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(subjectSchema),
  });

  const createMutation = useMutation({
    mutationFn: (data: any) =>
      axios.post(`/api/subject/create/${data.class_id}`, {
        name: data.name,
        short: data.short,
      }),
    onSuccess: () => {
      toast.success("Subject created");
      queryClient.invalidateQueries({ queryKey: ["subjects", schoolId] });
      reset();
      setOpen(false);
    },
    onError: () => {
      toast.error("Failed to create subject");
    },
  });

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>Create Subject</Button>
      </DialogTrigger>
      <DialogContent>
        <form
          onSubmit={handleSubmit((data) => createMutation.mutate(data))}
          className="space-y-4"
        >
          <DialogHeader>
            <DialogTitle>Create New Subject</DialogTitle>
          </DialogHeader>

          <Select onValueChange={(val) => setValue("class_id", val)}>
            <SelectTrigger>
              <SelectValue placeholder="Select Class" />
            </SelectTrigger>
            <SelectContent>
              {classes.map((c) => (
                <SelectItem key={c.class_id} value={c.class_id}>
                  {c.name} ({c.grade_level})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.class_id && (
            <p className="text-sm text-red-500">{errors.class_id.message}</p>
          )}

          <Input placeholder="Subject Name" {...register("name")} />
          {errors.name && (
            <p className="text-sm text-red-500">{errors.name.message}</p>
          )}

          <Input placeholder="Subject short" {...register("short")} />
          {errors.short && (
            <p className="text-sm text-red-500">{errors.short.message}</p>
          )}

          <DialogFooter>
            <Button
              variant="ghost"
              type="button"
              onClick={() => setOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Creating..." : "Create"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
