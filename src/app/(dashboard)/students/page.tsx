"use client";

import React, { useMemo, useState } from "react";
import {
  Search,
  Filter,
  Users,
  UserCheck,
  UserX,
  Download,
  RefreshCw,
  Eye,
  Mail,
  Phone,
} from "lucide-react";

import { useUserStore } from "@/stores/userStore";
import { useQueryClient } from "@tanstack/react-query";
import { useStudents } from "./useStudent";
import axios from "axios";

export default function StudentManagementAdmin() {
  const schoolId = useUserStore((s) => s.schoolId!);
  const sessionId = useUserStore((s) => s.session_id!);
  const termId = useUserStore((s) => s.term_id!);

  const queryClient = useQueryClient();
  const {
    data: students = [],
    isLoading,
    refetch,
  } = useStudents(schoolId, sessionId, termId);

  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterClass, setFilterClass] = useState("all");
  const [selectedStudents, setSelectedStudents] = useState(new Set());
  const [showDetails, setShowDetails] = useState<string | null>(null);

  const uniqueClasses = [...new Set(students.map((s) => s.class))];

  const filteredStudents = useMemo(() => {
    return students.filter((student: any) => {
      const search = searchTerm.toLowerCase();
      const matchesSearch =
        student.first_name.toLowerCase().includes(search) ||
        student.last_name.toLowerCase().includes(search) ||
        student.email.toLowerCase().includes(search) ||
        student.class.toLowerCase().includes(search);

      const matchesStatus =
        filterStatus === "all" ||
        (filterStatus === "approved" && student.is_approved) ||
        (filterStatus === "pending" && !student.is_approved);

      const matchesClass =
        filterClass === "all" || student.class === filterClass;

      return matchesSearch && matchesStatus && matchesClass;
    });
  }, [students, searchTerm, filterStatus, filterClass]);

  const handleToggleApproval = async (userId: string, approve: boolean) => {
    try {
      await axios.patch(`/api/user/verify-student/${userId}`, {
        is_approved: approve,
      });
      queryClient.invalidateQueries({ queryKey: ["students", schoolId] });
    } catch (error) {
      console.error(error);
    }
  };

  const handleBulkAction = async (action: "approve" | "disapprove") => {
    try {
      const ids = Array.from(selectedStudents);
      // a boolean value for is_approved
      const is_approved = action === "approve" ? true : false;
      await axios.patch("/api/user/bulk-update", {
        is_approved,
        user_ids: ids,
      });
      setSelectedStudents(new Set());
      queryClient.invalidateQueries({ queryKey: ["students", schoolId] });
    } catch (error) {
      console.error(error);
    }
  };

  const handleSelectAll = () => {
    if (selectedStudents.size === filteredStudents.length) {
      setSelectedStudents(new Set());
    } else {
      setSelectedStudents(new Set(filteredStudents.map((s) => s.user_id)));
    }
  };

  const handleSelectStudent = (userId: string) => {
    const newSelected = new Set(selectedStudents);
    newSelected.has(userId)
      ? newSelected.delete(userId)
      : newSelected.add(userId);
    setSelectedStudents(newSelected);
  };

  const exportToCSV = () => {
    const headers = [
      "Name",
      "Email",
      "Class",
      "Gender",
      "Status",
      "Enrollment Date",
    ];
    const rows = filteredStudents.map((s) =>
      [
        `${s.first_name} ${s.last_name}`,
        s.email,
        s.class,
        s.gender,
        s.is_approved ? "Approved" : "Pending",
        s.enrollment_date,
      ].join(",")
    );
    const csv = [headers.join(","), ...rows].join("\n");

    const blob = new Blob([csv], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "students.csv";
    a.click();
  };

  const stats = {
    total: students.length,
    approved: students.filter((s) => s.is_approved).length,
    pending: students.filter((s) => !s.is_approved).length,
  };

  return (
    <div className="min-h-screen pt-0">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-slate-900 flex items-center gap-3">
                <Users className="w-8 h-8 text-blue-600" />
                Student Management
              </h1>
              <p className="text-slate-600 mt-1">
                Manage and approve student registrations
              </p>
            </div>
            <button
              onClick={() => window.location.reload()}
              className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <RefreshCw className="w-4 h-4" />
              <span className="hidden md:block">Refresh</span>
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-600 text-sm font-medium">
                  Total Students
                </p>
                <p className="text-3xl font-bold text-slate-900 mt-1">
                  {stats.total}
                </p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-600 text-sm font-medium">Approved</p>
                <p className="text-3xl font-bold text-green-600 mt-1">
                  {stats.approved}
                </p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <UserCheck className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-600 text-sm font-medium">Pending</p>
                <p className="text-3xl font-bold text-orange-600 mt-1">
                  {stats.pending}
                </p>
              </div>
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                <UserX className="w-6 h-6 text-orange-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
            <div className="flex flex-col sm:flex-row gap-4 flex-1">
              {/* Search */}
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search students..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {/* Status Filter */}
              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4 text-slate-400" />
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">All Status</option>
                  <option value="approved">Approved</option>
                  <option value="pending">Pending</option>
                </select>
              </div>

              {/* Class Filter */}
              <select
                value={filterClass}
                onChange={(e) => setFilterClass(e.target.value)}
                className="px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Classes</option>
                {uniqueClasses.map((cls) => (
                  <option key={cls} value={cls}>
                    {cls}
                  </option>
                ))}
              </select>
            </div>

            {/* Actions */}
            <div className="flex gap-3">
              {selectedStudents.size > 0 && (
                <>
                  <button
                    onClick={() => handleBulkAction("approve")}
                    disabled={isLoading}
                    className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
                  >
                    <UserCheck className="w-4 h-4" />
                    Approve ({selectedStudents.size})
                  </button>
                  <button
                    onClick={() => handleBulkAction("disapprove")}
                    disabled={isLoading}
                    className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
                  >
                    <UserX className="w-4 h-4" />
                    Disapprove ({selectedStudents.size})
                  </button>
                </>
              )}
              <button
                onClick={exportToCSV}
                className="flex items-center gap-2 px-4 py-2 bg-slate-600 text-white rounded-lg hover:bg-slate-700 transition-colors"
              >
                <Download className="w-4 h-4" />
                Export
              </button>
            </div>
          </div>
        </div>

        {/* Students Table */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="px-6 py-4 text-left">
                    <input
                      type="checkbox"
                      checked={
                        selectedStudents.size === filteredStudents.length &&
                        filteredStudents.length > 0
                      }
                      onChange={handleSelectAll}
                      className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                    />
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900">
                    Student
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900">
                    Class
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900">
                    Gender
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900">
                    Status
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900">
                    Enrolled
                  </th>
                  <th className="px-6 py-4 text-right text-sm font-semibold text-slate-900">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {filteredStudents.length === 0 ? (
                  <tr>
                    <td
                      colSpan={7}
                      className="px-6 py-12 text-center text-slate-500"
                    >
                      <Users className="w-12 h-12 mx-auto mb-4 text-slate-300" />
                      <p className="text-lg font-medium">No students found</p>
                      <p className="text-sm">
                        Try adjusting your search or filter criteria
                      </p>
                    </td>
                  </tr>
                ) : (
                  filteredStudents.map((student) => (
                    <tr
                      key={student.user_id}
                      className="hover:bg-slate-50 transition-colors"
                    >
                      <td className="px-6 py-4">
                        <input
                          type="checkbox"
                          checked={selectedStudents.has(student.user_id)}
                          onChange={() => handleSelectStudent(student.user_id)}
                          className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                        />
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold">
                            {student.first_name[0]}
                            {student.last_name[0]}
                          </div>
                          <div>
                            <p className="font-semibold text-slate-900">
                              {student.first_name} {student.last_name}
                            </p>
                            <p className="text-sm text-slate-500 flex items-center gap-1">
                              <Mail className="w-3 h-3" />
                              {student.email}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          {student.grade_level}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-600">
                        {student.gender}
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            student.is_approved
                              ? "bg-green-100 text-green-800"
                              : "bg-orange-100 text-orange-800"
                          }`}
                        >
                          {student.is_approved ? "Approved" : "Pending"}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-600">
                        {student.enrollment_date}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() =>
                              setShowDetails(
                                showDetails === student?.user_id!
                                  ? null
                                  : student.user_id
                              )
                            }
                            className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
                            title="View Details"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          {student.is_approved ? (
                            <button
                              onClick={() =>
                                handleToggleApproval(student.user_id, false)
                              }
                              disabled={isLoading}
                              className="px-3 py-1.5 text-xs font-medium text-red-700 bg-red-100 rounded-lg hover:bg-red-200 transition-colors disabled:opacity-50"
                            >
                              Disapprove
                            </button>
                          ) : (
                            <button
                              onClick={() =>
                                handleToggleApproval(student.user_id, true)
                              }
                              disabled={isLoading}
                              className="px-3 py-1.5 text-xs font-medium text-green-700 bg-green-100 rounded-lg hover:bg-green-200 transition-colors disabled:opacity-50"
                            >
                              Approve
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Student Details Expansion */}
          {showDetails && (
            <div className="border-t border-slate-200 bg-slate-50 p-6">
              {(() => {
                const student = students.find((s) => s.user_id === showDetails);
                return student ? (
                  <div className="max-w-2xl">
                    <h3 className="text-lg font-semibold text-slate-900 mb-4">
                      Student Details
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">
                          Full Name
                        </label>
                        <p className="text-sm text-slate-900">
                          {student.first_name} {student.last_name}
                        </p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">
                          Email
                        </label>
                        <p className="text-sm text-slate-900">
                          {student.email}
                        </p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">
                          Phone
                        </label>
                        <p className="text-sm text-slate-900 flex items-center gap-1">
                          <Phone className="w-3 h-3" />
                          {student.phone}
                        </p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">
                          Class
                        </label>
                        <p className="text-sm text-slate-900">
                          {student.class}
                        </p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">
                          Gender
                        </label>
                        <p className="text-sm text-slate-900">
                          {student.gender}
                        </p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">
                          Enrollment Date
                        </label>
                        <p className="text-sm text-slate-900">
                          {student.enrollment_date}
                        </p>
                      </div>
                    </div>
                  </div>
                ) : null;
              })()}
            </div>
          )}
        </div>

        {/* Results Summary */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4">
          <p className="text-sm text-slate-600">
            Showing {filteredStudents.length} of {students.length} students
          </p>
        </div>
      </div>
    </div>
  );
}
