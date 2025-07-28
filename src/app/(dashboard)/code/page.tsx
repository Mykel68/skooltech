"use client";
import { useForm } from "react-hook-form";
import { useUserStore } from "@/stores/userStore";
import { toast } from "sonner";
import { useUpdateSchoolProfile } from "@/hooks/useUpdateSchool";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  ArrowLeft,
  School,
  HelpCircle,
  Loader2,
  CheckCircle2,
  ChevronRight,
} from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

export default function Page() {
  const username = useUserStore((state) => state.username);
  const schoolId = useUserStore((state) => state.schoolId!);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors, isValid, isDirty },
    watch,
  } = useForm({
    defaultValues: {
      school_code: "",
    },
  });

  const watchedCode = watch("school_code");
  const mutation = useUpdateSchoolProfile();

  const onSubmit = (data: any) => {
    mutation.mutate(
      { schoolId, data },
      {
        onSuccess: () => {
          toast.success("School code submitted successfully");
          setTimeout(() => {
            router.push("/dashboard");
          }, 1000);
        },
        onError: () => toast.error("Something went wrong. Please try again."),
      }
    );
  };

  return (
    <div className="min-h-[calc(100vh-64px)] flex flex-col items-center justify-center p-4 bg-gradient-to-b from-background to-background/80">
      {/* Decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-64 h-64 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-80 h-80 bg-primary/10 rounded-full blur-3xl" />
      </div>

      <div className="w-full max-w-md">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeIn}
          transition={{ duration: 0.5 }}
        >
          <Card className="border shadow-lg backdrop-blur-sm bg-card/95">
            <CardHeader className="space-y-1">
              <div className="flex items-center justify-between">
                <CardTitle className="text-2xl font-bold">
                  School Registration
                </CardTitle>
                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <School className="h-5 w-5 text-primary" />
                </div>
              </div>
              <CardDescription className="text-base">
                Welcome,{" "}
                <span className="font-medium text-foreground">{username}</span>{" "}
                👋
              </CardDescription>
              <CardDescription>
                Enter your school's unique code to continue setup
              </CardDescription>
            </CardHeader>

            <CardContent>
              <form
                id="school-code-form"
                onSubmit={handleSubmit(onSubmit)}
                className="space-y-4"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label
                      htmlFor="school_code"
                      className="text-sm font-medium"
                    >
                      School Code
                    </Label>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6"
                          >
                            <HelpCircle className="h-4 w-4 text-muted-foreground" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p className="max-w-xs">
                            Your school code was provided by your administrator.
                            If you don't have one, please contact support.
                          </p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>

                  <div className="relative">
                    <Input
                      id="school_code"
                      placeholder="Enter your school code (e.g., ABC123)"
                      className={`pr-10 ${
                        errors.school_code
                          ? "border-destructive focus-visible:ring-destructive"
                          : ""
                      }`}
                      {...register("school_code", {
                        required: "School code is required",
                        minLength: {
                          value: 5,
                          message: "School code must be at least 5 characters",
                        },
                      })}
                    />
                    {watchedCode && !errors.school_code && (
                      <CheckCircle2 className="absolute right-3 top-2.5 h-5 w-5 text-green-500" />
                    )}
                  </div>

                  {errors.school_code && (
                    <motion.p
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      className="text-sm font-medium text-destructive"
                    >
                      {errors.school_code.message as string}
                    </motion.p>
                  )}
                </div>
              </form>
            </CardContent>

            <CardFooter className="flex flex-col gap-4">
              <Button
                type="submit"
                form="school-code-form"
                className="w-full"
                disabled={mutation.isPending || !isDirty || !isValid}
              >
                {mutation.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Verifying...
                  </>
                ) : (
                  <>
                    Continue
                    <ChevronRight className="ml-2 h-4 w-4" />
                  </>
                )}
              </Button>

              <p className="text-xs text-center text-muted-foreground">
                Need help? Contact{" "}
                <a
                  href="mailto:support@schoolsystem.com"
                  className="text-primary hover:underline"
                >
                  support@schoolsystem.com
                </a>
              </p>
            </CardFooter>
          </Card>
        </motion.div>

        {/* Progress indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mt-8 flex justify-center"
        >
          <div className="flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-primary" />
            <div className="h-2 w-8 rounded-full bg-primary" />
            <div className="h-2 w-2 rounded-full bg-muted" />
            <div className="h-2 w-2 rounded-full bg-muted" />
          </div>
        </motion.div>
      </div>
    </div>
  );
}
