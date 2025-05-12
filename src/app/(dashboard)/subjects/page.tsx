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
import { Badge } from "@/components/ui/badge";
import { Trash2 } from "lucide-react";

// --- Zod schema for creating a subject ---
const subjectSchema = z.object({
  class_id: z.string().min(1, "Class is required"),
  name: z.string().min(2, "Subject name is required"),
  code: z.string().min(1, "Subject code is required"),
});
type SubjectFormValues = z.infer<typeof subjectSchema>;

// --- Types ---
type SchoolClass = {
  class_id: string;
  name: string;
  grade_level: string;
};

type Subject = {
  name: string;
  class_name: string;
  grade_level: string;
  teacher_name: string;
  teacher_email: string;
  is_approved: boolean;
};

// --- Fetchers ---
async function fetchClasses(schoolId: string): Promise<SchoolClass[]> {
  const { data } = await axios.get(`/api/class/get-all-classs/${schoolId}`);
  return data.data.classes;
}

async function fetchSubjects(schoolId: string): Promise<Subject[]> {
  const { data } = await axios.get(`/api/subject/get-all-subject/${schoolId}`);
  return data.data;
}

async function approveSubjects(schoolId: string): Promise<Subject[]> {
  const { data } = await axios.get(`/api/subject/approve/${schoolId}`);
  return data.data;
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
  const { data: classes = [], isPending: loadingClasses } = useQuery({
    queryKey: ["classes", schoolId],
    queryFn: () => fetchClasses(schoolId),
    enabled: !!schoolId,
  });

  // Fetch subjects
  const { data: subjects = [], isPending: loadingSubjects } = useQuery({
    queryKey: ["subjects", schoolId],
    queryFn: () => fetchSubjects(schoolId),
    enabled: !!schoolId,
  });

  // Setup RHF + Zod
  const {
    register,
    handleSubmit,
    setValue,
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

  const approveMutation = useMutation({
    mutationFn: async (subjectId: string) => {
      await axios.patch(`/api/subject/approve/${subjectId}`);
    },
    onSuccess: () => {
      toast.success("Subject approved");
      queryClient.invalidateQueries({ queryKey: ["subjects", schoolId] });
    },
    onError: () => {
      toast.error("Failed to approve subject");
    },
  });

  const disapproveMutation = useMutation({
    mutationFn: async (subjectId: string) => {
      await axios.patch(`/api/subject/disapprove/${subjectId}`);
    },
    onSuccess: () => {
      toast.success("Subject disapproved");
      queryClient.invalidateQueries({ queryKey: ["subjects", schoolId] });
    },
    onError: () => {
      toast.error("Failed to disapprove subject");
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
              <Select onValueChange={(value) => setValue("class_id", value)}>
                <SelectTrigger className="w-full">
                  <span>Select class</span>
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
                  disabled={isSubmitting || createMutation.isPending}
                >
                  {isSubmitting || createMutation.isPending
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
              <TableHead>Grade Level</TableHead>
              <TableHead>Subject Name</TableHead>
              <TableHead>Teacher</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {subjects.map((subj, idx) => (
              <TableRow key={idx}>
                <TableCell>{subj.class_name}</TableCell>
                <TableCell>{subj.grade_level}</TableCell>
                <TableCell>{subj.name}</TableCell>
                <TableCell>{subj.teacher_name}</TableCell>
                <TableCell>{subj.teacher_email}</TableCell>
                <TableCell className="flex items-center gap-5">
                  <Badge
                    variant={subj.is_approved ? "default" : "secondary"}
                    className={
                      subj.is_approved
                        ? "bg-green-600 hover:bg-green-700 text-white gap-2"
                        : "bg-red-300 border border-red-600 hover:bg-red-300 text-black/80 gap-2"
                    }
                  >
                    <span
                      className={`h-2 w-2 rounded-full ${
                        subj.is_approved ? "bg-white" : "bg-red-600"
                      }`}
                    />
                    {subj.is_approved ? "Approved" : "Pending"}
                  </Badge>

                  {subj.is_approved ? (
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-24"
                      onClick={() => disapproveMutation.mutate(subj.subject_id)}
                    >
                      Disapprove
                    </Button>
                  ) : (
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-24"
                      onClick={() => approveMutation.mutate(subj.subject_id)}
                    >
                      Approve
                    </Button>
                  )}

                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => deleteMutation.mutate(subj.subject_id)}
                  >
                    <Trash2 className="w-4 h-4 mr-1 text-red-500" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      ) : (
        <p>No subjects found.</p>
      )}
    </div>
  );
}
