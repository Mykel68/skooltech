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
import { useRouter } from "next/navigation";
import { FaGoogle, FaApple } from "react-icons/fa";
import { useUserStore } from "@/stores/userStore";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { AxiosError } from "axios";

export function LoginForm() {
  const router = useRouter();
  const setUser = useUserStore((state) => state.setUser);
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
    onSuccess: (data) => {
      console.log("[LoginForm] Login mutation success:", data); // Client-side log
      setUser({
        userId: data.decoded.user_id,
        username: data.decoded.username,
        role: data.decoded.role,
        schoolId: data.decoded.school_id,
        firstName: data.decoded.first_name,
        lastName: data.decoded.last_name,
        email: data.decoded.email,
        schoolName: data.decoded.school_name,
        schoolCode: data.decoded.school_code,
        schoolImage: data.decoded.school_image,
        is_school_active: data.decoded.is_school_active,
        session_id: data.decoded.session_id,
      });
      toast.success("Login successful!");
      if (data.decoded.is_school_active === true) {
        router.push("/dashboard");
      } else {
        router.push("/code");
      }
    },
    onError: (error: unknown) => {
      console.error("[LoginForm] Login mutation error:", error); // Debug log

      if (error instanceof AxiosError && error.response?.data) {
        const errorMsg =
          error.response.data.error ||
          error.response.data.message ||
          "Login failed. Please try again.";
        toast.error(errorMsg);
      } else if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("An unknown error occurred. Please try again.");
      }
    },
  });

  const onSubmit = (data: LoginFormData) => {
    console.log("[LoginForm] Form submitted with data:", data); // Client-side log
    mutation.mutate(data);
  };

  return (
    <Card className="p-3">
      <CardHeader>
        <CardTitle>Login</CardTitle>
        <CardDescription>Provide your credentials </CardDescription>
      </CardHeader>
      <CardContent className="p-4 pt-1">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* <div className='grid grid-cols-1 gap-4'>
						<Button
							variant='outline'
							type='button'
							className='flex items-center justify-center gap-2'
							onClick={() =>
								console.log('[LoginForm] Google login clicked')
							} // Client-side log
						>
							<FaGoogle className='h-4 w-4' />
							Continue with Google
						</Button>
						<Button
							variant='outline'
							type='button'
							className='flex items-center justify-center gap-2'
							onClick={() =>
								console.log('[LoginForm] Apple login clicked')
							} // Client-side log
						>
							<FaApple className='h-4 w-4' />
							Continue with Apple
						</Button>
					</div> */}

          {/* <div className='relative flex items-center'>
						<div className='flex-grow border-t border-gray-300'></div>
						<span className='mx-4 text-sm text-gray-500'>or</span>
						<div className='flex-grow border-t border-gray-300'></div>
					</div> */}

          <div className="gap-4 flex flex-col">
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
      </CardContent>
    </Card>
  );
}
