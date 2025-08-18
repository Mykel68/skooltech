"use client";

import { AvatarFallback } from "@/components/ui/avatar";
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
import { Avatar } from "@radix-ui/react-avatar";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import {
  BookOpen,
  Calendar,
  GraduationCap,
  MoreHorizontal,
  Shield,
  UserCheck,
  UsersIcon,
  UserX,
} from "lucide-react";
import React from "react";

const roleConfig = {
  admin: { label: "Admin", icon: Shield, color: "text-destructive" },
  teacher: { label: "Teacher", icon: GraduationCap, color: "text-primary" },
  student: { label: "Student", icon: BookOpen, color: "text-success" },
  parent: { label: "Parent", icon: UsersIcon, color: "text-warning" },
};

const statusConfig = {
  active: { label: "Active", variant: "default" as const },
  inactive: { label: "Inactive", variant: "secondary" as const },
  suspended: { label: "Suspended", variant: "destructive" as const },
};

export default function page() {
  const queryClient = useQueryClient();
  const { data: usersData } = useQuery({
    queryKey: ["users"],
    queryFn: async () => {
      const res = await axios.get(`/api/admin/get-all-users`);
      return res.data.data;
    },
  });

  const handleStatusChange = async (userId: string, newStatus: string) => {
    try {
      await axios.patch(`/api/user/verify-student/${userId}`, {
        is_approved: newStatus === "active",
      });
      queryClient.invalidateQueries({ queryKey: ["users"] });
    } catch (error) {
      console.error(error);
    }
  };

  const users = usersData?.data || [];
  const usersByRole = {
    admin: users.filter((u: any) => u.role === "admin").length,
    teacher: users.filter((u: any) => u.role === "teacher").length,
    student: users.filter((u: any) => u.role === "student").length,
    parent: users.filter((u: any) => u.role === "parent").length,
  };
  return (
    <div>
      <div className="space-y-6">
        {/* Role Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {Object.entries(roleConfig).map(([role, config]) => (
            <Card key={role}>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <config.icon className={cn("w-8 h-8", config.color)} />
                  <div>
                    <p className="text-2xl font-bold">
                      {usersByRole[role as keyof typeof usersByRole]}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {config.label}s
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Users List */}
        <Card>
          <CardHeader>
            <CardTitle>All Users ({users.length})</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="space-y-0">
              {users.map((user) => {
                const roleInfo = roleConfig[user.role];
                return (
                  <div
                    key={user.id}
                    className="flex items-center justify-between p-6 border-b last:border-b-0 hover:bg-accent/50 transition-colors"
                  >
                    <div className="flex items-center gap-4 flex-1">
                      <Avatar className="w-12 h-12">
                        <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                          {user.name
                            .split(" ")
                            .map((n: string) => n[0])
                            .join("")
                            .slice(0, 2)}
                        </AvatarFallback>
                      </Avatar>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-3 mb-1">
                          <h3 className="font-semibold text-foreground truncate">
                            {user.name}
                          </h3>
                          <Badge variant={statusConfig[user.status].variant}>
                            {statusConfig[user.status].label}
                          </Badge>
                        </div>

                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <span>{user.email}</span>
                          <span>•</span>
                          <div className="flex items-center gap-1">
                            <roleInfo.icon className="w-3 h-3" />
                            <span className={roleInfo.color}>
                              {roleInfo.label}
                            </span>
                          </div>
                          <span>•</span>
                          <span>{user.schoolName}</span>
                        </div>

                        <div className="flex items-center gap-4 mt-1 text-xs text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            <span>
                              Joined{" "}
                              {new Date(user.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                          {user.lastLogin && (
                            <>
                              <span>•</span>
                              <span>
                                Last login{" "}
                                {new Date(user.lastLogin).toLocaleDateString()}
                              </span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>

                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>
                          <UsersIcon className="w-4 h-4 mr-2" />
                          View Profile
                        </DropdownMenuItem>
                        {user.status === "active" && (
                          <DropdownMenuItem
                            onClick={() =>
                              handleStatusChange(user.id, "suspended")
                            }
                            className="text-warning"
                          >
                            <UserX className="w-4 h-4 mr-2" />
                            Suspend User
                          </DropdownMenuItem>
                        )}
                        {user.status === "suspended" && (
                          <DropdownMenuItem
                            onClick={() =>
                              handleStatusChange(user.id, "active")
                            }
                            className="text-success"
                          >
                            <UserCheck className="w-4 h-4 mr-2" />
                            Reactivate User
                          </DropdownMenuItem>
                        )}
                        {user.status === "inactive" && (
                          <DropdownMenuItem
                            onClick={() =>
                              handleStatusChange(user.id, "active")
                            }
                            className="text-success"
                          >
                            <UserCheck className="w-4 h-4 mr-2" />
                            Activate User
                          </DropdownMenuItem>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
