import SchoolRegistrationForm from "@/components/forms/school-registration-form";
import Image from "next/image";

export default function Page() {
  return (
    <main className="flex min-h-screen flex-col md:flex-row">
      <div className="w-full md:w-[70%] p-6 md:p-8 lg:p-12 overflow-y-auto">
        <SchoolRegistrationForm />
      </div>
      <div className="hidden md:block md:w-[30%] relative">
        <div className="absolute inset-0 bg-black/30 z-10 flex items-start justify-end p-6">
          <div className="bg-white/90 rounded-full p-2 flex items-center gap-2">
            <span className="text-sm font-medium text-black px-2">
              SCHOOL TECH
            </span>
            <div className="h-8 w-8 rounded-full bg-teal-600 flex items-center justify-center text-white font-bold">
              S
            </div>
          </div>
        </div>
        <Image
          src="/images/login-img.jpg"
          alt="School community"
          className="fixed "
          fill
        />
      </div>
    </main>
  );
}
