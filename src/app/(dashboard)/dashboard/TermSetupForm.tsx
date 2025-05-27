"use client";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { useUserStore } from "@/stores/userStore";

const termSchema = z.object({
  name: z.string().min(2, "Term name is too short"), // e.g., First Term
  start_date: z.string().min(1, "Start date is required"),
  end_date: z.string().min(1, "End date is required"),
});

type TermForm = z.infer<typeof termSchema>;

const TermSetupForm = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<TermForm>({
    resolver: zodResolver(termSchema),
  });

  const schoolId = useUserStore((s) => s.schoolId);
  const sessionId = useUserStore((s) => s.session_id); // To associate the term with a session

  const createTerm = async (termData: TermForm) => {
    const res = await axios.post(`/api/term/create-new/${schoolId}`, {
      ...termData,
      session_id: sessionId,
    });
    return res.data;
  };

  const { mutate, isPending } = useMutation({
    mutationFn: createTerm,
    onSuccess: (data) => {
      toast.success(`Term "${data.data.name}" has been created.`);
      reset();
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Something went wrong");
    },
  });

  const onSubmit = (data: TermForm) => {
    mutate(data);
  };

  return (
    <Card className="p-6 w-full max-w-md mx-auto mt-10">
      <CardHeader>
        <CardTitle>Setup Term</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Term Name</Label>
            <Input
              id="name"
              {...register("name")}
              placeholder="e.g. First Term"
            />
            {errors.name && (
              <p className="text-sm text-red-500">{errors.name.message}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="start_date">Start Date</Label>
            <Input id="start_date" type="date" {...register("start_date")} />
            {errors.start_date && (
              <p className="text-sm text-red-500">
                {errors.start_date.message}
              </p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="end_date">End Date</Label>
            <Input id="end_date" type="date" {...register("end_date")} />
            {errors.end_date && (
              <p className="text-sm text-red-500">{errors.end_date.message}</p>
            )}
          </div>
          <Button className="w-full mt-4" type="submit" disabled={isPending}>
            {isPending ? "Saving..." : "Save Term"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default TermSetupForm;
