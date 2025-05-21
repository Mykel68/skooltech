"use client";

import { Session } from "@/app/(dashboard)/sessions/page";
import { SessionCard } from "./SessionCard";
import { UseFormReturn } from "react-hook-form";

interface Props {
  sessions: Session[];
  isLoading: boolean;
  setEditSession: (s: Session) => void;
  editForm: UseFormReturn<any>;
  openEditDialog: boolean;
  setOpenEditDialog: (b: boolean) => void;
  updateMutation: any;
  toggleActive: (s: Session) => void;
}

export const SessionList = ({
  sessions,
  isLoading,
  setEditSession,
  editForm,
  openEditDialog,
  setOpenEditDialog,
  updateMutation,
  toggleActive,
}: Props) => {
  if (isLoading) return <p>Loading...</p>;

  return (
    <ul className="space-y-4">
      {sessions.map((session) => (
        <SessionCard
          key={session.session_id}
          session={session}
          setEditSession={setEditSession}
          editForm={editForm}
          openEditDialog={openEditDialog}
          setOpenEditDialog={setOpenEditDialog}
          updateMutation={updateMutation}
          toggleActive={toggleActive}
        />
      ))}
    </ul>
  );
};
