"use client";

import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
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
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { useUserStore } from "@/stores/userStore";

// --- Zod schema for creating a subject ---
const subjectSchema = z.object({
  class_id: z.string().min(1, "Class is required"),
  name: z.string().min(2, "Subject name is required"),
  code: z.string().min(1, "Subject code is required"),
});
type SubjectFormValues = z.infer<typeof subjectSchema>;

// --- Types ---
type SchoolClass = { id: string; name: string; grade_level: string };
type Subject = { id: string; class_id: string; name: string; code: string };

// --- Fetchers ---
async function fetchClasses(schoolId: string): Promise<SchoolClass[]> {
  const { data } = await axios.get(`/api/class/get-all-classs/${schoolId}`);
  return data.data.classes;
}

async function fetchSubjects(schoolId: string): Promise<Subject[]> {
  const { data } = await axios.get(`/api/subject/get-all/${schoolId}`);
  return data.data.subjects;
}

async function createSubject(
  payload: SubjectFormValues & { schoolId: string }
) {
  await axios.post(`/api/subject/create/${payload.class_id}`, {
    name: payload.name,
    code: payload.code,
  });
}

// --- Component ---
export default function SubjectTable() {
  const schoolId = useUserStore((s) => s.schoolId)!;
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);

  // Fetch classes
  const { data: classes = [], isLoading: loadingClasses } = useQuery({
    queryKey: ["classes", schoolId],
    queryFn: () => fetchClasses(schoolId),
    enabled: !!schoolId,
  });

  // Fetch subjects
  const { data: subjects = [], isLoading: loadingSubjects } = useQuery({
    queryKey: ["subjects", schoolId],
    queryFn: () => fetchSubjects(schoolId),
    enabled: !!schoolId,
  });

  // Setup RHF + Zod
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<SubjectFormValues>({
    resolver: zodResolver(subjectSchema),
  });

  // Mutation
  const createMutation = useMutation({
    mutationFn: createSubject,
    onSuccess: () => {
      toast.success("Subject created!");
      queryClient.invalidateQueries({ queryKey: ["subjects", schoolId] });
      reset();
      setOpen(false);
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || "Failed to create subject");
    },
  });

  const onSubmit = (values: SubjectFormValues) => {
    createMutation.mutate({ ...values, schoolId });
  };

  return (
    <div className="w-full mx-auto p-4 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold">Subjects</h2>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button>Create Subject</Button>
          </DialogTrigger>
          <DialogContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <DialogHeader>
                <DialogTitle>Create New Subject</DialogTitle>
              </DialogHeader>

              {/* Class Selector */}
              <Select
                onValueChange={(value) => {
                  register("class_id").onChange({ target: { value } });
                }}
              >
                <SelectTrigger className="w-full">
                  <span>Select class</span>
                </SelectTrigger>
                <SelectContent>
                  {classes.map((c) => (
                    <SelectItem key={c.id} value={c.id}>
                      {c.name} ({c.grade_level})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.class_id && (
                <p className="text-sm text-red-500">
                  {errors.class_id.message}
                </p>
              )}

              {/* Subject Name */}
              <Input placeholder="Subject Name" {...register("name")} />
              {errors.name && (
                <p className="text-sm text-red-500">{errors.name.message}</p>
              )}

              {/* Subject Code */}
              <Input placeholder="Subject Code" {...register("code")} />
              {errors.code && (
                <p className="text-sm text-red-500">{errors.code.message}</p>
              )}

              <DialogFooter>
                <Button
                  variant="ghost"
                  onClick={() => setOpen(false)}
                  type="button"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={isSubmitting || createMutation.isLoading}
                >
                  {isSubmitting || createMutation.isLoading
                    ? "Creating..."
                    : "Create"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Table */}
      {loadingSubjects ? (
        <p>Loading subjects…</p>
      ) : subjects.length > 0 ? (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Class</TableHead>
              <TableHead>Subject Name</TableHead>
              <TableHead>Subject Code</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {subjects.map((subj) => {
              const cls = classes.find((c) => c.id === subj.class_id);
              return (
                <TableRow key={subj.id}>
                  <TableCell>
                    {cls ? `${cls.name} (${cls.grade_level})` : subj.class_id}
                  </TableCell>
                  <TableCell>{subj.name}</TableCell>
                  <TableCell>{subj.code}</TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      ) : (
        <p>No subjects found.</p>
      )}
    </div>
  );
}
