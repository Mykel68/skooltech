import { Button } from "@/components/ui/button";
import StatCard from "./StatCard";
import ActivityFeed from "./ActivityCard";
import UpcomingEvents from "./UpcomingEvents";
import { Calendar, FileText, UserCheck, Users } from "lucide-react";
import { useUserStore } from "@/stores/userStore";

const AdminWelcomeDashboard = () => {
  const firstName = useUserStore((s) => s.firstName);
  const schoolName = useUserStore((s) => s.schoolName);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">
        👋 Welcome back, {firstName}! Let&apos;s make things better at{" "}
        {schoolName}.
      </h1>

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

      <div className="flex gap-3">
        <Button>Add Teacher</Button>
        <Button>Add Student</Button>
        <Button variant="outline">Generate Report</Button>
      </div>

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

export default AdminWelcomeDashboard;
