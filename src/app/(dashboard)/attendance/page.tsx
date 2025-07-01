"use client";

import React, { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Users,
  Calendar,
  TrendingUp,
  TrendingDown,
  Search,
  Download,
  Filter,
  BookOpen,
} from "lucide-react";
import { useUserStore } from "@/stores/userStore";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

//
// ========== Types ==========
type SchoolClass = {
  class_id: string;
  name: string;
  teacher: string;
  totalStudents: number;
};

type AttendanceRecord = {
  attendance_id: string;
  studentName: string;
  studentId: string;
  className: string;
  presentDays: number;
  absentDays: number;
  attendancePercentage: number;
};

//
// ========== Component ==========
const AttendancePage: React.FC = () => {
  const [selectedClass, setSelectedClass] = useState<string>("");
  const [totalDays, setTotalDays] = useState<number>(0);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [attendanceFilter, setAttendanceFilter] = useState<string>("");

  const schoolId = useUserStore((s) => s.schoolId);
  const termId = useUserStore((s) => s.term_id);
  const sessionId = useUserStore((s) => s.session_id);

  // ========== Fetchers ==========
  const fetchClasses = async (): Promise<SchoolClass[]> => {
    const res = await axios.get(
      `/api/class/get-all-classs/${schoolId}/${sessionId}/${termId}`
    );
    return res.data.data.classes as SchoolClass[];
  };

  const fetchClassAttendance = async ({
    schoolId,
    sessionId,
    termId,
    classId,
  }: {
    schoolId: string;
    sessionId: string;
    termId: string;
    classId: string;
  }): Promise<AttendanceRecord[]> => {
    if (!classId) throw new Error("Class ID is required");

    const res = await axios.get(
      `/api/attendance/summ/${schoolId}/${classId}/${sessionId}/${termId}`
    );
    setTotalDays(res.data.data.totalDays);
    return res.data.data.attendanceData as AttendanceRecord[];
  };

  // ========== Queries ==========
  const { data: classes = [], isLoading: classesLoading } = useQuery<
    SchoolClass[]
  >({
    queryKey: ["classes", schoolId, sessionId, termId],
    queryFn: fetchClasses,
    enabled: !!schoolId && !!sessionId && !!termId,
  });

  const { data: attendanceRecords = [], isLoading: attendanceLoading } =
    useQuery<AttendanceRecord[]>({
      queryKey: [
        "class-attendance",
        schoolId,
        sessionId,
        termId,
        selectedClass,
      ],
      queryFn: () => {
        if (!schoolId || !sessionId || !termId || !selectedClass) {
          throw new Error("Missing required parameters");
        }
        return fetchClassAttendance({
          schoolId,
          sessionId,
          termId,
          classId: selectedClass,
        });
      },

      enabled: !!schoolId && !!sessionId && !!termId && !!selectedClass,
    });

  // ========== Memoized Stats ==========
  const overallStats = useMemo(() => {
    if (attendanceRecords.length === 0) {
      return {
        avgAttendance: 0,
        totalStudents: 0,
        excellentCount: 0,
        poorCount: 0,
      };
    }

    const totalStudents = attendanceRecords.length;
    const avgAttendance =
      attendanceRecords.reduce(
        (sum, record) => sum + record.attendancePercentage,
        0
      ) / totalStudents;

    const excellentCount = attendanceRecords.filter(
      (r) => r.attendancePercentage >= 95
    ).length;
    const poorCount = attendanceRecords.filter(
      (r) => r.attendancePercentage < 75
    ).length;

    return {
      avgAttendance: Math.round(avgAttendance * 10) / 10,
      totalStudents,
      excellentCount,
      poorCount,
    };
  }, [attendanceRecords]);

  // ========== Helpers ==========
  const getAttendanceBadge = (percentage: number) => {
    if (percentage >= 95) {
      return (
        <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
          Excellent
        </Badge>
      );
    } else if (percentage >= 85) {
      return (
        <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">
          Good
        </Badge>
      );
    } else if (percentage >= 75) {
      return (
        <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">
          Average
        </Badge>
      );
    } else {
      return (
        <Badge className="bg-red-100 text-red-800 hover:bg-red-100">Poor</Badge>
      );
    }
  };

  const getAttendanceColor = (percentage: number) => {
    if (percentage >= 95) return "text-green-600";
    if (percentage >= 85) return "text-blue-600";
    if (percentage >= 75) return "text-yellow-600";
    return "text-red-600";
  };

  const handleExport = () => {
    console.log("Exporting attendance data...", attendanceRecords);
    alert("Export functionality would be implemented here");
  };

  //
  // ========== JSX ==========
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Class Attendance Records
          </h1>
          <p className="text-muted-foreground">
            Monitor student attendance records across all classes
          </p>
        </div>
        <Button onClick={handleExport} className="flex items-center gap-2">
          <Download className="h-4 w-4" />
          Export Report
        </Button>
      </div>

      {/* Statistics Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Students
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {overallStats.totalStudents}
            </div>
            <p className="text-xs text-muted-foreground">For selected class</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Average Attendance
            </CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {overallStats.avgAttendance}%
            </div>
            <p className="text-xs text-muted-foreground">
              Overall class performance
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Excellent Attendance
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {overallStats.excellentCount}
            </div>
            <p className="text-xs text-muted-foreground">
              95%+ attendance rate
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Need Attention
            </CardTitle>
            <TrendingDown className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {overallStats.poorCount}
            </div>
            <p className="text-xs text-muted-foreground">
              Below 75% attendance
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filters
          </CardTitle>
          <CardDescription>
            Filter attendance records by class, performance level, or search for
            specific students
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="space-y-2">
              <label className="text-sm font-medium">Class</label>
              <Select value={selectedClass} onValueChange={setSelectedClass}>
                <SelectTrigger>
                  <SelectValue placeholder="Select class" />
                </SelectTrigger>
                <SelectContent>
                  {classes.map((cls: SchoolClass) => (
                    <SelectItem key={cls.class_id} value={cls.class_id}>
                      {cls.name} - {cls.teacher}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Attendance Level</label>
              <Select
                value={attendanceFilter}
                onValueChange={setAttendanceFilter}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Levels</SelectItem>
                  <SelectItem value="excellent">Excellent (95%+)</SelectItem>
                  <SelectItem value="good">Good (85-94%)</SelectItem>
                  <SelectItem value="average">Average (75-84%)</SelectItem>
                  <SelectItem value="poor">Poor (Below 75%)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Search Student</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by name, ID, or roll number..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Attendance Records Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="h-5 w-5" />
            Student Attendance Records
          </CardTitle>
          <CardDescription>
            <div className="flex items-center justify-between">
              {attendanceRecords.length} students found
              {selectedClass &&
                ` in ${
                  classes.find((c) => c.class_id === selectedClass)?.name ?? ""
                }`}
              <p>Total Days: {totalDays}</p>
            </div>
          </CardDescription>
        </CardHeader>
        <CardContent>
          {attendanceLoading ? (
            <div className="flex items-center justify-center h-32">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Student Name</TableHead>
                    <TableHead>Student ID</TableHead>
                    <TableHead>Class</TableHead>
                    <TableHead>Present</TableHead>
                    <TableHead>Absent</TableHead>
                    <TableHead>Attendance %</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {attendanceRecords.length === 0 ? (
                    <TableRow>
                      <TableCell
                        colSpan={11}
                        className="text-center py-8 text-muted-foreground"
                      >
                        No attendance records found for the selected filters
                      </TableCell>
                    </TableRow>
                  ) : (
                    attendanceRecords.map((record: AttendanceRecord) => (
                      <TableRow key={record.attendance_id}>
                        <TableCell className="font-medium px-3">
                          {record.studentName}
                        </TableCell>
                        <TableCell className="text-muted-foreground">
                          {record.studentId}
                        </TableCell>
                        <TableCell>{record.className}</TableCell>
                        <TableCell className="text-green-600 font-medium text-center">
                          {record.presentDays}
                        </TableCell>
                        <TableCell className="text-red-600 font-medium text-center">
                          {record.absentDays}
                        </TableCell>
                        <TableCell
                          className={`font-bold text-center ${getAttendanceColor(
                            record.attendancePercentage
                          )}`}
                        >
                          {record.attendancePercentage}%
                        </TableCell>
                        <TableCell>
                          {getAttendanceBadge(record.attendancePercentage)}
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AttendancePage;
