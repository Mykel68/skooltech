"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { FormField } from "@/components/FormField";
import { useUserStore } from "@/stores/userStore";
import { toast } from "sonner";
import { useUpdateSchoolProfile } from "@/hooks/useUpdateSchool";
import { useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";

export default function Page() {
  const username = useUserStore((state) => state.username);
  const schoolId = useUserStore((state) => state.schoolId!);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const mutation = useUpdateSchoolProfile();

  const onSubmit = (data: any) => {
    mutation.mutate(
      { schoolId, data },
      {
        onSuccess: () => {
          toast.success("School code submitted successfully");
          router.push("/dashboard");
        },
        onError: () => toast.error("Something went wrong. Please try again."),
      }
    );
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 p-4">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader>
          <CardTitle>Welcome, {username} 👋</CardTitle>
          <CardDescription>
            Register your school&apos;s unique code to manage your school in the
            system.
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col gap-4"
          >
            <FormField
              id="code"
              label="School Code"
              register={register("school_code", {
                required: "Code is required",
              })}
              error={errors.school_code}
            />

            <button
              type="submit"
              className="w-full px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition disabled:opacity-50"
              disabled={mutation.isPending}
            >
              {mutation.isPending ? "Submitting..." : "Submit"}
            </button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
