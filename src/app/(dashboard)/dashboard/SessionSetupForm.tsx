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

const sessionSchema = z.object({
  name: z.string().min(4, "Session name is too short"),
  start_date: z.string().min(1, "Start date is required"),
  end_date: z.string().min(1, "End date is required"),
});

type SessionForm = z.infer<typeof sessionSchema>;

const SessionSetupForm = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<SessionForm>({
    resolver: zodResolver(sessionSchema),
  });

  const schoolId = useUserStore((s) => s.schoolId);
  const setUser = useUserStore((state) => state.setUser);

  const createSession = async (sessionData: SessionForm) => {
    const res = await axios.post(
      `/api/session/create-new/${schoolId}`,
      sessionData
    );
    console.log("Response from server: ", res.data);
    return res.data;
  };

  const { mutate, isPending } = useMutation({
    mutationFn: createSession,
    onSuccess: (data) => {
      console.log("Data from here: ", data);
      setUser({ session_id: data.data.session_id });
      toast.success(`School session "${data.data.name}" has been set.`);
      reset();
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Something went wrong");
    },
  });

  const onSubmit = (data: SessionForm) => {
    mutate(data);
  };

  return (
    <Card className="p-6 w-full max-w-md mx-auto mt-10">
      <CardHeader>
        <CardTitle>Setup School Session</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Session Name</Label>
            <Input
              id="name"
              {...register("name")}
              placeholder="e.g. 2024/2025"
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
            {isPending ? "Saving..." : "Save & Continue"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default SessionSetupForm;
