"use client";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import {
  Building,
  Calendar,
  CheckCircle,
  DollarSign,
  Eye,
  MoreHorizontal,
  Pause,
  Users,
  XCircle,
} from "lucide-react";
import React from "react";

const statusConfig = {
  active: {
    label: "Active",
    variant: "default" as const,
    color: "text-success",
  },
  pending: {
    label: "Pending",
    variant: "secondary" as const,
    color: "text-warning",
  },
  suspended: {
    label: "Suspended",
    variant: "destructive" as const,
    color: "text-destructive",
  },
  rejected: {
    label: "Rejected",
    variant: "outline" as const,
    color: "text-muted-foreground",
  },
};

const planConfig = {
  basic: { label: "Basic", color: "text-muted-foreground" },
  premium: { label: "Premium", color: "text-primary" },
  enterprise: { label: "Enterprise", color: "text-warning" },
};

export default function page() {
  const queryClient = useQueryClient();

  const { data: schools = [] } = useQuery({
    queryKey: ["schools"],
    queryFn: async () => {
      const res = await axios.get(`/api/admin/get-all-schools`);
      return res.data.data;
    },
  });

  const handleStatusChange = async (schoolId: string, newStatus: string) => {
    try {
      await axios.patch(`/api/school/update/${schoolId}`, {
        is_active: newStatus === "active",
      });
      queryClient.invalidateQueries({ queryKey: ["schools"] });
    } catch (error) {
      console.error(error);
    }
  };
  return (
    <div>
      <div className="space-y-6">
        {/* Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <Building className="w-8 h-8 text-primary" />
                <div>
                  <p className="text-2xl font-bold">{schools.length}</p>
                  <p className="text-sm text-muted-foreground">Total Schools</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <CheckCircle className="w-8 h-8 text-success" />
                <div>
                  <p className="text-2xl font-bold">
                    {schools.filter((s) => s.status === "active").length}
                  </p>
                  <p className="text-sm text-muted-foreground">Active</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <Users className="w-8 h-8 text-primary" />
                <div>
                  <p className="text-2xl font-bold">
                    {schools
                      .reduce((sum, s) => sum + s.totalUsers, 0)
                      .toLocaleString()}
                  </p>
                  <p className="text-sm text-muted-foreground">Total Users</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <DollarSign className="w-8 h-8 text-success" />
                <div>
                  <p className="text-2xl font-bold">
                    $
                    {schools
                      .reduce((sum, s) => sum + s.totalRevenue, 0)
                      .toLocaleString()}
                  </p>
                  <p className="text-sm text-muted-foreground">Total Revenue</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Schools List */}
        <Card>
          <CardHeader>
            <CardTitle>All Schools</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="space-y-0">
              {schools.map((school) => (
                <div
                  key={school.id}
                  className="flex items-center justify-between p-6 border-b last:border-b-0 hover:bg-accent/50 transition-colors"
                >
                  <div className="flex items-center gap-4 flex-1">
                    <Avatar className="w-12 h-12">
                      <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                        {school.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")
                          .slice(0, 2)}
                      </AvatarFallback>
                    </Avatar>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-1">
                        <h3 className="font-semibold text-foreground truncate">
                          {school.name}
                        </h3>
                        <Badge
                          variant={statusConfig[school.status].variant}
                          className={cn(
                            "text-xs",
                            statusConfig[school.status].color
                          )}
                        >
                          {statusConfig[school.status].label}
                        </Badge>
                      </div>

                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span>{school.email}</span>
                        <span>•</span>
                        <span
                          className={planConfig[school.subscriptionPlan].color}
                        >
                          {planConfig[school.subscriptionPlan].label} Plan
                        </span>
                        <span>•</span>
                        <span>{school.totalUsers} users</span>
                      </div>

                      <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
                        <Calendar className="w-3 h-3" />
                        <span>
                          Joined{" "}
                          {new Date(school.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <p className="font-semibold text-foreground">
                        ${school.totalRevenue.toLocaleString()}
                      </p>
                      <p className="text-xs text-muted-foreground">Revenue</p>
                    </div>

                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>
                          <Eye className="w-4 h-4 mr-2" />
                          View Details
                        </DropdownMenuItem>
                        {school.status === "pending" && (
                          <>
                            <DropdownMenuItem
                              onClick={() =>
                                handleStatusChange(school.id, "active")
                              }
                              className="text-success"
                            >
                              <CheckCircle className="w-4 h-4 mr-2" />
                              Approve
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() =>
                                handleStatusChange(school.id, "rejected")
                              }
                              className="text-destructive"
                            >
                              <XCircle className="w-4 h-4 mr-2" />
                              Reject
                            </DropdownMenuItem>
                          </>
                        )}
                        {school.status === "active" && (
                          <DropdownMenuItem
                            onClick={() =>
                              handleStatusChange(school.id, "suspended")
                            }
                            className="text-warning"
                          >
                            <Pause className="w-4 h-4 mr-2" />
                            Suspend
                          </DropdownMenuItem>
                        )}
                        {school.status === "suspended" && (
                          <DropdownMenuItem
                            onClick={() =>
                              handleStatusChange(school.id, "active")
                            }
                            className="text-success"
                          >
                            <CheckCircle className="w-4 h-4 mr-2" />
                            Reactivate
                          </DropdownMenuItem>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
