"use client";

import { useEffect } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { FormField } from "@/components/FormField";
import { ImageUpload } from "@/components/ImageUpload";
import { schoolProfileSchema } from "@/schema/schoolProfileSchema";
import { SchoolProfileFormData } from "@/types/schoolProfile";
import { updateSchoolProfile } from "@/services/httpClient";
import { useUserStore } from "@/stores/userStore";
import axios from "axios";

export function SchoolProfileForm() {
  const schoolId = useUserStore((state) => state.schoolId);

  // Fetch current school profile
  const { data: initialData } = useQuery({
    queryKey: ["schoolProfile", schoolId],
    queryFn: async () => {
      const { data } = await axios.get(`/api/school/get-profile/${schoolId}`);
      return data;
    },
    enabled: !!schoolId,
  });

  const {
    register,
    handleSubmit,
    formState: { errors, dirtyFields },
    reset,
    setValue,
  } = useForm<SchoolProfileFormData>({
    resolver: zodResolver(schoolProfileSchema),
    defaultValues: {
      name: "",
      address: "",
      phone_number: "",
      school_code: "",
      school_image: undefined,
    },
  });

  useEffect(() => {
    if (initialData) {
      reset({
        name: initialData.schoolName,
        address: initialData.address,
        phone_number: initialData.phone_number,
        school_code: initialData.school_code,
        school_image: initialData.school_image,
      });
    }
  }, [initialData, reset]);

  const mutation = useMutation({
    mutationFn: updateSchoolProfile,
    onSuccess: () => {
      toast.success("School profile updated successfully!");
    },
    onError: (error: Error) => {
      console.error("[SchoolProfileForm] Update error:", error);
      toast.error(error.message || "Failed to update school profile.");
    },
  });

  const onSubmit = (data: SchoolProfileFormData) => {
    const changedData = Object.fromEntries(
      Object.entries(data).filter(
        ([key]) => dirtyFields[key as keyof SchoolProfileFormData]
      )
    );

    mutation.mutate(changedData);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <FormField
          id="schoolName"
          label="School Name"
          placeholder="Enter school name"
          register={register("name")}
          error={errors.name}
        />
        <FormField
          id="address"
          label="Address"
          placeholder="Enter school address"
          register={register("address")}
          error={errors.address}
        />
        <FormField
          id="phone"
          label="Phone"
          placeholder="Enter phone number"
          register={register("phone_number")}
          error={errors.phone_number}
        />
        <FormField
          id="schoolCode"
          label="School Code"
          placeholder="Enter code"
          register={register("school_code")}
          error={errors.school_code}
        />
        <ImageUpload
          id="school_image"
          label="School Logo/Image "
          setValue={setValue}
          error={errors.school_image}
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
