"use client";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import axios from "axios";
import { useEffect, useState } from "react";
import { useUserStore } from "@/stores/userStore";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Calendar,
  CheckCircle,
  ChevronRight,
  Clock,
  School,
  CalendarDays,
  ArrowRight,
} from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

// Validation Schemas
const sessionSchema = z
  .object({
    name: z.string().min(4, "Session name must be at least 4 characters"),
    start_date: z.string().min(1, "Start date is required"),
    end_date: z.string().min(1, "End date is required"),
  })
  .refine((data) => new Date(data.start_date) < new Date(data.end_date), {
    message: "End date must be after start date",
    path: ["end_date"],
  });

const termSchema = z
  .object({
    name: z.string().min(3, "Term name must be at least 3 characters"),
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
  const [initialLoading, setInitialLoading] = useState(true);

  const sessionForm = useForm<SessionData>({
    resolver: zodResolver(sessionSchema),
    defaultValues: {
      name: "",
      start_date: "",
      end_date: "",
    },
  });

  const termForm = useForm<TermData>({
    resolver: zodResolver(termSchema),
    defaultValues: {
      name: "",
      start_date: "",
      end_date: "",
    },
  });

  const fetchSessions = async () => {
    if (!schoolId) return;
    try {
      const res = await axios.get(`/api/session/get-all-session/${schoolId}`);
      if (!res.data?.data) throw new Error("Failed to fetch sessions");
      return res.data.data;
    } catch (error) {
      console.error("Error fetching sessions:", error);
      return null;
    }
  };

  useEffect(() => {
    if (!schoolId) {
      setInitialLoading(false);
      return;
    }

    fetchSessions()
      .then((data) => {
        if (data && data.length > 0) {
          const latestSession = data[0]; // assuming the first one is the current session
          setUser({ session_id: latestSession.session_id });
          setSessionId(latestSession.session_id);
          setSession({
            name: latestSession.name,
            start_date: latestSession.start_date,
            end_date: latestSession.end_date,
          });
          setStep(2);
        }
      })
      .catch((err) => console.error("Error fetching sessions:", err))
      .finally(() => setInitialLoading(false));
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
      setSessionId(id);
      setSession(values);

      toast.success("Academic session created successfully!");

      // Delay to show success state before moving to next step
      setTimeout(() => {
        setStep(2);
      }, 800);
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
      toast.error("Term dates must fall within the session's dates");
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

      toast.success("Term created successfully! Redirecting to classes...");

      // Delay to show success state before redirecting
      setTimeout(() => {
        router.refresh();
        router.push(`/classes`);
      }, 1000);
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Error creating term");
    } finally {
      setLoading(false);
    }
  };

  if (initialLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex flex-col items-center gap-2">
          <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
          <p className="text-sm text-muted-foreground">
            Loading school data...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-background/80 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold tracking-tight">Academic Setup</h1>
          <p className="text-muted-foreground mt-2">
            Configure your school's academic calendar
          </p>
        </div>

        {/* Step Indicator */}
        <div className="mb-10">
          <div className="flex items-center justify-center">
            <div className="flex items-center">
              <div
                className={cn(
                  "w-10 h-10 rounded-full flex items-center justify-center transition-colors",
                  step >= 1
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground"
                )}
              >
                <School className="h-5 w-5" />
              </div>
              <div
                className={cn(
                  "h-1 w-16 sm:w-24 transition-colors",
                  step >= 2 ? "bg-primary" : "bg-muted"
                )}
              />
              <div
                className={cn(
                  "w-10 h-10 rounded-full flex items-center justify-center transition-colors",
                  step >= 2
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground"
                )}
              >
                <CalendarDays className="h-5 w-5" />
              </div>
            </div>
          </div>
          <div className="flex justify-center mt-2">
            <div className="flex items-center gap-16 sm:gap-24 text-sm">
              <span
                className={
                  step >= 1
                    ? "text-primary font-medium"
                    : "text-muted-foreground"
                }
              >
                Session
              </span>
              <span
                className={
                  step >= 2
                    ? "text-primary font-medium"
                    : "text-muted-foreground"
                }
              >
                Term
              </span>
            </div>
          </div>
        </div>

        <AnimatePresence mode="wait">
          {/* Step 1: Session Creation */}
          {step === 1 && (
            <motion.div
              key="session-step"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <Card className="border shadow-lg">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-2xl">
                        Create Academic Session
                      </CardTitle>
                      <CardDescription>
                        Define the overall academic year
                      </CardDescription>
                    </div>
                    <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                      <Calendar className="h-6 w-6 text-primary" />
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="session-name">Session Name</Label>
                    <Input
                      id="session-name"
                      {...sessionForm.register("name")}
                      placeholder="e.g. 2024/2025 Academic Session"
                      className={cn(
                        sessionForm.formState.errors.name &&
                          "border-destructive focus-visible:ring-destructive"
                      )}
                    />
                    {sessionForm.formState.errors.name && (
                      <motion.p
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        className="text-sm font-medium text-destructive mt-1"
                      >
                        {sessionForm.formState.errors.name.message}
                      </motion.p>
                    )}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="session-start">Start Date</Label>
                      <div className="relative">
                        <Input
                          id="session-start"
                          type="date"
                          {...sessionForm.register("start_date")}
                          className={cn(
                            "pl-10",
                            sessionForm.formState.errors.start_date &&
                              "border-destructive focus-visible:ring-destructive"
                          )}
                        />
                        <Calendar className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
                      </div>
                      {sessionForm.formState.errors.start_date && (
                        <motion.p
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          className="text-sm font-medium text-destructive mt-1"
                        >
                          {sessionForm.formState.errors.start_date.message}
                        </motion.p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="session-end">End Date</Label>
                      <div className="relative">
                        <Input
                          id="session-end"
                          type="date"
                          {...sessionForm.register("end_date")}
                          className={cn(
                            "pl-10",
                            sessionForm.formState.errors.end_date &&
                              "border-destructive focus-visible:ring-destructive"
                          )}
                        />
                        <Calendar className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
                      </div>
                      {sessionForm.formState.errors.end_date && (
                        <motion.p
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          className="text-sm font-medium text-destructive mt-1"
                        >
                          {sessionForm.formState.errors.end_date.message}
                        </motion.p>
                      )}
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button
                    onClick={handleCreateSession}
                    disabled={loading}
                    className="w-full"
                    size="lg"
                  >
                    {loading ? (
                      <>
                        <div className="animate-spin h-4 w-4 border-2 border-current border-t-transparent rounded-full mr-2"></div>
                        Creating Session...
                      </>
                    ) : (
                      <>
                        Continue to Term Setup
                        <ChevronRight className="ml-2 h-4 w-4" />
                      </>
                    )}
                  </Button>
                </CardFooter>
              </Card>
            </motion.div>
          )}

          {/* Step 2: Term Creation */}
          {step === 2 && (
            <motion.div
              key="term-step"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <Card className="border shadow-lg">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-2xl">Create Term</CardTitle>
                      <CardDescription>
                        Define a term within your academic session
                      </CardDescription>
                    </div>
                    <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                      <Clock className="h-6 w-6 text-primary" />
                    </div>
                  </div>
                </CardHeader>

                {session && (
                  <div className="px-6 py-3 bg-muted/50 border-y">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-primary" />
                      <span className="text-sm font-medium">
                        Current Session:
                      </span>
                      <span className="text-sm">{session.name}</span>
                    </div>
                    <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
                      <Calendar className="h-3 w-3" />
                      <span>
                        {format(new Date(session.start_date), "MMM d, yyyy")} -{" "}
                        {format(new Date(session.end_date), "MMM d, yyyy")}
                      </span>
                    </div>
                  </div>
                )}

                <CardContent className="space-y-6 pt-6">
                  <div className="space-y-2">
                    <Label htmlFor="term-name">Term Name</Label>
                    <Input
                      id="term-name"
                      {...termForm.register("name")}
                      placeholder="e.g. First Term"
                      className={cn(
                        termForm.formState.errors.name &&
                          "border-destructive focus-visible:ring-destructive"
                      )}
                    />
                    {termForm.formState.errors.name && (
                      <motion.p
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        className="text-sm font-medium text-destructive mt-1"
                      >
                        {termForm.formState.errors.name.message}
                      </motion.p>
                    )}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="term-start">Start Date</Label>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <div className="relative">
                              <Input
                                id="term-start"
                                type="date"
                                {...termForm.register("start_date")}
                                min={
                                  session
                                    ? new Date(session.start_date)
                                        .toISOString()
                                        .split("T")[0]
                                    : undefined
                                }
                                max={
                                  session
                                    ? new Date(session.end_date)
                                        .toISOString()
                                        .split("T")[0]
                                    : undefined
                                }
                                className={cn(
                                  "pl-10",
                                  termForm.formState.errors.start_date &&
                                    "border-destructive focus-visible:ring-destructive"
                                )}
                              />
                              <Calendar className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
                            </div>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Must be within session dates</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                      {termForm.formState.errors.start_date && (
                        <motion.p
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          className="text-sm font-medium text-destructive mt-1"
                        >
                          {termForm.formState.errors.start_date.message}
                        </motion.p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="term-end">End Date</Label>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <div className="relative">
                              <Input
                                id="term-end"
                                type="date"
                                {...termForm.register("end_date")}
                                min={
                                  session
                                    ? new Date(session.start_date)
                                        .toISOString()
                                        .split("T")[0]
                                    : undefined
                                }
                                max={
                                  session
                                    ? new Date(session.end_date)
                                        .toISOString()
                                        .split("T")[0]
                                    : undefined
                                }
                                className={cn(
                                  "pl-10",
                                  termForm.formState.errors.end_date &&
                                    "border-destructive focus-visible:ring-destructive"
                                )}
                              />
                              <Calendar className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
                            </div>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Must be within session dates</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                      {termForm.formState.errors.end_date && (
                        <motion.p
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          className="text-sm font-medium text-destructive mt-1"
                        >
                          {termForm.formState.errors.end_date.message}
                        </motion.p>
                      )}
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex flex-col gap-4">
                  <Button
                    onClick={handleCreateTerm}
                    disabled={loading}
                    className="w-full"
                    size="lg"
                  >
                    {loading ? (
                      <>
                        <div className="animate-spin h-4 w-4 border-2 border-current border-t-transparent rounded-full mr-2"></div>
                        Creating Term...
                      </>
                    ) : (
                      <>
                        Complete Setup
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </>
                    )}
                  </Button>

                  <p className="text-xs text-center text-muted-foreground">
                    You'll be redirected to set up classes after creating a term
                  </p>
                </CardFooter>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
