import { useState } from "react";
import { Label } from "./ui/label";
import { Button } from "./ui/button";
import { Upload, X } from "lucide-react";
import { Input } from "./ui/input";
import {
  FieldValues,
  UseFormSetValue,
  FieldError,
  Path,
} from "react-hook-form";

interface ImageUploadProps<T extends FieldValues> {
  id: Path<T>;
  label: string;
  setValue: UseFormSetValue<T>;
  error?: FieldError;
}

export function ImageUpload<T extends FieldValues>({
  id,
  label,
  setValue,
  error,
}: ImageUploadProps<T>) {
  const [preview, setPreview] = useState<string | null>(null);

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (res.ok && data.url) {
        setPreview(data.url);
        setValue(id, data.url as any); // Store the URL instead of the file
      } else {
        console.error("Upload failed:", data.error || "Unknown error");
      }
    }
  };

  // const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  // 	if (e.target.files && e.target.files[0]) {
  // 		const file = e.target.files[0];
  // 		setValue(id, file as any); // `as any` to avoid TS error
  // 		const reader = new FileReader();
  // 		reader.onload = (event) => {
  // 			if (event.target?.result) {
  // 				setPreview(event.target.result as string);
  // 			}
  // 		};
  // 		reader.readAsDataURL(file);
  // 	}
  // };

  const removeImage = () => {
    setPreview(null);
    setValue(id, undefined as any);
    const input = document.getElementById(id) as HTMLInputElement;
    if (input) input.value = "";
  };

  return (
    <div className="flex flex-col m-1 gap-2 rounded-md ">
      <Label htmlFor={id} className="pl-3">
        {label}
      </Label>
      <div className="border border-dashed p-2">
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
          <div className="mt-2 relative w-fit border ">
            <img
              src={preview}
              alt="Preview"
              className="h-16 w-16 object-cover "
            />
            <Button
              type="button"
              variant="destructive"
              size="icon"
              className="absolute top-0 right-0 size-5"
              onClick={removeImage}
            >
              <X className="h-0.5 w-0.5" />
            </Button>
          </div>
        )}
        {error && <p className="text-red-500 text-sm">{error.message}</p>}
      </div>
    </div>
  );
}
