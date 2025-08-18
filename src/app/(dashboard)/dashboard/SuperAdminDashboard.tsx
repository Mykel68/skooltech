import { StatCard } from "@/components/admin/StatCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import {
  Activity,
  AlertCircle,
  Building,
  DollarSign,
  TrendingUp,
  Users,
} from "lucide-react";
import React from "react";

export default function SuperAdminDashboard() {
  const { data: stats, isLoading } = useQuery({
    queryKey: ["stats"],
    queryFn: () => axios.get("/api/admin/stats").then((res) => res.data.data),
  });
  return (
    <div>
      <div className="space-y-6">
        {/* Key Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            title="Total Schools"
            value={stats?.totalSchools || 0}
            icon={<Building className="w-6 h-6" />}
            trend={{ value: 8.2, isPositive: true }}
          />
          <StatCard
            title="Active Schools"
            value={stats?.activeSchools || 0}
            icon={<Activity className="w-6 h-6" />}
            trend={{ value: 3.1, isPositive: true }}
          />
          <StatCard
            title="Total Users"
            value={stats?.totalUsers?.toLocaleString() || 0}
            icon={<Users className="w-6 h-6" />}
            trend={{ value: 12.5, isPositive: true }}
          />
          <StatCard
            title="Monthly Revenue"
            value={`$${stats?.monthlyRevenue?.toLocaleString() || 0}`}
            icon={<DollarSign className="w-6 h-6" />}
            trend={{ value: 15.3, isPositive: true }}
          />
        </div>

        {/* Charts and Quick Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Revenue Chart */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-primary" />
                Revenue Trend
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64 flex items-center justify-center text-muted-foreground">
                Revenue chart would be implemented here with recharts
              </div>
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="w-5 h-5 text-primary" />
                Recent Activity
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center gap-3 p-3 rounded-lg bg-accent/50">
                  <div className="w-2 h-2 bg-success rounded-full" />
                  <div className="flex-1">
                    <p className="text-sm font-medium">School Approved</p>
                    <p className="text-xs text-muted-foreground">
                      Springfield Elementary - 2 minutes ago
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 rounded-lg bg-accent/50">
                  <div className="w-2 h-2 bg-primary rounded-full" />
                  <div className="flex-1">
                    <p className="text-sm font-medium">New Registration</p>
                    <p className="text-xs text-muted-foreground">
                      Washington High School - 1 hour ago
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 rounded-lg bg-accent/50">
                  <div className="w-2 h-2 bg-warning rounded-full" />
                  <div className="flex-1">
                    <p className="text-sm font-medium">Payment Overdue</p>
                    <p className="text-xs text-muted-foreground">
                      Lincoln Middle School - 3 hours ago
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Pending Approvals */}
        {stats?.pendingApprovals && stats.pendingApprovals > 0 && (
          <Card className="border-warning/20 bg-warning/5">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-warning">
                <AlertCircle className="w-5 h-5" />
                Pending Approvals ({stats.pendingApprovals})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                You have {stats.pendingApprovals} school registration
                {stats.pendingApprovals !== 1 ? "s" : ""} waiting for approval.
              </p>
              <button className="text-sm font-medium text-primary hover:underline">
                Review Pending Schools →
              </button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
