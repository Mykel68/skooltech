import React from "react";

export default function Loading({ message }: { message?: string }) {
  if (!message) message = "Loading…";
  return (
    <div className="flex items-center justify-center p-8 w-full">
      <div className="max-w-md w-full mx-auto text-center border rounded-lg shadow-md p-6 bg-white">
        <div className="flex justify-center mb-4">
          <svg
            className="w-10 h-10 text-blue-500 animate-spin"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 4v1m0 14v1m8.66-7.66l-.7.7M4.34 4.34l.7.7m0 12.92l-.7.7M19.66 4.34l-.7.7M4 12H3m18 0h-1"
            />
          </svg>
        </div>
        <h3 className="text-lg font-semibold text-gray-900">{message}</h3>
        <div className="mt-4 w-full">
          <div className="h-1 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-blue-500 rounded-full animate-pulse"
              style={{ width: "60%" }}
            ></div>
          </div>
        </div>
      </div>
    </div>
  );
}
