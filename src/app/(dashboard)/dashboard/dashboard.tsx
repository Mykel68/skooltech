"use client";
import React, { useState } from "react";
import {
  Users,
  GraduationCap,
  BookOpen,
  DollarSign,
  TrendingUp,
  Calendar,
  Bell,
  Settings,
  Search,
  ChevronDown,
  UserPlus,
  FileText,
  BarChart3,
  Clock,
  AlertTriangle,
  CheckCircle,
  Eye,
  Plus,
  School,
  Award,
  Activity,
} from "lucide-react";
import { useUserStore } from "@/stores/userStore";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";

export default function AdminDashboardPage() {
  const schoolId = useUserStore((s) => s.schoolId);
  const sessionId = useUserStore((s) => s.session_id);
  const termId = useUserStore((s) => s.term_id);

  interface DashboardStats {
    totalStudents: number;
    totalTeachers: number;
    totalClasses: number;
    totalRevenue: number;
    studentGrowth: number;
    teacherGrowth: number;
    classGrowth: number;
    revenueGrowth: number;
  }

  const { data: dashboardStats, isLoading } = useQuery<DashboardStats>({
    queryKey: ["stats", schoolId, sessionId, termId],
    queryFn: async () => {
      const res = await axios.get(
        `/api/dashboard/stats/${schoolId}/${sessionId}/${termId}`
      );
      return res.data.data;
    },
    enabled: !!schoolId && !!sessionId && !!termId,
  });

  const quickStats = [
    {
      title: "Present Today",
      value: "1,156",
      subtitle: "out of 1,247 students",
      icon: Users,
      color: "text-green-600",
      bgColor: "bg-green-50",
      percentage: "92.7%",
    },
    {
      title: "Active Teachers",
      value: "78",
      subtitle: "out of 85 teachers",
      icon: GraduationCap,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
      percentage: "91.8%",
    },
    {
      title: "Fees Collected",
      value: "₦1.8M",
      subtitle: "this month",
      icon: DollarSign,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
      percentage: "76.9%",
    },
    {
      title: "Active Classes",
      value: "38",
      subtitle: "ongoing sessions",
      icon: BookOpen,
      color: "text-orange-600",
      bgColor: "bg-orange-50",
      percentage: "90.5%",
    },
  ];

  const recentActivities = [
    {
      type: "student",
      action: "New student enrolled",
      details: "John Adebayo - JSS 1A",
      time: "2 hours ago",
      icon: UserPlus,
      color: "text-green-600",
    },
    {
      type: "fee",
      action: "Fee payment received",
      details: "Sarah Johnson - ₦45,000",
      time: "3 hours ago",
      icon: DollarSign,
      color: "text-purple-600",
    },
    {
      type: "teacher",
      action: "Teacher submitted report",
      details: "Mrs. Okafor - Mathematics Dept",
      time: "5 hours ago",
      icon: FileText,
      color: "text-blue-600",
    },
    {
      type: "alert",
      action: "Low attendance alert",
      details: "SS2B - Only 68% present",
      time: "6 hours ago",
      icon: AlertTriangle,
      color: "text-red-600",
    },
    {
      type: "system",
      action: "System backup completed",
      details: "All data backed up successfully",
      time: "1 day ago",
      icon: CheckCircle,
      color: "text-green-600",
    },
  ];

  const pendingTasks = [
    {
      task: "Review teacher applications",
      count: 5,
      priority: "high",
      dueDate: "Today",
    },
    {
      task: "Approve student fee waivers",
      count: 12,
      priority: "medium",
      dueDate: "Tomorrow",
    },
    {
      task: "Update curriculum documents",
      count: 3,
      priority: "low",
      dueDate: "This week",
    },
    {
      task: "Schedule parent meetings",
      count: 8,
      priority: "medium",
      dueDate: "Next week",
    },
  ];

  const upcomingEvents = [
    {
      title: "Mid-term Examinations",
      date: "Nov 20-24, 2024",
      type: "exam",
      status: "upcoming",
    },
    {
      title: "Parent-Teacher Conference",
      date: "Nov 30, 2024",
      type: "meeting",
      status: "scheduled",
    },
    {
      title: "Sports Day",
      date: "Dec 5, 2024",
      type: "event",
      status: "planned",
    },
    {
      title: "End of Term Ceremony",
      date: "Dec 15, 2024",
      type: "ceremony",
      status: "upcoming",
    },
  ];

  return (
    <div className="min-h-screen">
      {/* Header */}

      <div className="max-w-7xl mx-auto pt-0">
        {/* Main Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Total Students</p>
                <p className="text-3xl font-bold text-gray-900">
                  {dashboardStats?.totalStudents.toLocaleString()}
                </p>
                <div className="flex items-center mt-2">
                  <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
                  <span className="text-sm text-green-600">
                    +{dashboardStats?.studentGrowth}%
                  </span>
                  <span className="text-sm text-gray-500 ml-1">
                    from last term
                  </span>
                </div>
              </div>
              <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Total Teachers</p>
                <p className="text-3xl font-bold text-gray-900">
                  {dashboardStats?.totalTeachers}
                </p>
                <div className="flex items-center mt-2">
                  <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
                  <span className="text-sm text-green-600">
                    +{dashboardStats?.teacherGrowth}%
                  </span>
                  <span className="text-sm text-gray-500 ml-1">
                    from last term
                  </span>
                </div>
              </div>
              <div className="w-12 h-12 bg-green-50 rounded-lg flex items-center justify-center">
                <GraduationCap className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Total Classes</p>
                <p className="text-3xl font-bold text-gray-900">
                  {dashboardStats?.totalClasses}
                </p>
                <div className="flex items-center mt-2">
                  <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
                  <span className="text-sm text-green-600">
                    +{dashboardStats?.classGrowth}%
                  </span>
                  <span className="text-sm text-gray-500 ml-1">
                    from last term
                  </span>
                </div>
              </div>
              <div className="w-12 h-12 bg-orange-50 rounded-lg flex items-center justify-center">
                <BookOpen className="w-6 h-6 text-orange-600" />
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center justify-between">
              <div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Revenue</p>
                  <p className="text-3xl font-bold text-gray-900">
                    {dashboardStats?.totalRevenue
                      ? `₦${(dashboardStats.totalRevenue / 1_000_000).toFixed(
                          1
                        )}M`
                      : "₦0.0"}
                  </p>
                  <div className="flex items-center mt-2">
                    <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
                    <span className="text-sm text-green-600">
                      +{dashboardStats?.revenueGrowth}%
                    </span>
                    <span className="text-sm text-gray-500 ml-1">
                      from last term
                    </span>
                  </div>
                </div>
              </div>
              <div className="w-12 h-12 bg-purple-50 rounded-lg flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Today's Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {quickStats.map((stat, index) => (
            <div
              key={index}
              className="bg-white p-6 rounded-lg shadow-sm border"
            >
              <div className="flex items-center justify-between mb-4">
                <div
                  className={`w-10 h-10 ${stat.bgColor} rounded-lg flex items-center justify-center`}
                >
                  <stat.icon className={`w-5 h-5 ${stat.color}`} />
                </div>
                <span
                  className={`text-sm font-medium px-2 py-1 rounded-full ${stat.bgColor} ${stat.color}`}
                >
                  {stat.percentage}
                </span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-1">
                {stat.value}
              </h3>
              <p className="text-sm text-gray-600">{stat.title}</p>
              <p className="text-xs text-gray-500 mt-1">{stat.subtitle}</p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Recent Activities */}
          <div className="lg:col-span-2 bg-white rounded-lg shadow-sm border">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-900">
                  Recent Activities
                </h2>
                <button className="text-sm text-blue-600 hover:text-blue-700 flex items-center">
                  <Eye className="w-4 h-4 mr-1" />
                  View All
                </button>
              </div>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {recentActivities.map((activity, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    <div
                      className={`w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0`}
                    >
                      <activity.icon className={`w-4 h-4 ${activity.color}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900">
                        {activity.action}
                      </p>
                      <p className="text-sm text-gray-600">
                        {activity.details}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        {activity.time}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Pending Tasks */}
          <div className="bg-white rounded-lg shadow-sm border">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">
                Pending Tasks
              </h2>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {pendingTasks.map((task, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50"
                  >
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">
                        {task.task}
                      </p>
                      <div className="flex items-center mt-1">
                        <span
                          className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                            task.priority === "high"
                              ? "bg-red-100 text-red-800"
                              : task.priority === "medium"
                              ? "bg-yellow-100 text-yellow-800"
                              : "bg-green-100 text-green-800"
                          }`}
                        >
                          {task.priority}
                        </span>
                        <span className="text-xs text-gray-500 ml-2">
                          {task.dueDate}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-medium text-gray-900 bg-gray-100 px-2 py-1 rounded-full">
                        {task.count}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Upcoming Events */}
          <div className="bg-white rounded-lg shadow-sm border">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-900">
                  Upcoming Events
                </h2>
                <button className="text-sm text-blue-600 hover:text-blue-700 flex items-center">
                  <Plus className="w-4 h-4 mr-1" />
                  Add Event
                </button>
              </div>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {upcomingEvents.map((event, index) => (
                  <div
                    key={index}
                    className="flex items-center space-x-4 p-3 border border-gray-200 rounded-lg"
                  >
                    <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
                      <Calendar className="w-5 h-5 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">
                        {event.title}
                      </p>
                      <p className="text-sm text-gray-600">{event.date}</p>
                    </div>
                    <span
                      className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                        event.status === "upcoming"
                          ? "bg-orange-100 text-orange-800"
                          : event.status === "scheduled"
                          ? "bg-blue-100 text-blue-800"
                          : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {event.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-lg shadow-sm border">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">
                Quick Actions
              </h2>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-2 gap-4">
                <button className="flex flex-col items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                  <UserPlus className="w-8 h-8 text-blue-600 mb-2" />
                  <span className="text-sm font-medium text-gray-900">
                    Add Student
                  </span>
                </button>
                <button className="flex flex-col items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                  <GraduationCap className="w-8 h-8 text-green-600 mb-2" />
                  <span className="text-sm font-medium text-gray-900">
                    Add Teacher
                  </span>
                </button>
                <button className="flex flex-col items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                  <BookOpen className="w-8 h-8 text-orange-600 mb-2" />
                  <span className="text-sm font-medium text-gray-900">
                    Create Class
                  </span>
                </button>
                <button className="flex flex-col items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                  <BarChart3 className="w-8 h-8 text-purple-600 mb-2" />
                  <span className="text-sm font-medium text-gray-900">
                    View Reports
                  </span>
                </button>
                <button className="flex flex-col items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                  <DollarSign className="w-8 h-8 text-green-600 mb-2" />
                  <span className="text-sm font-medium text-gray-900">
                    Fee Management
                  </span>
                </button>
                <button className="flex flex-col items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                  <Calendar className="w-8 h-8 text-blue-600 mb-2" />
                  <span className="text-sm font-medium text-gray-900">
                    Timetable
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
