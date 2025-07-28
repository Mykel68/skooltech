"use client";

import React from "react";

const GlobalError = ({ error, reset }: { error: Error; reset: () => void }) => {
  return (
    <html>
      <body>
        <div className="min-h-screen bg-gradient-to-br from-red-50 via-pink-50 to-orange-50 flex items-center justify-center p-4">
          <div className="max-w-md w-full text-center">
            <div className="relative mb-8">
              <div className="w-24 h-24 mx-auto relative">
                <div className="absolute inset-0 rounded-full bg-red-100 flex items-center justify-center">
                  <svg
                    className="w-12 h-12 text-red-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
                    />
                  </svg>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <h1 className="text-3xl font-bold text-gray-800 mb-2">
                  Application Error
                </h1>
                <p className="text-gray-600 mb-4">
                  Something went wrong with the application. Please try
                  refreshing the page.
                </p>
              </div>

              <div className="flex flex-col gap-3">
                <button
                  onClick={reset}
                  className="bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-lg font-medium transition-colors duration-200"
                >
                  Try Again
                </button>

                <button
                  onClick={() => (window.location.href = "/")}
                  className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-3 rounded-lg font-medium transition-colors duration-200"
                >
                  Go Home
                </button>
              </div>
            </div>
          </div>
        </div>
      </body>
    </html>
  );
};

export default GlobalError;
