import React from "react";

const NotFoundPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50 flex items-center justify-center p-4">
      <div className="max-w-lg w-full text-center">
        {/* 404 Illustration */}
        <div className="relative mb-8">
          <div className="text-8xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-500 mb-4">
            404
          </div>

          {/* Floating Books/Education Icons */}
          <div className="relative h-32 mb-4">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="relative">
                {/* Main book */}
                <div className="w-16 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg shadow-lg transform rotate-12 flex items-center justify-center">
                  <svg
                    className="w-8 h-8 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                    />
                  </svg>
                </div>

                {/* Secondary books */}
                <div className="absolute -top-2 -left-4 w-12 h-16 bg-gradient-to-br from-indigo-400 to-purple-500 rounded-lg shadow-lg transform -rotate-12 opacity-80"></div>
                <div className="absolute -bottom-2 -right-4 w-14 h-18 bg-gradient-to-br from-pink-400 to-red-500 rounded-lg shadow-lg transform rotate-6 opacity-80"></div>
              </div>
            </div>

            {/* Floating particles */}
            <div className="absolute top-4 left-8 w-2 h-2 bg-blue-400 rounded-full animate-float"></div>
            <div
              className="absolute bottom-4 right-8 w-1.5 h-1.5 bg-purple-400 rounded-full animate-float"
              style={{ animationDelay: "0.5s" }}
            ></div>
            <div
              className="absolute top-8 right-4 w-1 h-1 bg-pink-400 rounded-full animate-float"
              style={{ animationDelay: "1s" }}
            ></div>
          </div>
        </div>

        {/* Content */}
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">
              Page Not Found
            </h1>
            <p className="text-gray-600 mb-4">
              The page you're looking for seems to have wandered off to another
              classroom. Let's get you back on track!
            </p>
          </div>

          {/* Navigation Options */}
          <div className="space-y-3">
            <button
              onClick={() => (window.location.href = "/")}
              className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-6 py-3 rounded-lg font-medium transition-all duration-200 transform hover:scale-105 flex items-center justify-center gap-2"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                />
              </svg>
              Go to Dashboard
            </button>

            <button
              onClick={() => window.history.back()}
              className="w-full bg-gray-100 hover:bg-gray-200 text-gray-800 px-6 py-3 rounded-lg font-medium transition-colors duration-200 flex items-center justify-center gap-2"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10 19l-7-7m0 0l7-7m-7 7h18"
                />
              </svg>
              Go Back
            </button>
          </div>

          {/* Help Section */}
          <div className="bg-white/50 backdrop-blur-sm rounded-lg p-4 border border-white/20">
            <h3 className="font-semibold text-gray-800 mb-2">Need Help?</h3>
            <p className="text-sm text-gray-600 mb-3">
              If you believe this is an error, please contact support.
            </p>
            <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
              Contact Support →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;
