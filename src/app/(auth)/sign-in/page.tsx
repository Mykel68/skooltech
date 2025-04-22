"use client";

import { LoginForm } from "@/components/sign-in";

export default function LoginPage() {
  return (
    <div className="flex flex-col lg:flex-row min-h-screen md:h-screen p-3">
      {/* Form Section - 35% on large screens */}
      <div className="w-full lg:w-[35%] p-8 flex flex-col justify-center">
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-8">
            <div className="h-8 w-8 rounded-md bg-green-500 flex items-center justify-center text-white font-bold">
              H
            </div>
            <div className="font-bold uppercase">
              <div>Hope for</div>
              <div>Humanity</div>
            </div>
          </div>

          <h1 className="text-2xl font-bold mb-1">Login to your account</h1>
          <p className="text-gray-500 text-sm">
            Enter your credentials to access your account
          </p>
        </div>

        <LoginForm />
      </div>
      <div className="hidden lg:block lg:w-[65%] relative">
        <div className="absolute inset-0 bg-black/20 z-10"></div>
        <img
          src="/images/reg-img.jpg"
          alt="Volunteers hands together"
          className="w-full h-full object-cover"
        />
        <div className="absolute bottom-16 left-16 right-16 text-white z-20">
          <h2 className="text-5xl font-bold">Together,</h2>
          <h2 className="text-5xl font-bold">we make a difference</h2>
        </div>
      </div>
    </div>
  );
}
