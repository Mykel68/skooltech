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

type SchoolClass = {
  id: string;
  name: string;
  created_at: string;
};

async function fetchClasses(): Promise<SchoolClass[]> {
  const { data } = await axios.get("/api/classes");
  return data.classes;
}

async function createClass(name: string): Promise<void> {
  await axios.post("/api/classes", { name });
}

export default function ClassTable() {
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  const [className, setClassName] = useState("");

  const { data: classes, isLoading } = useQuery<SchoolClass[]>({
    queryKey: ["classes"],
    queryFn: fetchClasses,
  });

  const { mutate, isPending } = useMutation({
    mutationFn: createClass,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["classes"] });
      setClassName("");
      setOpen(false);
    },
  });

  return (
    <div className="w-full mx-auto p-4 space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold">Classes</h2>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button>Create New Class</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create a Class</DialogTitle>
            </DialogHeader>
            <Input
              placeholder="Enter class name"
              value={className}
              onChange={(e) => setClassName(e.target.value)}
            />
            <DialogFooter>
              <Button variant="ghost" onClick={() => setOpen(false)}>
                Cancel
              </Button>
              <Button
                disabled={!className || isPending}
                onClick={() => mutate(className)}
              >
                {isPending ? "Creating..." : "Create"}
              </Button>
            </DialogFooter>
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
              <TableHead>Created At</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {classes.map((cls) => (
              <TableRow key={cls.id}>
                <TableCell>{cls.name}</TableCell>
                <TableCell>
                  {new Date(cls.created_at).toLocaleDateString()}
                </TableCell>
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
