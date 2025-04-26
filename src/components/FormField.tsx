import React, { ReactNode } from "react";
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
  defaultValue?: string;
  icon?: ReactNode;
  readOnly?: boolean;
}

export function FormField({
  id,
  label,
  placeholder,
  type = "text",
  register,
  error,
  defaultValue,
  icon,
  readOnly = false,
}: FormFieldProps) {
  const readOnlyClasses = readOnly
    ? "bg-gray-100 cursor-not-allowed text-gray-600"
    : "focus:outline-none focus:ring-2 focus:ring-blue-500";

  return (
    <div className="flex flex-col gap-1 m-1">
      <Label htmlFor={id} className="pl-1 text-sm font-medium text-gray-700">
        {label}
      </Label>
      <div className="relative">
        {icon && (
          <span className="absolute inset-y-0 left-3 flex items-center text-gray-400">
            {icon}
          </span>
        )}
        <Input
          id={id}
          type={type}
          placeholder={placeholder}
          defaultValue={defaultValue}
          {...register}
          readOnly={readOnly}
          className={`${
            icon ? "pl-10" : "pl-3"
          } pr-3 py-2 border rounded-lg ${readOnlyClasses}`}
        />
      </div>
      {error && <p className="text-red-500 text-xs mt-1">{error.message}</p>}
    </div>
  );
}
