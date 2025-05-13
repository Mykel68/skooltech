"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Calendar, FileText, UserCheck, Users } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { useUserStore } from "@/stores/userStore"; // Assuming you have this store for user info

// ✅ Zod schema
const sessionSchema = z.object({
  name: z.string().min(4, "Session name is too short"),
  start_date: z.string().min(1, "Start date is required"),
  end_date: z.string().min(1, "End date is required"),
});

type SessionForm = z.infer<typeof sessionSchema>;

const StatCard = ({
  title,
  value,
  icon,
}: {
  title: string;
  value: string;
  icon: React.ReactNode;
}) => (
  <Card className="flex flex-col items-start justify-center p-4 gap-2 w-full">
    <div className="text-muted-foreground text-sm flex items-center gap-2">
      {icon}
      <span>{title}</span>
    </div>
    <div className="text-2xl font-bold">{value}</div>
  </Card>
);

const ActivityFeed = ({ items }: { items: string[] }) => (
  <Card>
    <CardHeader>
      <CardTitle>Recent Activity</CardTitle>
    </CardHeader>
    <CardContent className="space-y-2 text-sm text-muted-foreground">
      {items.map((item, idx) => (
        <div key={idx}>• {item}</div>
      ))}
    </CardContent>
  </Card>
);

const UpcomingEvents = ({
  events,
}: {
  events: { date: string; title: string }[];
}) => (
  <Card>
    <CardHeader>
      <CardTitle>Upcoming Events</CardTitle>
    </CardHeader>
    <CardContent className="space-y-2 text-sm text-muted-foreground">
      {events.map((event, idx) => (
        <div key={idx} className="flex justify-between">
          <span>{event.title}</span>
          <span className="text-xs text-muted-foreground">{event.date}</span>
        </div>
      ))}
    </CardContent>
  </Card>
);

const AdminDashboard = ({
  schoolName = "Bright Future High School",
}: {
  isSchoolSetupComplete: boolean;
  schoolName?: string;
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<SessionForm>({
    resolver: zodResolver(sessionSchema),
  });

  const schoolId = useUserStore((s) => s.schoolId);
  const session_id = useUserStore((s) => s.session_id);

  const isSchoolSetupComplete = !!session_id;

  const createSession = async (sessionData: SessionForm) => {
    const res = await axios.post(
      `/api/session/create-new/${schoolId}`,
      sessionData
    );
    return res.data;
  };

  const { mutate, isPending } = useMutation({
    mutationFn: createSession,
    onSuccess: (data) => {
      toast.success(`School session "${data.name}" has been set.`);
      reset(); // Clear form
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Something went wrong");
    },
  });

  const onSubmit = (data: SessionForm) => {
    mutate(data);
  };

  if (!isSchoolSetupComplete) {
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
                <p className="text-sm text-red-500">
                  {errors.end_date.message}
                </p>
              )}
            </div>
            <Button className="w-full mt-4" type="submit" disabled={isPending}>
              {isPending ? "Saving..." : "Save & Continue"}
            </Button>
          </form>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">
        Welcome back, Admin of {schoolName}!
      </h1>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard
          title="Students"
          value="1,200"
          icon={<Users className="h-4 w-4" />}
        />
        <StatCard
          title="Teachers"
          value="78"
          icon={<UserCheck className="h-4 w-4" />}
        />
        <StatCard
          title="Subjects"
          value="25"
          icon={<FileText className="h-4 w-4" />}
        />
        <StatCard
          title="Classes/Arms"
          value="12"
          icon={<Calendar className="h-4 w-4" />}
        />
        <StatCard
          title="Exams Uploaded"
          value="130+"
          icon={<FileText className="h-4 w-4" />}
        />
        <StatCard
          title="Attendance"
          value="93% This Term"
          icon={<Calendar className="h-4 w-4" />}
        />
      </div>

      {/* Quick Actions */}
      <div className="flex gap-3">
        <Button>Add Teacher</Button>
        <Button>Add Student</Button>
        <Button variant="outline">Generate Report</Button>
      </div>

      {/* Activity Feed & Upcoming Events */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <ActivityFeed
          items={[
            "Last login: May 10, 2025",
            "3 new students added",
            "2 teachers joined this week",
            "You have 5 unread messages",
          ]}
        />
        <UpcomingEvents
          events={[
            { date: "May 20", title: "Math Exams for JS3" },
            { date: "May 30", title: "Term Ends" },
          ]}
        />
      </div>
    </div>
  );
};

export default AdminDashboard;
