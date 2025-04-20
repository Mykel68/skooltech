import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { UseFormRegisterReturn } from "react-hook-form";
import { FieldError } from "react-hook-form";

interface FormFieldProps {
  id: string;
  label: string;
  placeholder?: string;
  type?: string;
  register: UseFormRegisterReturn;
  error?: FieldError;
}

export function FormField({
  id,
  label,
  placeholder,
  type = "text",
  register,
  error,
}: FormFieldProps) {
  return (
    <div className="space-y-2">
      <Label htmlFor={id}>{label}</Label>
      <Input id={id} type={type} placeholder={placeholder} {...register} />
      {error && <p className="text-red-500 text-sm">{error.message}</p>}
    </div>
  );
}
