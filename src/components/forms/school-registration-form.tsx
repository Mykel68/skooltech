"use client";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { FormField } from "@/components/FormField";
import { ImageUpload } from "@/components/ImageUpload";
import { PasswordField } from "@/components/PasswordField";
import { schoolRegistrationFormSchema } from "@/schema/schoolRegistrationSchema";
import { SchoolFormData } from "@/types/school";
import { registerSchool } from "@/services/httpClient";
import { useRouter } from "next/navigation";

export default function SchoolRegistrationPage() {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<SchoolFormData>({
    resolver: zodResolver(schoolRegistrationFormSchema),
    defaultValues: {
      name: "",
      admin_username: "",
      admin_password: "",
      admin_email: "",
      admin_first_name: "",
      admin_last_name: "",
      phone_number: "",
      school_image: undefined,
      admin_gender: "male",
    },
  });

  const mutation = useMutation({
    mutationFn: registerSchool,
    onSuccess: () => {
      toast.success("School registered successfully!");
      router.push("/login");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Registration failed. Please try again.");
    },
  });

  const onSubmit = (data: SchoolFormData) => {
    mutation.mutate(data);
  };

  return (
    <div className="max-w-4xl mx-auto py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold">Register Your School</h1>
        <p className="text-muted-foreground">
          Create your school profile and administrator account
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* School Information */}
          <div className="space-y-4">
            <h2 className="text-lg font-semibold">School Information</h2>
            <div className="grid grid-cols-1 gap-4">
              <FormField
                id="name"
                label="School Name"
                placeholder="School name"
                register={register("name")}
                error={errors.name}
              />
              <FormField
                id="phone_number"
                label="Phone Number"
                placeholder="Phone number"
                register={register("phone_number")}
                error={errors.phone_number}
              />
              <FormField
                id="admin_email"
                label="Email Address"
                type="email"
                placeholder="Email address"
                register={register("admin_email")}
                error={errors.admin_email}
              />
              <ImageUpload
                id="school_image"
                label="School Logo/Image "
                setValue={setValue}
                error={errors.school_image}
              />
            </div>
          </div>

          {/* Administrator Information */}
          <div className="space-y-4">
            <h2 className="text-lg font-semibold">Administrator Account</h2>
            <div className="grid grid-cols-2 gap-4">
              <FormField
                id="admin_first_name"
                label="First Name"
                placeholder="First name"
                register={register("admin_first_name")}
                error={errors.admin_first_name}
              />
              <FormField
                id="admin_last_name"
                label="Last Name"
                placeholder="Last name"
                register={register("admin_last_name")}
                error={errors.admin_last_name}
              />
            </div>
            <div className="grid grid-cols-1 gap-4">
              <div className="space-y-2">
                <label htmlFor="admin_gender" className="text-sm font-medium">
                  Gender
                </label>
                <Select
                  onValueChange={(value) =>
                    setValue("admin_gender", value as "male" | "female", {
                      shouldValidate: true,
                    })
                  }
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select gender" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="male">Male</SelectItem>
                    <SelectItem value="female">Female</SelectItem>
                  </SelectContent>
                </Select>
                {errors.admin_gender && (
                  <p className="text-sm text-red-600">
                    {errors.admin_gender.message}
                  </p>
                )}
              </div>
            </div>
            <div className="grid grid-cols-1 gap-4">
              <FormField
                id="admin_username"
                label="Username"
                placeholder="Create a username"
                register={register("admin_username")}
                error={errors.admin_username}
              />
              <PasswordField
                id="admin_password"
                label="Password"
                placeholder="Create a password"
                register={register("admin_password")}
                error={errors.admin_password}
              />
            </div>
          </div>
        </div>

        <Button
          type="submit"
          className="w-full mt-8 py-6 text-lg bg-green-500 hover:bg-green-600"
          disabled={mutation.isPending}
        >
          {mutation.isPending ? "Submitting..." : "Submit"}
        </Button>
      </form>
    </div>
  );
}
