"use client";

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

export default function SchoolRegistrationPage() {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<SchoolFormData>({
    resolver: zodResolver(schoolRegistrationFormSchema),
    defaultValues: {
      name: "",
      address: "",
      admin_username: "",
      admin_password: "",
      admin_email: "",
      admin_first_name: "",
      admin_last_name: "",
      phone_number: "",
      school_image: undefined,
    },
  });

  const mutation = useMutation({
    mutationFn: registerSchool,
    onSuccess: () => {
      toast.success("School registered successfully!");
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
            <FormField
              id="name"
              label="School Name"
              placeholder="School name"
              register={register("name")}
              error={errors.name}
            />
            <FormField
              id="phone_number"
              label="Phone Number (Optional)"
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
            <FormField
              id="address"
              label="Address"
              placeholder="Address"
              register={register("address")}
              error={errors.address}
            />
            <ImageUpload
              id="school_image"
              label="School Logo/Image (Optional)"
              setValue={setValue}
              error={errors.school_image}
            />
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
