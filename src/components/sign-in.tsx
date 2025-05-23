"use client";

import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { FormField } from "@/components/FormField";
import { PasswordField } from "@/components/PasswordField";
import { loginSchema } from "@/schema/loginSchema";
import { LoginFormData } from "@/types/login";
import { loginUser } from "@/services/httpClient";
import { FaGoogle, FaApple } from "react-icons/fa";
import { useRouter } from "next/navigation";

export function LoginForm() {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: "",
      password: "",
      agreeToTerms: false,
    },
  });

  const mutation = useMutation({
    mutationFn: loginUser,
    onSuccess: () => {
      toast.success("Login successful!");
      router.push("/dashboard");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Login failed. Please try again.");
    },
  });

  const onSubmit = (data: LoginFormData) => {
    mutation.mutate(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="grid grid-cols-1 gap-4">
        <Button
          variant="outline"
          type="button"
          className="flex items-center justify-center gap-2"
          onClick={() => console.log("Google login clicked")} // Placeholder
        >
          <FaGoogle className="h-4 w-4" />
          Continue with Google
        </Button>
        <Button
          variant="outline"
          type="button"
          className="flex items-center justify-center gap-2"
          onClick={() => console.log("Apple login clicked")} // Placeholder
        >
          <FaApple className="h-4 w-4" />
          Continue with Apple
        </Button>
      </div>

      <div className="relative flex items-center">
        <div className="flex-grow border-t border-gray-300"></div>
        <span className="mx-4 text-sm text-gray-500">or</span>
        <div className="flex-grow border-t border-gray-300"></div>
      </div>

      <div className="grid grid-cols-1 gap-4">
        <FormField
          id="username"
          label="Username"
          placeholder="Enter your username"
          register={register("username")}
          error={errors.username}
        />
        <PasswordField
          id="password"
          label="Password"
          placeholder="Enter your password"
          register={register("password")}
          error={errors.password}
        />
      </div>

      <div className="flex items-center">
        <input
          type="checkbox"
          id="agreeToTerms"
          {...register("agreeToTerms")}
          className="h-4 w-4 rounded border-gray-300 text-green-500 focus:ring-green-500"
        />
        <label
          htmlFor="agreeToTerms"
          className="ml-2 block text-sm text-gray-700"
        >
          I understand the terms & policy
        </label>
        {errors.agreeToTerms && (
          <p className="ml-2 text-red-500 text-sm">
            {errors.agreeToTerms.message}
          </p>
        )}
      </div>

      <Button
        type="submit"
        className="w-full bg-green-500 hover:bg-green-600"
        disabled={mutation.isPending}
      >
        {mutation.isPending ? "Logging in..." : "Login"}
      </Button>
    </form>
  );
}
