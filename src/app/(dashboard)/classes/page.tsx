"use client";

import { useEffect, useRef, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { useUserStore } from "@/stores/userStore";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

const defaultClasses = [
  { name: "Junior Secondary School 1", short: "JSS1", grade_level: "JSS1" },
  { name: "Junior Secondary School 2", short: "JSS2", grade_level: "JSS2" },
  { name: "Junior Secondary School 3", short: "JSS3", grade_level: "JSS3" },
  { name: "Senior Secondary School 1", short: "SS1", grade_level: "SS1" },
  { name: "Senior Secondary School 2", short: "SS2", grade_level: "SS2" },
  { name: "Senior Secondary School 3", short: "SS3", grade_level: "SS3" },
];

type ClassFormData = {
  name: string;
  grade_level: string;
  short: string;
};

export default function ClassSetupPage() {
  const [selectedClasses, setSelectedClasses] = useState<string[]>([]);
  const [existingClasses, setExistingClasses] = useState<string[]>([]);
  const [open, setOpen] = useState(false);
  const selectAllRef = useRef<HTMLInputElement>(null);
  const queryClient = useQueryClient();
  const schoolId = useUserStore((s) => s.schoolId);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ClassFormData>();

  const fetchExistingClasses = async () => {
    if (!schoolId) return [];
    const { data } = await axios.get(`/api/class/get-all-classs/${schoolId}`);
    return data.data.classes;
  };

  const createClass = async (payload: ClassFormData) => {
    await axios.post(`/api/class/create-new/${schoolId}`, payload);
  };

  const { data: fetchedClasses, isLoading } = useQuery({
    queryKey: ["classes", schoolId],
    queryFn: fetchExistingClasses,
    enabled: !!schoolId,
    onSuccess: (data) => {
      const existingShorts = data.map((cls: any) => cls.grade_level);
      setExistingClasses(existingShorts);
    },
  });

  const { mutateAsync, isPending } = useMutation({
    mutationFn: createClass,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["classes", schoolId] });
      setOpen(false);
      reset();
    },
  });

  const toggleSelection = (short: string) => {
    setSelectedClasses((prev) =>
      prev.includes(short)
        ? prev.filter((item) => item !== short)
        : [...prev, short]
    );
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedClasses(
        defaultClasses
          .filter((cls) => !existingClasses.includes(cls.grade_level))
          .map((cls) => cls.short)
      );
    } else {
      setSelectedClasses([]);
    }
  };

  const handleCreateSelected = async () => {
    if (!schoolId || selectedClasses.length === 0) {
      toast.error("No class selected");
      return;
    }

    try {
      const toCreate = defaultClasses.filter((cls) =>
        selectedClasses.includes(cls.short)
      );
      await Promise.all(
        toCreate.map((cls) =>
          mutateAsync({
            name: cls.name,
            grade_level: cls.grade_level,
            short: cls.short,
          })
        )
      );
      toast.success("Selected classes created successfully");
      setSelectedClasses([]);
    } catch (err) {
      toast.error("Error creating classes");
    }
  };

  const onSubmit = async (data: ClassFormData) => {
    try {
      await mutateAsync(data);
      toast.success("Class created successfully");
    } catch (err) {
      toast.error("Error creating class");
    }
  };

  useEffect(() => {
    const totalAvailable = defaultClasses.filter(
      (cls) => !existingClasses.includes(cls.grade_level)
    ).length;
    const isAllSelected = selectedClasses.length === totalAvailable;
    const isNoneSelected = selectedClasses.length === 0;

    if (selectAllRef.current) {
      selectAllRef.current.indeterminate = !isAllSelected && !isNoneSelected;
    }
  }, [selectedClasses, existingClasses]);

  if (isLoading) return <p>Loading class setup...</p>;

  const availableClasses = defaultClasses.map((cls) => ({
    ...cls,
    created: existingClasses.includes(cls.grade_level),
  }));

  const existingFetchedClasses = fetchedClasses?.length > 0;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Class Rooms</CardTitle>
            <CardDescription>
              List of all classes currently available in the system.
            </CardDescription>
          </div>

          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button disabled={!existingFetchedClasses}>
                Create New Class
              </Button>
            </DialogTrigger>
            <DialogContent>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <DialogHeader>
                  <DialogTitle>Create a Class</DialogTitle>
                </DialogHeader>

                <Input
                  placeholder="Enter class name"
                  {...register("name", { required: "Name is required" })}
                />
                {errors.name && (
                  <p className="text-sm text-red-500">{errors.name.message}</p>
                )}

                <Input
                  placeholder="Enter grade level (e.g. JSS2A)"
                  {...register("grade_level", {
                    required: "Grade level is required",
                  })}
                />
                {errors.grade_level && (
                  <p className="text-sm text-red-500">
                    {errors.grade_level.message}
                  </p>
                )}

                <Input
                  placeholder="Enter short name (e.g. JSS2)"
                  {...register("short", { required: "Short name is required" })}
                />
                {errors.short && (
                  <p className="text-sm text-red-500">{errors.short.message}</p>
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
      </CardHeader>

      <CardContent>
        {existingFetchedClasses ? (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {fetchedClasses.map((cls: any) => (
              <Card key={cls.id || cls.grade_level}>
                <CardHeader>
                  <CardTitle>{cls.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>
                    <strong>Short Name:</strong> {cls.short}
                  </p>
                  <p>
                    <strong>Grade Level:</strong> {cls.grade_level}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[50px]">
                    <Checkbox
                      ref={selectAllRef}
                      checked={
                        selectedClasses.length ===
                        availableClasses.filter((cls) => !cls.created).length
                      }
                      onCheckedChange={(checked) =>
                        handleSelectAll(checked === true)
                      }
                    />
                  </TableHead>
                  <TableHead>Class Name</TableHead>
                  <TableHead>Short Name</TableHead>
                  <TableHead>Level</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {availableClasses.map((cls) => (
                  <TableRow key={cls.short}>
                    <TableCell>
                      <Checkbox
                        checked={selectedClasses.includes(cls.short)}
                        onCheckedChange={() => toggleSelection(cls.short)}
                        disabled={cls.created}
                      />
                    </TableCell>
                    <TableCell>{cls.name}</TableCell>
                    <TableCell>{cls.short}</TableCell>
                    <TableCell>{cls.grade_level}</TableCell>
                    <TableCell>
                      {cls.created ? (
                        <span className="text-green-600">Created</span>
                      ) : (
                        <span className="text-yellow-600">Not Created</span>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            <div className="flex justify-end mt-4">
              <Button onClick={handleCreateSelected} disabled={isPending}>
                {isPending ? "Creating..." : "Create Selected"}
              </Button>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
