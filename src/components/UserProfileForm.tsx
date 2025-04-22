"use client";

import { useEffect } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { FormField } from "@/components/FormField";
import { userProfileSchema } from "@/schema/userProfileSchema";
import { ProfileFormData } from "@/types/profile";
import { updateUserProfile } from "@/services/httpClient";
import { useUserStore } from "@/stores/userStore";
import axios from "axios";

export function UserProfileForm() {
  const userId = useUserStore((state) => state.userId);

  // Fetch current user profile
  const { data: initialData, isLoading } = useQuery({
    queryKey: ["userProfile", userId],
    queryFn: async () => {
      const { data } = await axios.get(`/api/user/get-profile/${userId}`);
      return data;
    },
    enabled: !!userId, // Only fetch if userId exists
  });

  const {
    register,
    handleSubmit,
    formState: { errors, dirtyFields },
    reset, // to reset form values after data fetch
  } = useForm<ProfileFormData>({
    resolver: zodResolver(userProfileSchema),
    defaultValues: {
      first_name: "",
      last_name: "",
      email: "",
      username: "",
    },
  });

  // Once the data is loaded, reset the form values to initialData
  useEffect(() => {
    if (initialData) {
      reset(initialData); // Reset the form with fetched data
    }
  }, [initialData, reset]);

  const mutation = useMutation({
    mutationFn: updateUserProfile,
    onSuccess: () => {
      toast.success("User profile updated successfully!");
    },
    onError: (error: Error) => {
      console.error("[UserProfileForm] Update error:", error);
      toast.error(error.message || "Failed to update user profile.");
    },
  });

  const onSubmit = (data: ProfileFormData) => {
    const changedData = Object.fromEntries(
      Object.entries(data).filter(
        ([key]) => dirtyFields[key as keyof ProfileFormData]
      )
    );

    console.log("[UserProfileForm] Submitting changed data:", changedData);

    mutation.mutate(changedData);
  };

  if (isLoading) return <div>Loading...</div>;

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <FormField
          id="firstName"
          label="First Name"
          placeholder="Enter first name"
          register={register("first_name")}
          error={errors.first_name}
        />
        <FormField
          id="lastName"
          label="Last Name"
          placeholder="Enter last name"
          register={register("last_name")}
          error={errors.last_name}
        />
        <FormField
          id="email"
          label="Email"
          placeholder="Enter email address"
          register={register("email")}
          error={errors.email}
        />
        <FormField
          id="username"
          label="Username"
          placeholder="Enter Username"
          register={register("username")}
          error={errors.username}
        />
      </div>

      <Button
        type="submit"
        className="w-full bg-green-500 hover:bg-green-600"
        disabled={mutation.isPending}
      >
        {mutation.isPending ? "Updating..." : "Update Profile"}
      </Button>
    </form>
  );
}
