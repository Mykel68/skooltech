import SchoolRegistrationForm from "@/components/school-registration-form";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 md:p-8 lg:p-12">
      <div className="w-full max-w-3xl">
        <SchoolRegistrationForm />
      </div>
    </main>
  );
}
