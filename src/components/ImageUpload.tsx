import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Upload, X } from "lucide-react";
import { FieldError } from "react-hook-form";
import { UseFormSetValue } from "react-hook-form";
import { SchoolFormData } from "@/types/school";

interface ImageUploadProps {
  id: string;
  label: string;
  setValue: UseFormSetValue<SchoolFormData>;
  error?: FieldError;
}

export function ImageUpload({ id, label, setValue, error }: ImageUploadProps) {
  const [preview, setPreview] = useState<string | null>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setValue("school_image", file);
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setPreview(event.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setPreview(null);
    setValue("school_image", undefined);
    const input = document.getElementById(id) as HTMLInputElement;
    if (input) input.value = "";
  };

  return (
    <div className="space-y-2">
      <Label htmlFor={id}>{label}</Label>
      <div className="flex items-center gap-4">
        <Button
          type="button"
          variant="outline"
          className="w-full"
          onClick={() => document.getElementById(id)?.click()}
        >
          <Upload className="mr-2 h-4 w-4" />
          Upload Image
        </Button>
        <Input
          id={id}
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          className="hidden"
        />
      </div>
      {preview && (
        <div className="mt-2 relative">
          <img
            src={preview}
            alt="School preview"
            className="h-32 w-32 object-cover rounded-md border"
          />
          <Button
            type="button"
            variant="destructive"
            size="icon"
            className="absolute top-0 right-0"
            onClick={removeImage}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      )}
      {error && <p className="text-red-500 text-sm">{error.message}</p>}
    </div>
  );
}
