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
import { SchoolProfileFormData } from "@/types/schoolProfile";
import { ImageUpload } from "@/components/ImageUpload";
import { schoolProfileSchema } from "@/schema/schoolProfileSchema";

export function SchoolProfileForm() {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<SchoolProfileFormData>({
    resolver: zodResolver(schoolProfileSchema),
    defaultValues: {
      name: "",
      address: "",
      school_image: undefined,
      phone_number: undefined,
      school_code: "",
    },
  });

  const mutation = useMutation({
    mutationFn: updateUserProfile,
    onSuccess: () => {
      toast.success("User profile updated successfully!");
    },
    onError: (error: Error) => {
      toast.error(
        error.message || "Failed to update user profile. Please try again."
      );
    },
  });

  const onSubmit = (data: SchoolProfileFormData) => {
    mutation.mutate(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <FormField
          id="name"
          label="Name"
          placeholder="name"
          register={register("name")}
          error={errors.name}
        />
        <FormField
          id="address"
          label="Address"
          placeholder="address"
          register={register("address")}
          error={errors.address}
        />
        <ImageUpload
          id="school_image"
          label="School Logo/Image "
          setValue={setValue}
          error={errors.school_image}
        />
        <FormField
          id="phone_number"
          label="Phone Number"
          placeholder="Phone number"
          register={register("phone_number")}
          error={errors.phone_number}
        />
      </div>
      <Button
        type="submit"
        className="bg-green-500 hover:bg-green-600"
        disabled={mutation.isPending}
      >
        {mutation.isPending ? "Saving..." : "Save User Changes"}
      </Button>
    </form>
  );
}
