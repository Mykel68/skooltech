"use client";

import React, { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
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
import { Button } from "@/components/ui/button";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import { useUserStore } from "@/stores/userStore";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

// Zod Schema
const classSchema = z.object({
  name: z.string().min(2, "Class name is required"),
  grade_level: z.string().min(1, "Grade level is required"),
});

type ClassFormValues = z.infer<typeof classSchema>;

type SchoolClass = {
  id: string;
  name: string;
  grade_level: string;
};

async function fetchClasses(schoolId: string): Promise<SchoolClass[]> {
  const { data } = await axios.get(`/api/class/get-all-classs/${schoolId}`);
  return data.data.classes;
}

async function createClass({
  name,
  grade_level,
  schoolId,
}: ClassFormValues & { schoolId: string }) {
  await axios.post(`/api/class/create-new/${schoolId}`, { name, grade_level });
}

export default function ClassTable() {
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  const schoolId = useUserStore((s) => s.schoolId);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ClassFormValues>({
    resolver: zodResolver(classSchema),
  });

  const { data: classes, isLoading } = useQuery({
    queryKey: ["classes", schoolId],
    queryFn: () => fetchClasses(schoolId!),
    enabled: !!schoolId,
  });

  const { mutate, isPending } = useMutation({
    mutationFn: createClass,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["classes", schoolId] });
      reset();
      setOpen(false);
    },
  });

  const onSubmit = (values: ClassFormValues) => {
    if (!schoolId) return;
    mutate({ ...values, schoolId });
  };

  return (
    <div className="w-full mx-auto p-4 space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold">Classes</h2>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button>Create New Class</Button>
          </DialogTrigger>
          <DialogContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <DialogHeader>
                <DialogTitle>Create a Class</DialogTitle>
              </DialogHeader>
              <Input placeholder="Enter class name" {...register("name")} />
              {errors.name && (
                <p className="text-sm text-red-500">{errors.name.message}</p>
              )}

              <Input
                placeholder="Enter grade level (e.g. JSS2A)"
                {...register("grade_level")}
              />
              {errors.grade_level && (
                <p className="text-sm text-red-500">
                  {errors.grade_level.message}
                </p>
              )}

              <DialogFooter>
                <Button
                  variant="ghost"
                  onClick={() => setOpen(false)}
                  type="button"
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={isPending}>
                  {isPending ? "Creating..." : "Create"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {isLoading ? (
        <p>Loading classes...</p>
      ) : classes?.length ? (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Grade Level</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {classes.map((cls) => (
              <TableRow key={cls.id}>
                <TableCell>{cls.name}</TableCell>
                <TableCell>{cls.grade_level}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      ) : (
        <p>No classes available.</p>
      )}
    </div>
  );
}
