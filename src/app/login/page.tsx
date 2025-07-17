import { GalleryVerticalEnd } from "lucide-react";

import { LoginForm } from "@/components/forms/login-form";
import Image from "next/image";

export default function LoginPage() {
  return (
    <div className="min-h-screen flex flex-col lg:flex-row justify-center ">
      <div className="w-full lg:w-[40%] flex flex-col justify-center p-6 lg:p-12 bg-background relative">
        {/* <div className='flex justify-center gap-2 md:justify-start'>
					<a
						href='#'
						className='flex items-center gap-2 font-semibold text-3xl'
					>
						
						Login
					</a>
				</div> */}
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full ">
            <LoginForm />
          </div>
        </div>
      </div>
      <div className="hidden lg:flex lg:w-[60%] relative overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0">
          <Image
            src="/images/reg-img.jpg"
            alt="Students collaborating"
            fill
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/60"></div>
        </div>

        {/* Decorative Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-20 right-20 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 left-20 w-80 h-80 bg-white/5 rounded-full blur-3xl"></div>
        </div>

        {/* Content */}
        <div className="relative z-10 flex flex-col justify-end p-16 text-white">
          <div
            // initial={{ opacity: 0, y: 30 }}
            // animate={{ opacity: 1, y: 0 }}
            // transition={{ delay: 0.4, duration: 0.8 }}
            className="space-y-6"
          >
            <div className="space-y-2">
              <h2 className="text-5xl font-bold leading-tight">
                Empowering
                <br />
                <span className="text-white/90">Education</span>
              </h2>
              <p className="text-xl text-white/80 max-w-md">
                Join thousands of educators and students in creating a better
                learning experience
              </p>
            </div>

            <div className="flex items-center gap-4 pt-4">
              <div className="flex -space-x-2">
                {[1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className="w-10 h-10 rounded-full bg-white/20 border-2 border-white/30 flex items-center justify-center"
                  >
                    <span className="text-sm font-medium">{i}</span>
                  </div>
                ))}
              </div>
              <div className="text-sm text-white/70">
                <p className="font-medium">10,000+ Active Users</p>
                <p>Across 500+ Schools</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
