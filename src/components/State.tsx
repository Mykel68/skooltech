import React, { createContext, useContext, useState, ReactNode } from "react";
import { Loader2, BookOpen, Clock, Users, CheckCircle } from "lucide-react";

// Types
interface LoadingContextType {
  isLoading: boolean;
  loadingMessage: string;
  setLoading: (loading: boolean, message?: string) => void;
  showSuccess: (message: string) => void;
  showError: (message: string) => void;
}

interface LoadingProviderProps {
  children: ReactNode;
}

interface LoadingOverlayProps {
  message?: string;
  type?: "loading" | "success" | "error";
}

// Create Loading Context
const LoadingContext = createContext<LoadingContextType | undefined>(undefined);

// Loading Provider Component
export const LoadingProvider: React.FC<LoadingProviderProps> = ({
  children,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState("Loading...");
  const [notificationType, setNotificationType] = useState<
    "loading" | "success" | "error"
  >("loading");

  const setLoading = (loading: boolean, message: string = "Loading...") => {
    setIsLoading(loading);
    setLoadingMessage(message);
    setNotificationType("loading");
  };

  const showSuccess = (message: string) => {
    setLoadingMessage(message);
    setNotificationType("success");
    setIsLoading(true);
    setTimeout(() => setIsLoading(false), 2000);
  };

  const showError = (message: string) => {
    setLoadingMessage(message);
    setNotificationType("error");
    setIsLoading(true);
    setTimeout(() => setIsLoading(false), 3000);
  };

  return (
    <LoadingContext.Provider
      value={{ isLoading, loadingMessage, setLoading, showSuccess, showError }}
    >
      {children}
      {isLoading && (
        <LoadingOverlay message={loadingMessage} type={notificationType} />
      )}
    </LoadingContext.Provider>
  );
};

// Hook to use loading context
export const useLoading = (): LoadingContextType => {
  const context = useContext(LoadingContext);
  if (!context) {
    throw new Error("useLoading must be used within a LoadingProvider");
  }
  return context;
};

// Main Loading Overlay Component
const LoadingOverlay: React.FC<LoadingOverlayProps> = ({
  message = "Loading...",
  type = "loading",
}) => {
  const getIcon = () => {
    switch (type) {
      case "success":
        return <CheckCircle className="h-8 w-8 text-green-500" />;
      case "error":
        return (
          <div className="h-8 w-8 bg-red-500 rounded-full flex items-center justify-center">
            <span className="text-white text-sm font-bold">!</span>
          </div>
        );
      default:
        return <Loader2 className="h-8 w-8 text-blue-500 animate-spin" />;
    }
  };

  const getBackgroundColor = () => {
    switch (type) {
      case "success":
        return "bg-green-50 border-green-200";
      case "error":
        return "bg-red-50 border-red-200";
      default:
        return "bg-white border-gray-200";
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
      <div
        className={`${getBackgroundColor()} border rounded-lg p-8 max-w-sm w-full mx-4 shadow-xl`}
      >
        <div className="flex flex-col items-center text-center">
          {getIcon()}
          <h3 className="mt-4 text-lg font-semibold text-gray-900">
            {message}
          </h3>
          {type === "loading" && (
            <div className="mt-4 w-full">
              <div className="h-1 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-blue-500 rounded-full animate-pulse"
                  style={{ width: "60%" }}
                ></div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Skeleton Loading Components for different use cases
export const SkeletonCard: React.FC = () => (
  <div className="bg-white rounded-lg shadow-md p-6 animate-pulse">
    <div className="flex justify-between items-start mb-4">
      <div className="space-y-2">
        <div className="h-6 bg-gray-200 rounded w-32"></div>
        <div className="h-4 bg-gray-200 rounded w-20"></div>
      </div>
      <div className="h-8 bg-gray-200 rounded w-16"></div>
    </div>
    <div className="space-y-3">
      <div className="h-4 bg-gray-200 rounded w-full"></div>
      <div className="h-4 bg-gray-200 rounded w-3/4"></div>
      <div className="h-4 bg-gray-200 rounded w-1/2"></div>
    </div>
  </div>
);

export const SkeletonTable: React.FC = () => (
  <div className="bg-white rounded-lg shadow-md overflow-hidden">
    <div className="px-6 py-4 border-b border-gray-200">
      <div className="h-6 bg-gray-200 rounded w-48 animate-pulse"></div>
    </div>
    <div className="divide-y divide-gray-200">
      {[...Array(5)].map((_, index) => (
        <div key={index} className="px-6 py-4 animate-pulse">
          <div className="flex items-center space-x-4">
            <div className="h-4 bg-gray-200 rounded w-1/4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/4"></div>
          </div>
        </div>
      ))}
    </div>
  </div>
);

export const SkeletonProfile: React.FC = () => (
  <div className="bg-white rounded-lg shadow-md p-6 animate-pulse">
    <div className="flex items-center space-x-4 mb-6">
      <div className="h-16 w-16 bg-gray-200 rounded-full"></div>
      <div className="space-y-2">
        <div className="h-6 bg-gray-200 rounded w-32"></div>
        <div className="h-4 bg-gray-200 rounded w-24"></div>
      </div>
    </div>
    <div className="space-y-4">
      <div className="h-4 bg-gray-200 rounded w-full"></div>
      <div className="h-4 bg-gray-200 rounded w-5/6"></div>
      <div className="h-4 bg-gray-200 rounded w-4/6"></div>
    </div>
  </div>
);

// Inline Loading Spinner
export const InlineLoader: React.FC<{
  size?: "sm" | "md" | "lg";
  color?: string;
}> = ({ size = "md", color = "text-blue-500" }) => {
  const sizeClasses = {
    sm: "h-4 w-4",
    md: "h-6 w-6",
    lg: "h-8 w-8",
  };

  return <Loader2 className={`${sizeClasses[size]} ${color} animate-spin`} />;
};

// Loading Button Component
export const LoadingButton: React.FC<{
  isLoading: boolean;
  children: ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  variant?: "primary" | "secondary" | "danger";
  size?: "sm" | "md" | "lg";
}> = ({
  isLoading,
  children,
  onClick,
  disabled = false,
  variant = "primary",
  size = "md",
}) => {
  const variantClasses = {
    primary: "bg-blue-600 hover:bg-blue-700 text-white",
    secondary: "bg-gray-600 hover:bg-gray-700 text-white",
    danger: "bg-red-600 hover:bg-red-700 text-white",
  };

  const sizeClasses = {
    sm: "px-3 py-2 text-sm",
    md: "px-4 py-3 text-base",
    lg: "px-6 py-4 text-lg",
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled || isLoading}
      className={`
        ${variantClasses[variant]} 
        ${sizeClasses[size]}
        rounded-lg font-semibold 
        disabled:opacity-50 disabled:cursor-not-allowed
        flex items-center justify-center gap-2
        transition-colors duration-200
      `}
    >
      {isLoading && <InlineLoader size="sm" color="text-white" />}
      {children}
    </button>
  );
};

// Page Loading Component
export const PageLoader: React.FC<{ message?: string }> = ({
  message = "Loading page...",
}) => (
  <div className="min-h-screen bg-gray-50 flex items-center justify-center">
    <div className="text-center">
      <div className="mb-4">
        <BookOpen className="h-12 w-12 text-blue-500 mx-auto animate-pulse" />
      </div>
      <h2 className="text-xl font-semibold text-gray-900 mb-2">{message}</h2>
      <div className="flex items-center justify-center gap-1">
        <div
          className="h-2 w-2 bg-blue-500 rounded-full animate-bounce"
          style={{ animationDelay: "0ms" }}
        ></div>
        <div
          className="h-2 w-2 bg-blue-500 rounded-full animate-bounce"
          style={{ animationDelay: "150ms" }}
        ></div>
        <div
          className="h-2 w-2 bg-blue-500 rounded-full animate-bounce"
          style={{ animationDelay: "300ms" }}
        ></div>
      </div>
    </div>
  </div>
);

// Demo Component showing usage
const LoadingDemo: React.FC = () => {
  const { setLoading, showSuccess, showError } = useLoading();
  const [buttonLoading, setButtonLoading] = useState(false);

  const handleFullScreenLoading = () => {
    setLoading(true, "Fetching your subjects...");
    setTimeout(() => {
      setLoading(false);
      showSuccess("Subjects loaded successfully!");
    }, 3000);
  };

  const handleButtonLoading = () => {
    setButtonLoading(true);
    setTimeout(() => {
      setButtonLoading(false);
      showSuccess("Assignment submitted!");
    }, 2000);
  };

  const handleError = () => {
    showError("Failed to load data. Please try again.");
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">
          Loading States Demo
        </h1>

        <div className="grid gap-8">
          {/* Action Buttons */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Loading Actions
            </h2>
            <div className="flex flex-wrap gap-4">
              <LoadingButton
                isLoading={false}
                onClick={handleFullScreenLoading}
                variant="primary"
              >
                Show Full Screen Loading
              </LoadingButton>

              <LoadingButton
                isLoading={buttonLoading}
                onClick={handleButtonLoading}
                variant="secondary"
              >
                Submit Assignment
              </LoadingButton>

              <LoadingButton
                isLoading={false}
                onClick={handleError}
                variant="danger"
              >
                Trigger Error
              </LoadingButton>
            </div>
          </div>

          {/* Skeleton Components */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Skeleton Loading Examples
            </h2>
            <div className="grid gap-6">
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-3">
                  Subject Cards
                </h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <SkeletonCard />
                  <SkeletonCard />
                </div>
              </div>

              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-3">
                  Profile Section
                </h3>
                <SkeletonProfile />
              </div>

              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-3">
                  Data Table
                </h3>
                <SkeletonTable />
              </div>
            </div>
          </div>

          {/* Inline Loaders */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Inline Loaders
            </h2>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <InlineLoader size="sm" />
                <span className="text-sm text-gray-600">Small loader</span>
              </div>
              <div className="flex items-center gap-2">
                <InlineLoader size="md" />
                <span className="text-sm text-gray-600">Medium loader</span>
              </div>
              <div className="flex items-center gap-2">
                <InlineLoader size="lg" />
                <span className="text-sm text-gray-600">Large loader</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Main State Component with Provider
const State: React.FC = () => {
  return (
    <LoadingProvider>
      <LoadingDemo />
    </LoadingProvider>
  );
};

export default State;
