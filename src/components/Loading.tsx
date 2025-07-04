import React, { useState, useEffect } from "react";
import { Progress } from "./ui/progress";
import { Loader } from "lucide-react";

interface LoadingProps {
  message?: string;
  overlay?: boolean;
  progress?: number;
  autoProgress?: boolean;
}

export default function Loading({
  message = "Loading…",
  overlay = false,
  progress,
  autoProgress = true,
}: LoadingProps) {
  const [currentProgress, setCurrentProgress] = useState(0);

  useEffect(() => {
    if (progress !== undefined) {
      setCurrentProgress(progress);
      return;
    }

    if (!autoProgress) return;

    // Auto-increment progress to make it feel responsive
    const interval = setInterval(() => {
      setCurrentProgress((prev) => {
        if (prev >= 95) return prev; // Stop at 95% to avoid reaching 100% before actual completion
        const increment = Math.random() * 15 + 5; // Random increment between 5-20%
        return Math.min(prev + increment, 95);
      });
    }, 300);

    return () => clearInterval(interval);
  }, [progress, autoProgress]);

  const LoadingContent = () => (
    <div className="flex flex-col items-center justify-center p-8 w-full">
      <div className="max-w-md w-full mx-auto text-center">
        {/* Animated loader icon */}
        <div className="flex justify-center mb-6">
          <div className="relative">
            <div className="w-16 h-16 border-4 border-blue-200 rounded-full animate-pulse"></div>
            <div className="absolute inset-0 w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
            <Loader className="absolute inset-0 w-8 h-8 text-blue-600 m-auto animate-pulse" />
          </div>
        </div>

        {/* Loading message */}
        <h3 className="text-xl font-semibold text-gray-900 mb-2">{message}</h3>

        {/* Progress bar */}
        <div className="w-full space-y-2">
          <Progress
            value={currentProgress}
            className="w-full h-2 bg-gray-200"
          />
          <p className="text-sm text-gray-600">
            {Math.round(currentProgress)}% complete
          </p>
        </div>

        {/* Pulsing dots */}
        <div className="flex justify-center space-x-1 mt-4">
          <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
          <div
            className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"
            style={{ animationDelay: "0.2s" }}
          ></div>
          <div
            className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"
            style={{ animationDelay: "0.4s" }}
          ></div>
        </div>
      </div>
    </div>
  );

  if (overlay) {
    return (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center">
        <div className="bg-white rounded-xl shadow-2xl border border-gray-200 p-8 max-w-md w-full mx-4">
          <LoadingContent />
        </div>
      </div>
    );
  }

  return (
    <div className="w-full min-h-[400px] flex items-center justify-center bg-gray-50 rounded-lg border border-gray-200">
      <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-8 max-w-md w-full mx-4">
        <LoadingContent />
      </div>
    </div>
  );
}
