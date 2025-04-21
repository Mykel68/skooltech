"use client";

import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { FormField } from "@/components/FormField";
import { profileSchema } from "@/schema/profileSchema";
import { ProfileFormData } from "@/types/profile";
import { updateUserProfile } from "@/services/httpClient";

export default function UserProfileForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      username: "",
      email: "",
      first_name: "",
      last_name: "",
    },
  });

  const mutation = useMutation({
    mutationFn: updateUserProfile,
    onSuccess: () => {
      toast.success("Profile updated successfully!");
    },
    onError: (error: Error) => {
      toast.error(
        error.message || "Failed to update profile. Please try again."
      );
    },
  });

  const onSubmit = (data: ProfileFormData) => {
    mutation.mutate(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <FormField
          id="firstName"
          label="First Name"
          placeholder="John"
          register={register("first_name")}
          error={errors.first_name}
        />
        <FormField
          id="last_name"
          label="Last Name"
          placeholder="Doe"
          register={register("last_name")}
          error={errors.last_name}
        />
        <FormField
          id="username"
          label="Username"
          placeholder="johndoe"
          register={register("username")}
          error={errors.username}
        />
        <FormField
          id="email"
          label="Email"
          placeholder="youremail@gmail.com"
          register={register("email")}
          error={errors.email}
        />
      </div>
      <Button
        type="submit"
        className="bg-green-500 hover:bg-green-600"
        disabled={mutation.isPending}
      >
        {mutation.isPending ? "Saving..." : "Save Changes"}
      </Button>
    </form>
  );
}
