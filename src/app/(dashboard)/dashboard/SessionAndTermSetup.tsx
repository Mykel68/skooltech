"use client";

import SessionSetupForm from "./SessionSetupForm";
import TermSetupForm from "./TermSetupForm";

const SessionAndTermSetup = () => {
  return (
    <div className="w-full px-4 py-6 flex flex-col lg:flex-row gap-6 justify-center items-start">
      <div className="flex-1">
        <SessionSetupForm />
      </div>
      <div className="flex-1">
        <TermSetupForm />
      </div>
    </div>
  );
};

export default SessionAndTermSetup;
