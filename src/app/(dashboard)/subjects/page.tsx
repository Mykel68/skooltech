"use client";

import React, { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Search,
  Filter,
  Plus,
  BookOpen,
  Users,
  CheckCircle,
  Clock,
  MoreVertical,
  Trash2,
  Eye,
  Edit,
  Download,
  Mail,
  GraduationCap,
} from "lucide-react";
import { useUserStore } from "@/stores/userStore";
import { useSubjects } from "./useSubjects";
import {
  Subject,
  SubjectFormData,
  SubjectStats,
  SubjectFormDialogProps,
  SubjectTableRowProps,
} from "./types";

function SubjectFormDialog({
  classes,
  onCreateSubject,
}: SubjectFormDialogProps) {
  const [open, setOpen] = useState<boolean>(false);
  const [formData, setFormData] = useState<SubjectFormData>({
    class_id: "",
    name: "",
    short: "",
  });
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ): Promise<void> => {
    e.preventDefault();
    setIsSubmitting(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));
    onCreateSubject(formData);
    setFormData({ class_id: "", name: "", short: "" });
    setOpen(false);
    setIsSubmitting(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="shadow-md hover:shadow-lg transition-shadow">
          <Plus className="w-4 h-4 mr-2" />
          Create Subject
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <form onSubmit={handleSubmit} className="space-y-5">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold flex items-center gap-2">
              <BookOpen className="w-5 h-5" />
              Create New Subject
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Class</label>
              <Select
                onValueChange={(val: string) =>
                  setFormData((prev) => ({
                    ...prev,
                    class_id: val,
                  }))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select Class" />
                </SelectTrigger>
                <SelectContent>
                  {classes.map((c) => (
                    <SelectItem key={c.class_id} value={c.class_id}>
                      {c.name} ({c.grade_level})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">
                Subject Name
              </label>
              <Input
                placeholder="e.g., Mathematics"
                value={formData.name}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setFormData((prev) => ({
                    ...prev,
                    name: e.target.value,
                  }))
                }
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">
                Short Code
              </label>
              <Input
                placeholder="e.g., MATH"
                value={formData.short}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setFormData((prev) => ({
                    ...prev,
                    short: e.target.value,
                  }))
                }
                required
              />
            </div>
          </div>

          <DialogFooter className="pt-4">
            <Button
              type="button"
              variant="ghost"
              onClick={() => setOpen(false)}
              className="mr-2"
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Creating..." : "Create Subject"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

function SubjectTableRow({
  subject,
  onApprove,
  onDisapprove,
  onDelete,
}: SubjectTableRowProps) {
  const [showActions, setShowActions] = useState<boolean>(false);

  return (
    <TableRow
      className="hover:bg-gray-50 transition-colors"
      onMouseEnter={() => setShowActions(true)}
      onMouseLeave={() => setShowActions(false)}
    >
      <TableCell>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
            <BookOpen className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <p className="font-medium text-gray-900">{subject.name}</p>
            <p className="text-sm text-gray-500">{subject.short}</p>
          </div>
        </div>
      </TableCell>

      <TableCell>
        <div>
          <p className="font-medium text-gray-900">{subject.class.name}</p>
          <Badge variant="secondary" className="mt-1">
            {subject.class.grade_level}
          </Badge>
        </div>
      </TableCell>

      <TableCell>
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
            <GraduationCap className="w-4 h-4 text-green-600" />
          </div>
          <div>
            <p className="font-medium text-gray-900">{subject.teacher.name}</p>
            <p className="text-sm text-gray-500 flex items-center gap-1">
              <Mail className="w-3 h-3" />
              {subject.teacher.email}
            </p>
          </div>
        </div>
      </TableCell>

      <TableCell>
        <div className="flex items-center gap-2">
          <Users className="w-4 h-4 text-gray-400" />
          <span className="text-gray-900">{subject.student_count || 0}</span>
        </div>
      </TableCell>

      <TableCell>
        <div className="flex items-center gap-3">
          <Badge
            className={
              subject.is_approved
                ? "bg-green-100 text-green-800 hover:bg-green-200"
                : "bg-yellow-100 text-yellow-800 hover:bg-yellow-200"
            }
          >
            {subject.is_approved ? (
              <CheckCircle className="w-3 h-3 mr-1" />
            ) : (
              <Clock className="w-3 h-3 mr-1" />
            )}
            {subject.is_approved ? "Approved" : "Pending"}
          </Badge>

          <div
            className={`flex items-center gap-1 transition-opacity ${
              showActions ? "opacity-100" : "opacity-0"
            }`}
          >
            {subject.is_approved ? (
              <Button
                size="sm"
                variant="outline"
                onClick={onDisapprove}
                className="h-7 px-2"
              >
                Disapprove
              </Button>
            ) : (
              <Button size="sm" onClick={onApprove} className="h-7 px-2">
                Approve
              </Button>
            )}

            <Button
              size="sm"
              variant="ghost"
              onClick={onDelete}
              className="h-7 px-2 text-red-500 hover:text-red-700 hover:bg-red-50"
            >
              <Trash2 className="w-3 h-3" />
            </Button>
          </div>
        </div>
      </TableCell>
    </TableRow>
  );
}

export default function EnhancedSubjectsUI() {
  const schoolId = useUserStore((s) => s.schoolId)!;
  const sessionId = useUserStore((s) => s.session_id)!;
  const termId = useUserStore((s) => s.term_id)!;
  const { classes, subjects, loadingSubjects, approve, disapprove, remove } =
    useSubjects(schoolId, sessionId, termId);

  const [searchTerm, setSearchTerm] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<
    "all" | "approved" | "pending"
  >("all");
  const [gradeFilter, setGradeFilter] = useState<string>("all");

  // Filter subjects based on search and filters
  const filteredSubjects = useMemo(() => {
    return subjects.filter((subject: Subject) => {
      const matchesSearch =
        subject.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        subject.teacher.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        subject.class.name.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesStatus =
        statusFilter === "all" ||
        (statusFilter === "approved" && subject.is_approved) ||
        (statusFilter === "pending" && !subject.is_approved);

      const matchesGrade =
        gradeFilter === "all" || subject.class.grade_level === gradeFilter;

      return matchesSearch && matchesStatus && matchesGrade;
    });
  }, [subjects, searchTerm, statusFilter, gradeFilter]);

  // Get unique grade levels
  const gradeLevels: string[] = [
    ...new Set(subjects.map((s: Subject) => s.class.grade_level)),
  ];

  // Calculate stats
  const stats: SubjectStats = {
    total: subjects.length,
    approved: subjects.filter((s: Subject) => s.is_approved).length,
    pending: subjects.filter((s: Subject) => !s.is_approved).length,
    teachers: new Set(subjects.map((s: Subject) => s.teacher.teacher_id)).size,
  };

  const handleCreateSubject = (formData: SubjectFormData): void => {
    const newSubject: Subject = {
      subject_id: Date.now().toString(),
      ...formData,
      is_approved: false,
      class: classes.find((c) => c.class_id === formData.class_id)!,
      teacher: {
        name: "New Teacher",
        username: "new.teacher",
        email: "new.teacher@school.com",
        teacher_id: `t${Date.now()}`,
      },
      created_at: new Date().toISOString().split("T")[0],
      student_count: 0,
    };
    // Note: This would normally update through the useSubjects hook
    console.log("Creating subject:", newSubject);
  };

  const handleApprove = (subjectId: string): void => {
    approve.mutate(subjectId);
  };

  const handleDisapprove = (subjectId: string): void => {
    disapprove.mutate(subjectId);
  };

  const handleDelete = (subjectId: string): void => {
    remove.mutate(subjectId);
  };

  return (
    <div className="space-y-6 min-h-screen">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Subject Management
          </h1>
          <p className="text-gray-600 mt-1">
            Manage subjects, teachers, and approvals ({filteredSubjects.length}{" "}
            subjects)
          </p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="gap-2">
            <Download className="w-4 h-4" />
            Export
          </Button>
          <SubjectFormDialog
            classes={classes}
            onCreateSubject={handleCreateSubject}
          />
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-white shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Total Subjects
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {stats.total}
                </p>
              </div>
              <BookOpen className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Approved</p>
                <p className="text-2xl font-bold text-green-600">
                  {stats.approved}
                </p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Pending</p>
                <p className="text-2xl font-bold text-yellow-600">
                  {stats.pending}
                </p>
              </div>
              <Clock className="w-8 h-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Teachers</p>
                <p className="text-2xl font-bold text-purple-600">
                  {stats.teachers}
                </p>
              </div>
              <Users className="w-8 h-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card className="bg-white shadow-sm">
        <CardContent className="p-6">
          <div className="flex flex-col lg:flex-row gap-4 items-center">
            <div className="relative flex-1 w-full md:w-fit">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search subjects, teachers, or classes..."
                value={searchTerm}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setSearchTerm(e.target.value)
                }
                className="pl-10"
              />
            </div>

            <Select
              value={statusFilter}
              onValueChange={(value: "all" | "approved" | "pending") =>
                setStatusFilter(value)
              }
            >
              <SelectTrigger className="w-40 w-full md:w-fit">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="approved">Approved</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
              </SelectContent>
            </Select>

            <Select value={gradeFilter} onValueChange={setGradeFilter}>
              <SelectTrigger className="w-40 w-full md:w-fit">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Grades</SelectItem>
                {gradeLevels.map((grade: string) => (
                  <SelectItem key={grade} value={grade}>
                    {grade}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Main Content */}
      <Card className="bg-white shadow-sm">
        <CardHeader className="border-b bg-gray-50">
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="w-5 h-5" />
            Subjects Overview
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {filteredSubjects.length > 0 ? (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-gray-50">
                    <TableHead className="font-semibold">Subject</TableHead>
                    <TableHead className="font-semibold">Class</TableHead>
                    <TableHead className="font-semibold">Teacher</TableHead>
                    <TableHead className="font-semibold">Students</TableHead>
                    <TableHead className="font-semibold">
                      Status & Actions
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredSubjects.map((subject: Subject) => (
                    <SubjectTableRow
                      key={subject.subject_id}
                      subject={subject}
                      onApprove={() => handleApprove(subject.subject_id)}
                      onDisapprove={() => handleDisapprove(subject.subject_id)}
                      onDelete={() => handleDelete(subject.subject_id)}
                    />
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="p-12 text-center">
              <BookOpen className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No subjects found
              </h3>
              <p className="text-gray-600 mb-4">
                No subjects match your current search criteria.
              </p>
              <Button
                onClick={() => {
                  setSearchTerm("");
                  setStatusFilter("all");
                  setGradeFilter("all");
                }}
              >
                Clear Filters
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
