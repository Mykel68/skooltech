"use client";

import React, { useEffect, useState } from "react";
import {
  Calendar,
  Clock,
  Plus,
  Edit3,
  Power,
  PowerOff,
  ChevronRight,
  Users,
  BookOpen,
  GraduationCap,
  Sparkles,
  X,
} from "lucide-react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useUserStore } from "@/stores/userStore";
import axios from "axios";
import { toast } from "sonner";
import CreateItemDialog from "./CreateItemDialog";
import { useRouter } from "next/navigation";

interface Session {
  session_id: string;
  name: string;
  start_date: string;
  end_date: string;
  is_active: boolean;
  terms_count?: number;
  students_count?: number;
  terms?: Term[];
}

interface Term {
  term_id: string;
  name: string;
  start_date: string;
  end_date: string;
  is_active: boolean;
}

// Utility function to format dates
const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

type SessionCardProps = {
  session: Session;
  onEditClick: (session: Session) => void;
  toggleActive: (session: Session) => void;
  onViewDetails: (session: Session) => void;
};

const SessionCard: React.FC<SessionCardProps> = ({
  session,
  onEditClick,
  toggleActive,
  onViewDetails,
}) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className={`relative overflow-hidden rounded-xl border-2 transition-all duration-300 cursor-pointer group ${
        session.is_active
          ? "border-emerald-200 bg-gradient-to-br from-emerald-50 to-teal-50 hover:border-emerald-300 shadow-lg shadow-emerald-100/50"
          : "border-slate-200 bg-gradient-to-br from-slate-50 to-gray-50 hover:border-slate-300 shadow-lg shadow-slate-100/50"
      } hover:shadow-xl hover:scale-[1.02]`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => onViewDetails(session)}
    >
      {/* Decorative background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div
          className={`absolute -top-4 -right-4 w-24 h-24 rounded-full opacity-10 ${
            session.is_active ? "bg-emerald-400" : "bg-slate-400"
          }`}
        />
        <div
          className={`absolute -bottom-6 -left-6 w-32 h-32 rounded-full opacity-5 ${
            session.is_active ? "bg-teal-400" : "bg-gray-400"
          }`}
        />
      </div>

      {/* Status indicator */}
      <div className="absolute top-4 right-4">
        <div
          className={`flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold ${
            session.is_active
              ? "bg-emerald-100 text-emerald-700 border border-emerald-200"
              : "bg-slate-100 text-slate-600 border border-slate-200"
          }`}
        >
          <div
            className={`w-2 h-2 rounded-full ${
              session.is_active
                ? "bg-emerald-500 animate-pulse"
                : "bg-slate-400"
            }`}
          />
          {session.is_active ? "Active" : "Inactive"}
        </div>
      </div>

      <div className="relative p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <h3 className="text-xl font-bold text-slate-900 mb-2 group-hover:text-emerald-700 transition-colors">
              {session.name}
            </h3>

            <div className="flex items-center gap-4 text-sm text-slate-600 mb-4">
              <div className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                <span>
                  {formatDate(session.start_date)} -{" "}
                  {formatDate(session.end_date)}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-6 mb-4">
              <div className="flex items-center gap-2 text-sm">
                <BookOpen className="w-4 h-4 text-blue-500" />
                <span className="text-slate-700">
                  {session.terms_count} Terms
                </span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Users className="w-4 h-4 text-purple-500" />
                <span className="text-slate-700">
                  {session.students_count} Students
                </span>
              </div>
            </div>
          </div>

          <ChevronRight
            className={`w-5 h-5 text-slate-400 transition-transform duration-300 ${
              isHovered ? "translate-x-1 text-emerald-500" : ""
            }`}
          />
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button
              onClick={(e) => {
                e.stopPropagation();
                toggleActive(session);
              }}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                session.is_active
                  ? "bg-red-50 text-red-700 hover:bg-red-100 border border-red-200"
                  : "bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200"
              }`}
            >
              {session.is_active ? (
                <>
                  <PowerOff className="w-4 h-4" />
                  Deactivate
                </>
              ) : (
                <>
                  <Power className="w-4 h-4" />
                  Activate
                </>
              )}
            </button>

            <button
              onClick={(e) => {
                e.stopPropagation();
                onEditClick(session);
              }}
              className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 transition-all duration-200"
            >
              <Edit3 className="w-4 h-4" />
              Edit
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const SessionList = ({
  sessions,
  isLoading,
  onEditClick,
  toggleActive,
  onViewDetails,
}: {
  sessions: Session[];
  isLoading: boolean;
  onEditClick: (session: Session) => void;
  toggleActive: (session: Session) => void;
  onViewDetails: (session: Session) => void;
}) => {
  if (isLoading) {
    return (
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {[1, 2, 3].map((i) => (
          <div key={i} className="animate-pulse">
            <div className="bg-slate-200 rounded-xl h-48"></div>
          </div>
        ))}
      </div>
    );
  }

  if (sessions.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <GraduationCap className="w-8 h-8 text-slate-400" />
        </div>
        <h3 className="text-lg font-semibold text-slate-700 mb-2">
          No sessions found
        </h3>
        <p className="text-slate-500">
          Create your first session to get started.
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {sessions.map((session) => (
        <SessionCard
          key={session.session_id}
          session={session}
          onEditClick={onEditClick}
          toggleActive={toggleActive}
          onViewDetails={onViewDetails}
        />
      ))}
    </div>
  );
};

const TermsView = ({
  session,
  onBack,
}: {
  session: Session;
  onBack: () => void;
}) => {
  const router = useRouter();
  const [openCreateTermDialog, setOpenCreateTermDialog] = useState(false);
  const [editingTerm, setEditingTerm] = useState(null);
  const queryClient = useQueryClient();
  const schoolId = useUserStore((s) => s.schoolId);
  const [terms, setTerms] = useState(session.terms || []);

  const updateTermMutation = useMutation({
    mutationFn: async ({ termId, data }: { termId: string; data: Term }) => {
      return axios.patch(
        `/api/term/update/${schoolId}/${session.session_id}/${termId}`,
        data
      );
    },
    onSuccess: () => {
      toast.success("Term updated");
      queryClient.invalidateQueries({
        queryKey: ["sessions", schoolId, session.session_id],
      });
    },
    onError: () => toast.error("Failed to update term"),
  });

  const createTermMutation = useMutation({
    mutationFn: async (data) => {
      return axios.post(
        `/api/term/create-new/${schoolId}/${session.session_id}`,
        data
      );
    },
    onSuccess: () => {
      toast.success("Term created");
      queryClient.invalidateQueries({
        queryKey: ["sessions", schoolId, session.session_id],
      });
    },
    onError: () => toast.error("Failed to create term"),
  });

  const handleCreateTerm = (formData: Term) => {
    if (editingTerm) {
      updateTermMutation.mutate(
        {
          termId: editingTerm?.term_id!,
          data: formData,
        },
        {
          onSuccess: () => {
            toast.success("Term updated");
            setTerms((prev) =>
              prev.map((t) =>
                t.term_id === editingTerm?.term_id! ? { ...t, ...formData } : t
              )
            );
            setEditingTerm(null);
            setOpenCreateTermDialog(false);
          },
          onError: () => toast.error("Failed to update term"),
        }
      );
    } else {
      createTermMutation.mutate(formData, {
        onSuccess: (res) => {
          toast.success("Term created");
          const newTerm = res.data; // or manually assign a temp ID if not returned
          setTerms((prev) => [...prev, newTerm]);
          setOpenCreateTermDialog(false);
        },
        onError: () => toast.error("Failed to create term"),
      });
    }
  };

  const handleToggleActive = (term: Term) => {
    const isActivating = !term.is_active;

    // Optional: prevent deactivating the last active term
    if (!isActivating && terms.filter((t) => t.is_active).length === 1) {
      toast.warning("At least one term must remain active");
      return;
    }

    updateTermMutation.mutate(
      {
        termId: term.term_id,
        data: { is_active: isActivating },
      },
      {
        onSuccess: () => {
          toast.success(`Term ${isActivating ? "activated" : "deactivated"}`);

          // Update frontend state so only one term is active at a time
          setTerms((prev) =>
            prev.map((t) =>
              t.term_id === term.term_id
                ? { ...t, is_active: isActivating }
                : isActivating
                ? { ...t, is_active: false }
                : t
            )
          );
        },
        onError: () => toast.error("Failed to toggle term"),
      }
    );
  };

  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto p-6">
        <div className="mb-8">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-slate-600 hover:text-slate-900 mb-4"
          >
            <ChevronRight className="w-4 h-4 rotate-180" />
            Back to Sessions
          </button>

          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-slate-900 mb-2">
                {session.name}
              </h1>
              <p className="text-slate-600 flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                {formatDate(session.start_date)} -{" "}
                {formatDate(session.end_date)}
              </p>
            </div>
            <button
              onClick={() => setOpenCreateTermDialog(true)}
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white rounded-xl font-medium transition-all shadow-lg shadow-blue-200"
            >
              <Plus className="w-5 h-5" />
              Create New Term
            </button>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {terms.map((term: Term) => (
            <div
              key={term.term_id}
              className={`relative overflow-hidden rounded-xl border-2 transition-all duration-300 ${
                term.is_active
                  ? "border-blue-200 bg-gradient-to-br from-blue-50 to-indigo-50 shadow-lg shadow-blue-100/50"
                  : "border-slate-200 bg-gradient-to-br from-slate-50 to-gray-50 shadow-lg shadow-slate-100/50"
              }`}
            >
              <div className="absolute top-4 right-4">
                <div
                  className={`flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold ${
                    term.is_active
                      ? "bg-blue-100 text-blue-700 border border-blue-200"
                      : "bg-slate-100 text-slate-600 border border-slate-200"
                  }`}
                >
                  <div
                    className={`w-2 h-2 rounded-full ${
                      term.is_active
                        ? "bg-blue-500 animate-pulse"
                        : "bg-slate-400"
                    }`}
                  />
                  {term.is_active ? "Active" : "Inactive"}
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-slate-900 mb-2">
                  {term.name}
                </h3>
                <div className="flex items-center gap-2 text-sm text-slate-600 mb-4">
                  <Calendar className="w-4 h-4" />
                  <span>
                    {formatDate(term.start_date)} - {formatDate(term.end_date)}
                  </span>
                </div>
                <div className="flex items-center gap-2 mt-4">
                  <button
                    onClick={() => {
                      setEditingTerm(term);
                      setOpenCreateTermDialog(true);
                    }}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 transition-all duration-200"
                  >
                    <Edit3 className="w-4 h-4" />
                    Edit
                  </button>
                  <button
                    onClick={() => handleToggleActive(term)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                      term.is_active
                        ? "bg-red-50 text-red-700 hover:bg-red-100 border border-red-200"
                        : "bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-200"
                    }`}
                  >
                    {term.is_active ? (
                      <>
                        <PowerOff className="w-4 h-4" />
                        Deactivate
                      </>
                    ) : (
                      <>
                        <Power className="w-4 h-4" />
                        Activate
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <CreateItemDialog
          open={openCreateTermDialog}
          setOpen={(val) => {
            if (!val) setEditingTerm(null);
            setOpenCreateTermDialog(val);
          }}
          onSubmit={handleCreateTerm}
          initialData={editingTerm}
          title={editingTerm ? "Edit Term" : "Create New Term"}
          submitLabel={editingTerm ? "Update Term" : "Create Term"}
          nameLabel="Term Name"
        />
      </div>
    </div>
  );
};

export default function SessionManagementUI() {
  const [openCreateDialog, setOpenCreateDialog] = useState(false);
  const [editingSession, setEditingSession] = useState<Session | null>(null);
  const [currentView, setCurrentView] = useState<"sessions" | "terms">(
    "sessions"
  );
  const [selectedSession, setSelectedSession] = useState<Session | null>(null);

  const queryClient = useQueryClient();
  const schoolId = useUserStore((s) => s.schoolId);

  const { data: sessions = [], isLoading } = useQuery({
    queryKey: ["sessions", schoolId],
    queryFn: async () => {
      const res = await axios.get(`/api/session/get-all-session/${schoolId}`);
      return res.data.data.sessions;
    },
    enabled: !!schoolId,
  });

  const createMutation = useMutation({
    mutationFn: async (formData: Omit<Session, "session_id" | "is_active">) => {
      const res = await axios.post(
        `/api/session/create-new/${schoolId}`,
        formData
      );
      return res.data;
    },
    onSuccess: () => {
      toast.success("Session created");
      queryClient.invalidateQueries({ queryKey: ["sessions", schoolId] });
      setOpenCreateDialog(false);
    },
    onError: () => toast.error("Failed to create session"),
  });

  const updateMutation = useMutation({
    mutationFn: async ({
      session_id,
      data,
    }: {
      session_id: string;
      data: Partial<Session>;
    }) => {
      return axios.patch(
        `/api/session/activate/${schoolId}/${session_id}`,
        data
      );
    },
    onSuccess: () => {
      toast.success("Session updated");
      queryClient.invalidateQueries({ queryKey: ["sessions", schoolId] });
    },
    onError: () => toast.error("Failed to update session"),
  });

  const toggleActive = (session: Session) => {
    if (!schoolId) return toast.error("School ID missing");
    updateMutation.mutate({
      session_id: session.session_id,
      data: { is_active: !session.is_active },
    });
  };

  const handleCreateSession = (
    formData: Omit<Session, "session_id" | "is_active">
  ) => {
    if (!schoolId) return toast.error("School ID missing");

    if (editingSession) {
      updateMutation.mutate({
        session_id: editingSession.session_id,
        data: formData,
      });
      setEditingSession(null);
      setOpenCreateDialog(false);
    } else {
      createMutation.mutate(formData);
    }
  };

  const handleEditClick = (session: Session) => {
    setEditingSession(session);
    setOpenCreateDialog(true);
  };

  const onViewDetails = (session: Session) => {
    setSelectedSession(session);
    setCurrentView("terms");
  };

  const handleBackToSessions = () => {
    setCurrentView("sessions");
    setSelectedSession(null);
  };

  if (currentView === "terms" && selectedSession) {
    return (
      <TermsView session={selectedSession} onBack={handleBackToSessions} />
    );
  }

  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto p-6">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 mb-2">
              School Sessions
            </h1>
            <p className="text-slate-600">
              Manage your academic sessions and terms
            </p>
          </div>
          <button
            onClick={() => setOpenCreateDialog(true)}
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white rounded-xl font-medium transition-all shadow-lg hover:shadow-xl hover:scale-105"
          >
            <Plus className="w-5 h-5" />
            Create New Session
          </button>
        </div>

        <SessionList
          sessions={sessions}
          isLoading={isLoading}
          onEditClick={handleEditClick}
          toggleActive={toggleActive}
          onViewDetails={onViewDetails}
        />

        <CreateItemDialog
          open={openCreateDialog}
          setOpen={(val) => {
            if (!val) setEditingSession(null);
            setOpenCreateDialog(val);
          }}
          onSubmit={handleCreateSession}
          initialData={editingSession}
          title={editingSession ? "Edit Session" : "Create New Session"}
          submitLabel={editingSession ? "Update Session" : "Create Session"}
          nameLabel="Session Name"
        />
      </div>
    </div>
  );
}
