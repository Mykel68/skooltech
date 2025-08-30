"use client";

import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Eye, Download } from "lucide-react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useUserStore } from "@/stores/userStore";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Student } from "./page";
import Loading from "@/components/Loading";

// --- Types
type Subject = {
  name: string;
  total: number;
  grade: string;
};

type SchoolInfo = {
  id: string;
  name: string;
  // Add more fields as needed
};

type SchoolClass = {
  id: string;
  name: string;
  grade_level: string;
  class_id: string;
};

type StudentReportsProps = {
  students: Student[];
  studentsLoading: boolean;
  schoolInfo: SchoolInfo | null;
  schoolLoading: boolean;
  handleViewReport: (student: Student) => void;
  generateReportPending: boolean;
  selectedClassId: string | null;
  setSelectedClassId: (id: string) => void;
  classes: SchoolClass[];
  classesLoading: boolean;
};

// --- Component
const StudentReports: React.FC<StudentReportsProps> = ({
  students,
  studentsLoading,
  schoolInfo,
  schoolLoading,
  handleViewReport,
  generateReportPending,
  selectedClassId,
  setSelectedClassId,
  classes,
  classesLoading,
}) => {
  return (
    <div className="grid gap-4">
      {/* Class Selector */}
      <div className="bg-muted p-4 rounded-lg">
        {classesLoading ? (
          <Loading message="Loading classes…" overlay />
        ) : (
          <Select
            value={selectedClassId || undefined}
            onValueChange={(value) => {
              setSelectedClassId(value);
            }}
          >
            <SelectTrigger className="w-fit md:w-[300px]">
              <SelectValue placeholder="Select a class" />
            </SelectTrigger>
            <SelectContent>
              {classes.map((cls) => (
                <SelectItem key={cls.class_id} value={cls.class_id}>
                  {cls.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
      </div>

      {/* Students List */}
      {studentsLoading ? (
        <Loading message="Loading students…" overlay />
      ) : (
        students.map((student) => (
          <Card key={student.id}>
            <CardContent className="p-4 sm:p-6">
              <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
                {/* Left Side */}
                <div className="flex-1">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
                    <div>
                      <h3 className="text-lg font-semibold">{student.name}</h3>
                      <p className="text-gray-600 text-sm">
                        {student.class} | {student.admissionNumber} |{" "}
                        {student.session} - {student.term}
                      </p>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <Badge variant="outline">
                        Position: {student.position}
                        {student.position === 1
                          ? "st"
                          : student.position === 2
                          ? "nd"
                          : student.position === 3
                          ? "rd"
                          : "th"}
                      </Badge>
                      <Badge
                        variant={
                          student.average >= 80
                            ? "default"
                            : student.average >= 65
                            ? "secondary"
                            : "destructive"
                        }
                      >
                        Average: {student.average.toFixed(1)}%
                      </Badge>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
                    {student.subjects.slice(0, 5).map((subject, i) => (
                      <div key={i} className="bg-gray-50 p-3 rounded-lg">
                        <h4 className="font-medium text-xs">{subject.name}</h4>
                        <div className="flex items-center justify-between mt-1">
                          <span className="text-lg font-bold">
                            {subject.total}
                          </span>
                          <Badge
                            variant="outline"
                            className={`text-xs ${
                              subject.grade === "A1"
                                ? "text-green-700"
                                : subject.grade.startsWith("B")
                                ? "text-blue-700"
                                : subject.grade.startsWith("C")
                                ? "text-yellow-700"
                                : subject.grade.startsWith("D")
                                ? "text-orange-700"
                                : subject.grade === "E"
                                ? "text-red-500"
                                : "text-orange-700"
                            }`}
                          >
                            {subject.grade}
                          </Badge>
                        </div>
                      </div>
                    ))}
                    {student.subjects.length > 5 && (
                      <div className="bg-gray-100 p-3 rounded-lg flex items-center justify-center">
                        <span className="text-sm text-gray-600">
                          +{student.subjects.length - 5} more
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Right Side: Action Buttons */}
                <div className="w-full sm:w-auto flex sm:flex-col gap-2">
                  <Button
                    onClick={() => handleViewReport(student)}
                    disabled={generateReportPending}
                    className="flex-1 sm:flex-none flex items-center justify-center gap-2"
                  >
                    <Eye className="w-4 h-4" />
                    {generateReportPending ? "Loading..." : "View Report"}
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1 sm:flex-none flex items-center justify-center gap-2"
                  >
                    <Download className="w-4 h-4" />
                    Download PDF
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))
      )}
    </div>
  );
};

export default StudentReports;
