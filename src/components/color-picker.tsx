import React from "react";

interface ColorPickerProps {
  label: string;
  value: string;
  onChange: (val: string) => void;
  error?: { message?: string };
}

export default function ColorPicker({
  label,
  value,
  onChange,
  error,
}: ColorPickerProps) {
  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-gray-700">{label}</label>
      <div className="flex items-center space-x-3 relative">
        <div
          className="w-12 h-12 rounded-lg border-2 border-gray-300 cursor-pointer"
          style={{ backgroundColor: value }}
        />
        <input
          type="color"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-12 h-12 rounded-lg cursor-pointer opacity-0 absolute"
          style={{ left: "0", top: "0" }}
        />
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="#000000"
        />
      </div>
      {error && <p className="text-sm text-red-500">{error.message}</p>}
    </div>
  );
}
