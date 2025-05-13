import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, UserCheck, FileText, Calendar } from "lucide-react";

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
  isSchoolSetupComplete = true,
  schoolName = "Bright Future High School",
}: {
  isSchoolSetupComplete: boolean;
  schoolName?: string;
}) => {
  if (!isSchoolSetupComplete) {
    return (
      <Card className="p-6 text-center">
        <CardTitle>Complete Your Setup</CardTitle>
        <CardContent className="text-muted-foreground">
          Please set up your school session and structure before accessing the
          dashboard.
        </CardContent>
        <div className="mt-4">
          <Button>Go to School Setup</Button>
        </div>
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
