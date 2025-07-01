"use client";

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Search,
  Users,
  GraduationCap,
  Calendar,
  MoreVertical,
  Plus,
  Filter,
  Grid,
  List,
  BookOpen,
  Clock,
} from "lucide-react";
import { getDefaultClasses, useClasses, useCreateClass } from "./useClass";
import { useUserStore } from "@/stores/userStore";
import { CreateClassDialog } from "./createClassDialog";

type Grade = "JSS1" | "JSS2" | "JSS3" | "SS1" | "SS2" | "SS3";

export default function EnhancedClassDisplay() {
  const schoolId = useUserStore((s) => s.schoolId!);
  const sessionId = useUserStore((s) => s.session_id!);
  const termId = useUserStore((s) => s.term_id!);
  const [open, setOpen] = useState(false);

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedGrade, setSelectedGrade] = useState("all");
  const [viewMode, setViewMode] = useState("grid");
  const [sortBy, setSortBy] = useState("name");

  const {
    data: classes = [],
    isLoading,
    refetch,
  } = useClasses(schoolId, sessionId, termId);

  const { mutateAsync } = useCreateClass(schoolId, () => {
    setOpen(false);
  });

  // Filter and sort classes
  const filteredClasses = classes
    .filter(
      (cls) =>
        cls.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        cls.short.toLowerCase().includes(searchTerm.toLowerCase()) ||
        cls.teacher.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .filter(
      (cls) => selectedGrade === "all" || cls.grade_level === selectedGrade
    )
    .sort((a, b) => {
      switch (sortBy) {
        case "name":
          return a.name.localeCompare(b.name);
        case "students":
          return b.student_count - a.student_count;
        case "grade":
          return a.grade_level.localeCompare(b.grade_level);
        default:
          return 0;
      }
    });

  const getGradeLevels = () => {
    const grades = [...new Set(classes.map((cls) => cls.grade_level))];
    return grades.sort();
  };

  const getStatusColor = (status: string) => {
    return status === "active"
      ? "bg-green-100 text-green-800"
      : "bg-gray-100 text-gray-800";
  };

  const getGradeColor = (grade: string): string => {
    const colors: Record<string, string> = {
      JSS1: "bg-blue-100 text-blue-800",
      JSS2: "bg-purple-100 text-purple-800",
      JSS3: "bg-indigo-100 text-indigo-800",
      SS1: "bg-orange-100 text-orange-800",
      SS2: "bg-red-100 text-red-800",
      SS3: "bg-pink-100 text-pink-800",
    };

    return colors[grade] ?? "bg-gray-100 text-gray-800";
  };

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">School Classes</h1>
          <p className="text-gray-600 mt-1">
            Manage and view all classes in your school ({filteredClasses.length}{" "}
            classes)
          </p>
        </div>
        <CreateClassDialog
          open={open}
          setOpen={setOpen}
          mutateAsync={mutateAsync}
        />
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Total Classes
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {classes.length}
                </p>
              </div>
              <BookOpen className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Total Students
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {classes.reduce((sum, cls) => sum + cls.student_count, 0)}
                </p>
              </div>
              <Users className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Active Classes
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {classes.filter((cls) => cls.status === "active").length}
                </p>
              </div>
              <GraduationCap className="w-8 h-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Grade Levels
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {getGradeLevels().length}
                </p>
              </div>
              <Calendar className="w-8 h-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Controls */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col lg:flex-row gap-4 items-center">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search classes, teachers, or IDs..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            <select
              value={selectedGrade}
              onChange={(e) => setSelectedGrade(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Grades</option>
              {getGradeLevels().map((grade) => (
                <option key={grade} value={grade}>
                  {grade}
                </option>
              ))}
            </select>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="name">Sort by Name</option>
              <option value="students">Sort by Students</option>
              <option value="grade">Sort by Grade</option>
            </select>

            <div className="flex bg-gray-100 rounded-lg p-1">
              <Button
                variant={viewMode === "grid" ? "default" : "ghost"}
                size="sm"
                onClick={() => setViewMode("grid")}
              >
                <Grid className="w-4 h-4" />
              </Button>
              <Button
                variant={viewMode === "list" ? "default" : "ghost"}
                size="sm"
                onClick={() => setViewMode("list")}
              >
                <List className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Classes Display */}
      {viewMode === "grid" ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredClasses.map((cls) => (
            <Card
              key={cls.class_id}
              className="hover:shadow-lg transition-all duration-200 border-l-4 border-l-blue-500"
            >
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg font-semibold text-gray-900 mb-1">
                      {cls.name}
                    </CardTitle>
                    <div className="flex items-center gap-2">
                      <Badge className={getGradeColor(cls.grade_level)}>
                        {cls.grade_level}
                      </Badge>
                      <Badge className={getStatusColor(cls.status)}>
                        {cls.status}
                      </Badge>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm">
                    <MoreVertical className="w-4 h-4" />
                  </Button>
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Class Teacher:</span>
                  <span className="font-medium text-gray-900">
                    {cls.teacher}
                  </span>
                </div>

                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Students:</span>
                  <div className="flex items-center gap-1">
                    <Users className="w-4 h-4 text-gray-400" />
                    <span className="font-medium text-gray-900">
                      {cls.student_count}
                    </span>
                  </div>
                </div>

                <div className="pt-2 border-t">
                  <p className="text-xs text-gray-600 mb-2">
                    Subjects ({cls.subjects.length}):
                  </p>
                  <div className="flex flex-wrap gap-1">
                    {cls.subjects.slice(0, 3).map((subject, idx) => (
                      <Badge key={idx} variant="secondary" className="text-xs">
                        {subject}
                      </Badge>
                    ))}
                    {cls.subjects.length > 3 && (
                      <Badge variant="secondary" className="text-xs">
                        +{cls.subjects.length - 3} more
                      </Badge>
                    )}
                  </div>
                </div>

                <div className="flex gap-2 pt-2">
                  <Button size="sm" className="flex-1">
                    View Details
                  </Button>
                  <Button size="sm" variant="outline" className="flex-1">
                    Edit
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="text-left p-4 font-medium text-gray-900">
                      Class
                    </th>
                    <th className="text-left p-4 font-medium text-gray-900">
                      Grade
                    </th>
                    <th className="text-left p-4 font-medium text-gray-900">
                      Teacher
                    </th>
                    <th className="text-left p-4 font-medium text-gray-900">
                      Students
                    </th>

                    <th className="text-left p-4 font-medium text-gray-900">
                      Status
                    </th>
                    <th className="text-left p-4 font-medium text-gray-900">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredClasses.map((cls) => (
                    <tr key={cls.class_id} className="hover:bg-gray-50">
                      <td className="p-4">
                        <div>
                          <p className="font-medium text-gray-900">
                            {cls.name}
                          </p>
                          <p className="text-sm text-gray-600">{cls.short}</p>
                        </div>
                      </td>
                      <td className="p-4">
                        <Badge className={getGradeColor(cls.grade_level)}>
                          {cls.grade_level}
                        </Badge>
                      </td>
                      <td className="p-4 text-gray-900">{cls.teacher}</td>
                      <td className="p-4">
                        <div className="flex items-center gap-1">
                          <Users className="w-4 h-4 text-gray-400" />
                          <span className="text-gray-900">
                            {cls.student_count}
                          </span>
                        </div>
                      </td>

                      <td className="p-4">
                        <Badge className={getStatusColor(cls.status)}>
                          {cls.status}
                        </Badge>
                      </td>
                      <td className="p-4">
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline">
                            View
                          </Button>
                          <Button size="sm" variant="ghost">
                            <MoreVertical className="w-4 h-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}

      {filteredClasses.length === 0 && (
        <Card>
          <CardContent className="p-12 text-center">
            <BookOpen className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No classes found
            </h3>
            <p className="text-gray-600 mb-4">
              No classes match your current search criteria.
            </p>
            <Button
              onClick={() => {
                setSearchTerm("");
                setSelectedGrade("all");
              }}
            >
              Clear Filters
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
