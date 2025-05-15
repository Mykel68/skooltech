"use client";

import { useEffect, useRef, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { useUserStore } from "@/stores/userStore";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CreateClassDialog } from "./createClassDialog";
import { ExistingClassCards } from "./existingClassCard";
import { AvailableClassTable } from "./availableClassTable";

const defaultClasses = [
  { name: "Junior Secondary School 1", short: "JSS1", grade_level: "JSS1" },
  { name: "Junior Secondary School 2", short: "JSS2", grade_level: "JSS2" },
  { name: "Junior Secondary School 3", short: "JSS3", grade_level: "JSS3" },
  { name: "Senior Secondary School 1", short: "SS1", grade_level: "SS1" },
  { name: "Senior Secondary School 2", short: "SS2", grade_level: "SS2" },
  { name: "Senior Secondary School 3", short: "SS3", grade_level: "SS3" },
];

export default function ClassSetupPage() {
  const [selectedClasses, setSelectedClasses] = useState<string[]>([]);
  const [existingClasses, setExistingClasses] = useState<string[]>([]);
  const [open, setOpen] = useState(false);
  const selectAllRef = useRef<HTMLInputElement>(null);
  const queryClient = useQueryClient();
  const schoolId = useUserStore((s) => s.schoolId);

  const { data: fetchedClasses, isLoading } = useQuery({
    queryKey: ["classes", schoolId],
    queryFn: async () => {
      const { data } = await axios.get(`/api/class/get-all-classs/${schoolId}`);
      return data.data.classes;
    },
    enabled: !!schoolId,
    onSuccess: (data) => {
      setExistingClasses(data.map((cls: any) => cls.grade_level));
    },
  });

  const { mutateAsync, isPending } = useMutation({
    mutationFn: async (payload: any) => {
      await axios.post(`/api/class/create-new/${schoolId}`, payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["classes", schoolId] });
      setOpen(false);
    },
  });

  const handleCreateSelected = async () => {
    if (!selectedClasses.length) return toast.error("No class selected");
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
    } catch (error) {
      toast.error("Error creating classes");
    }
  };

  const toggleSelection = (short: string) => {
    setSelectedClasses((prev) =>
      prev.includes(short) ? prev.filter((s) => s !== short) : [...prev, short]
    );
  };

  const handleSelectAll = (checked: boolean) => {
    setSelectedClasses(
      checked
        ? defaultClasses
            .filter((cls) => !existingClasses.includes(cls.grade_level))
            .map((cls) => cls.short)
        : []
    );
  };

  const availableClasses = defaultClasses.map((cls) => ({
    ...cls,
    created: existingClasses.includes(cls.grade_level),
  }));

  const existingFetchedClasses = fetchedClasses?.length > 0;

  useEffect(() => {
    const total = defaultClasses.filter(
      (cls) => !existingClasses.includes(cls.grade_level)
    ).length;
    if (selectAllRef.current) {
      selectAllRef.current.indeterminate =
        selectedClasses.length > 0 && selectedClasses.length < total;
    }
  }, [selectedClasses, existingClasses]);

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Class Rooms</CardTitle>
            <CardDescription>List of all classes available.</CardDescription>
          </div>
          <CreateClassDialog
            open={open}
            setOpen={setOpen}
            mutateAsync={mutateAsync}
          />
        </div>
      </CardHeader>

      <CardContent>
        {isLoading ? (
          <p>Loading class setup...</p>
        ) : existingFetchedClasses ? (
          <ExistingClassCards fetchedClasses={fetchedClasses} />
        ) : (
          <AvailableClassTable
            availableClasses={availableClasses}
            selectedClasses={selectedClasses}
            toggleSelection={toggleSelection}
            selectAllRef={selectAllRef}
            handleSelectAll={handleSelectAll}
            handleCreateSelected={handleCreateSelected}
            isPending={isPending}
          />
        )}
      </CardContent>
    </Card>
  );
}
