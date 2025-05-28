"use client";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import axios from "axios";
import { useEffect, useState } from "react";
import { useUserStore } from "@/stores/userStore";
import { useRouter } from "next/navigation";

// Validation Schemas
const sessionSchema = z
  .object({
    name: z.string().min(4, "Session name is too short"),
    start_date: z.string().min(1, "Start date is required"),
    end_date: z.string().min(1, "End date is required"),
  })
  .refine((data) => new Date(data.start_date) < new Date(data.end_date), {
    message: "End date must be after start date",
    path: ["end_date"],
  });

const termSchema = z
  .object({
    name: z.string().min(3, "Term name is required"),
    start_date: z.string().min(1, "Start date is required"),
    end_date: z.string().min(1, "End date is required"),
  })
  .refine((data) => new Date(data.start_date) < new Date(data.end_date), {
    message: "End date must be after start date",
    path: ["end_date"],
  });

type SessionData = z.infer<typeof sessionSchema>;
type TermData = z.infer<typeof termSchema>;

export default function SetupSessionAndTerm() {
  const router = useRouter();
  const schoolId = useUserStore((s) => s.schoolId);
  const setUser = useUserStore((s) => s.setUser);
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [session, setSession] = useState<SessionData | null>(null);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const session_id = useUserStore((s) => s.session_id);

  const sessionForm = useForm<SessionData>({
    resolver: zodResolver(sessionSchema),
  });

  const termForm = useForm<TermData>({
    resolver: zodResolver(termSchema),
  });

  const fetchSessions = async () => {
    if (!schoolId) return;
    const res = await axios.get(`/api/session/get-all-session/${schoolId}`);
    if (!res.data?.data) throw new Error("Failed to fetch sessions");
    return res.data.data;
  };

  useEffect(() => {
    if (!schoolId) return;

    fetchSessions()
      .then((data) => {
        const latestSession = data[0]; // assuming the first one is the current session
        setUser({ session_id: latestSession.session_id });
        setSessionId(latestSession.session_id);
        setSession({
          name: latestSession.name,
          start_date: latestSession.start_date,
          end_date: latestSession.end_date,
        });
        setStep(2);
      })
      .catch((err) => console.error("Error fetching sessions:", err));
  }, [schoolId, setUser]);

  // Handle Session Creation
  const handleCreateSession = async () => {
    const valid = await sessionForm.trigger();
    if (!valid) return;

    const values = sessionForm.getValues();
    setLoading(true);
    try {
      const res = await axios.post(`/api/session/create-new/${schoolId}`, {
        name: values.name,
        start_date: values.start_date,
        end_date: values.end_date,
      });

      const id = res.data.data.session_id;
      setUser({ session_id: id });
      console.log("session_id", id);
      setSessionId(id);
      setSession(values);
      setStep(2);
      toast.success("Session created successfully!");
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Error creating session");
    } finally {
      setLoading(false);
    }
  };

  // Handle Term Creation
  const handleCreateTerm = async () => {
    const valid = await termForm.trigger();
    if (!valid || !sessionId || !session) return;

    const values = termForm.getValues();
    const termStart = new Date(values.start_date).setHours(0, 0, 0, 0);
    const termEnd = new Date(values.end_date).setHours(0, 0, 0, 0);
    const sessionStart = new Date(session.start_date).setHours(0, 0, 0, 0);
    const sessionEnd = new Date(session.end_date).setHours(0, 0, 0, 0);

    if (termStart < sessionStart || termEnd > sessionEnd) {
      toast.error("Term dates must fall within the session's dates.");
      return;
    }

    setLoading(true);
    try {
      const res = await axios.post(
        `/api/term/create-new/${schoolId}/${session_id}`,
        {
          name: values.name,
          start_date: values.start_date,
          end_date: values.end_date,
        }
      );
      const id = res.data.data.term_id;
      setUser({ term_id: id });
      router.push(`/classes`);

      toast.success("Term created successfully!");
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Error creating term");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-4">
      {/* Step Indicator */}
      <div className="flex justify-between mb-6">
        <div className="flex items-center gap-2">
          <div
            className={`w-8 h-8 flex items-center justify-center rounded-full font-bold ${
              step >= 1 ? "bg-blue-600 text-white" : "bg-gray-300"
            }`}
          >
            1
          </div>
          <span className={`${step >= 1 ? "text-blue-600" : "text-gray-500"}`}>
            Session
          </span>
        </div>
        <div className="flex items-center gap-2">
          <div
            className={`w-8 h-8 flex items-center justify-center rounded-full font-bold ${
              step >= 2 ? "bg-blue-600 text-white" : "bg-gray-300"
            }`}
          >
            2
          </div>
          <span className={`${step >= 2 ? "text-blue-600" : "text-gray-500"}`}>
            Term
          </span>
        </div>
      </div>

      {/* Step 1 */}
      {step === 1 && (
        <Card>
          <CardHeader>
            <CardTitle>Create Academic Session</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>Session Name</Label>
              <Input
                {...sessionForm.register("name")}
                placeholder="e.g. 2024/2025 Academic Session"
              />
              {sessionForm.formState.errors.name && (
                <p className="text-red-500 text-sm">
                  {sessionForm.formState.errors.name.message}
                </p>
              )}
            </div>
            <div>
              <Label>Start Date</Label>
              <Input type="date" {...sessionForm.register("start_date")} />
              {sessionForm.formState.errors.start_date && (
                <p className="text-red-500 text-sm">
                  {sessionForm.formState.errors.start_date.message}
                </p>
              )}
            </div>
            <div>
              <Label>End Date</Label>
              <Input type="date" {...sessionForm.register("end_date")} />
              {sessionForm.formState.errors.end_date && (
                <p className="text-red-500 text-sm">
                  {sessionForm.formState.errors.end_date.message}
                </p>
              )}
            </div>
            <Button
              onClick={handleCreateSession}
              disabled={loading}
              className="w-full"
            >
              {loading ? "Creating..." : "Create Session"}
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Step 2 */}
      {step === 2 && (
        <Card>
          <CardHeader>
            <CardTitle>Create Term</CardTitle>
            {session && (
              <p className="text-sm text-gray-600">
                Session: {session.name} (
                {new Date(session.start_date).toLocaleDateString()} to{" "}
                {new Date(session.end_date).toLocaleDateString()})
              </p>
            )}
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>Term Name</Label>
              <Input
                {...termForm.register("name")}
                placeholder="e.g. First Term"
              />
              {termForm.formState.errors.name && (
                <p className="text-red-500 text-sm">
                  {termForm.formState.errors.name.message}
                </p>
              )}
            </div>
            <div>
              <Label>Start Date</Label>
              {session ? (
                <Input
                  type="date"
                  {...termForm.register("start_date")}
                  min={new Date(session.start_date).toISOString().split("T")[0]}
                  max={new Date(session.end_date).toISOString().split("T")[0]}
                />
              ) : (
                <Input type="date" disabled />
              )}

              {termForm.formState.errors.start_date && (
                <p className="text-red-500 text-sm">
                  {termForm.formState.errors.start_date.message}
                </p>
              )}
            </div>
            <div>
              <Label>End Date</Label>
              {session ? (
                <Input
                  type="date"
                  {...termForm.register("end_date")}
                  min={new Date(session.start_date).toISOString().split("T")[0]}
                  max={new Date(session.end_date).toISOString().split("T")[0]}
                />
              ) : (
                <Input type="date" disabled />
              )}

              {termForm.formState.errors.end_date && (
                <p className="text-red-500 text-sm">
                  {termForm.formState.errors.end_date.message}
                </p>
              )}
            </div>
            <Button
              onClick={handleCreateTerm}
              disabled={loading}
              className="w-full"
            >
              {loading ? "Creating..." : "Create Term"}
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
