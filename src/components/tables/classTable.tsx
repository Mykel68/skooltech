"use client";

import React, { useMemo, useState } from "react";
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
import { toast } from "sonner";
import { ArrowDown, ArrowUp } from "lucide-react";

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
  const [sortKey, setSortKey] = useState<"name" | "grade_level" | null>(null);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [isGenerating, setIsGenerating] = useState(false);
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
      toast.success("Class created successfully");
      queryClient.invalidateQueries({ queryKey: ["classes", schoolId] });
      reset();
      setOpen(false);
    },
    onError: (err: any) => {
      const message = err?.response?.data?.error || "Failed to create class";
      toast.error(message);
    },
  });

  const onSubmit = (values: ClassFormValues) => {
    if (!schoolId) return;
    mutate({ ...values, schoolId });
  };

  const toggleSort = (key: "name" | "grade_level") => {
    if (sortKey === key) {
      setSortDirection((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDirection("asc");
    }
  };

  const sortedClasses = useMemo(() => {
    if (!classes) return [];
    if (!sortKey) return classes;

    return [...classes].sort((a, b) => {
      const aValue = a[sortKey].toLowerCase();
      const bValue = b[sortKey].toLowerCase();
      const direction = sortDirection === "asc" ? 1 : -1;
      return aValue.localeCompare(bValue) * direction;
    });
  }, [classes, sortKey, sortDirection]);

  const generateDefaultClasses = async () => {
    if (!schoolId) return;
    setIsGenerating(true);

    const defaultClasses: ClassFormValues[] = [
      { name: "JSS 1", grade_level: "JSS1" },
      { name: "JSS 2", grade_level: "JSS2" },
      { name: "JSS 3", grade_level: "JSS3" },
      { name: "SSS 1", grade_level: "SS1" },
      { name: "SSS 2", grade_level: "SS2" },
      { name: "SSS 3", grade_level: "SS3" },
    ];

    try {
      await Promise.all(
        defaultClasses.map((cls) =>
          axios.post(`/api/class/create-new/${schoolId}`, cls)
        )
      );
      toast.success("Default classes generated successfully");
      queryClient.invalidateQueries({ queryKey: ["classes", schoolId] });
    } catch (err: any) {
      toast.error("Failed to generate classes");
    } finally {
      setIsGenerating(false);
    }
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
      ) : sortedClasses?.length ? (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead
                className="cursor-pointer"
                onClick={() => toggleSort("name")}
              >
                Name{" "}
                {sortKey === "name" &&
                  (sortDirection === "asc" ? (
                    <ArrowUp className="inline h-4 w-4" />
                  ) : (
                    <ArrowDown className="inline h-4 w-4" />
                  ))}
              </TableHead>
              <TableHead
                className="cursor-pointer"
                onClick={() => toggleSort("grade_level")}
              >
                Grade Level{" "}
                {sortKey === "grade_level" &&
                  (sortDirection === "asc" ? (
                    <ArrowUp className="inline h-4 w-4" />
                  ) : (
                    <ArrowDown className="inline h-4 w-4" />
                  ))}
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedClasses.map((cls) => (
              <TableRow key={cls.id}>
                <TableCell>{cls.name}</TableCell>
                <TableCell>{cls.grade_level}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      ) : (
        <div className="text-center space-y-4">
          <p>No classes available yet.</p>
          <Button onClick={generateDefaultClasses} disabled={isGenerating}>
            {isGenerating ? "Generating..." : "Generate Default Classes"}
          </Button>
        </div>
      )}
    </div>
  );
}
