"use client";

import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

type Session = {
  session_id: string;
  name: string;
  start_date: string;
  end_date: string;
  is_active: boolean;
};

type Props = {
  session: Session;
  onEditClick: (session: Session) => void;
  toggleActive: (session: Session) => void;
};

export function SessionCard({ session, onEditClick, toggleActive }: Props) {
  const router = useRouter();
  return (
    <li
      className="border p-4 rounded-2xl shadow-sm cursor-pointer"
      onClick={() => router.push(`/sessions/${session.session_id}`)}
    >
      <div className="flex justify-between items-center">
        <div>
          <p className="font-semibold text-lg">{session.name}</p>
          <p className="text-sm text-muted-foreground">
            {format(new Date(session.start_date), "MMM dd, yyyy")} -{" "}
            {format(new Date(session.end_date), "MMM dd, yyyy")}
          </p>
          <p className="text-sm mt-1 flex items-center gap-2">
            <span
              className={`h-2 w-2 rounded-full ${
                session.is_active ? "bg-green-500" : "bg-red-500"
              }`}
            ></span>
            {session.is_active ? "Active" : "Inactive"}
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => toggleActive(session)}>
            {session.is_active ? "Deactivate" : "Activate"}
          </Button>
          <Button onClick={() => onEditClick(session)}>Edit</Button>
        </div>
      </div>
    </li>
  );
}
