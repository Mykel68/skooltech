"use client";

import { useEffect, useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { FormField } from "@/components/FormField";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { ImageUpload } from "@/components/ImageUpload";
import { schoolProfileSchema } from "@/schema/schoolProfileSchema";
import { SchoolProfileFormData } from "@/types/schoolProfile";
import { updateSchoolProfile } from "@/services/httpClient";
import { useUserStore } from "@/stores/userStore";
import axios from "axios";

export function SchoolProfileForm() {
  const schoolId = useUserStore((state) => state.schoolId);
  const [open, setOpen] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);

  const { data: initialData, isLoading } = useQuery({
    queryKey: ["schoolProfile", schoolId],
    queryFn: async () => {
      const { data } = await axios.get(`/api/school/get-profile/${schoolId}`);
      return data.data;
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
      school_image: null,
    },
  });

  useEffect(() => {
    if (initialData) {
      reset({
        name: initialData.name,
        address: initialData.address,
        phone_number: initialData.phone_number,
        school_code: initialData.school_code,
        school_image: initialData.school_image,
      });
      setPreview(null);
    }
  }, [initialData, reset]);

  const mutation = useMutation({
    mutationFn: updateSchoolProfile,
    onSuccess: () => {
      toast.success("School profile updated successfully!");
      setOpen(false);
      setPreview(null);
    },
    onError: (error: Error) => {
      console.error("[SchoolProfileForm] Update error:", error);
      toast.error(error.message || "Failed to update school profile.");
    },
  });

  const onSubmit = (data: SchoolProfileFormData) => {
    // pick only the fields that actually changed
    const changedData = Object.fromEntries(
      Object.entries(data).filter(
        ([key]) => dirtyFields[key as keyof SchoolProfileFormData]
      )
    );

    // inject the school_id from your store
    const payload = {
      school_id: schoolId, // ← add this
      ...changedData,
    };

    mutation.mutate(payload as any);
  };

  if (isLoading) return <div>Loading...</div>;

  return (
    <div className="space-y-6">
      <div className="flex flex-col items-start space-y-4">
        {initialData?.school_image && !preview && (
          <Avatar className="w-24 h-24">
            <AvatarImage src={initialData.school_image} alt="School Logo" />
          </Avatar>
        )}
        {preview && (
          <Avatar className="w-24 h-24">
            <AvatarImage src={preview} alt="Preview Logo" />
          </Avatar>
        )}
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <FormField
          id="schoolName"
          label="School Name"
          placeholder="School name"
          register={register("name")}
          error={errors.name}
          readOnly
        />
        <FormField
          id="address"
          label="Address"
          placeholder="School address"
          register={register("address")}
          error={errors.address}
          readOnly
        />
        <FormField
          id="phone"
          label="Phone"
          placeholder="Phone number"
          register={register("phone_number")}
          error={errors.phone_number}
          readOnly
        />
        <FormField
          id="schoolCode"
          label="School Code"
          placeholder="School code"
          register={register("school_code")}
          error={errors.school_code}
          readOnly
        />
      </div>

      <div className="flex items-center justify-end">
        <Button
          onClick={() => setOpen(true)}
          className="bg-blue-500 hover:bg-blue-600 w-md"
        >
          Edit Profile
        </Button>
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit School Profile</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div>
              <ImageUpload
                id="school_image"
                label="Change Logo"
                setValue={setValue}
                error={errors.school_image}
              />
            </div>
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
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="bg-green-500 hover:bg-green-600"
                disabled={mutation.isPending}
              >
                {mutation.isPending ? "Updating..." : "Save Changes"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
