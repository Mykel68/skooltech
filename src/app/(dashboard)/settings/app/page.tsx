"use client";

import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Palette, Save, RotateCcw, Eye, Check, Plus } from "lucide-react";
import { ColorScheme, colorSchemeSchema } from "@/schema/themeSchema";
import { mockAPI } from "@/data/mockAPI";
import { useThemeStore } from "@/stores/themeStore";
import { useNotification } from "@/hooks/use-notification";
import ColorPicker from "@/components/color-picker";
import ThemePreview from "@/components/theme-preview";
import { presetThemes } from "@/data/presetThemes";

export default function AppSettings() {
  const [activeTab, setActiveTab] = useState("preset");
  const [isLoading, setIsLoading] = useState(false);
  const [schoolThemes, setSchoolThemes] = useState<ColorScheme[]>([]);

  const { notification, showNotification } = useNotification();
  const {
    currentTheme,
    customThemes,
    previewTheme,
    setCurrentTheme,
    setPreviewTheme,
    clearPreview,
    addCustomTheme,
  } = useThemeStore();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    reset,
    setValue,
  } = useForm<ColorScheme>({
    resolver: zodResolver(colorSchemeSchema),
    defaultValues: {
      name: "",
      primary: "#3B82F6",
      secondary: "#1E40AF",
      accent: "#06B6D4",
      background: "#FFFFFF",
      surface: "#F8FAFC",
      text: "#1E293B",
    },
  });

  const watchedColors = watch();

  // Load school themes
  useEffect(() => {
    const loadSchoolThemes = async () => {
      try {
        const themes = await mockAPI.getSchoolThemes();
        setSchoolThemes(themes);
      } catch {
        showNotification("Failed to load school themes", "error");
      }
    };
    loadSchoolThemes();
  }, []);

  // Auto-preview
  useEffect(() => {
    if (
      activeTab === "custom" &&
      JSON.stringify(previewTheme) !== JSON.stringify(watchedColors)
    ) {
      setPreviewTheme(watchedColors);
    }
  }, [watchedColors, activeTab]);

  const getCurrentThemeData = () => {
    if (previewTheme) return previewTheme;
    const allThemes = [...presetThemes, ...customThemes, ...schoolThemes];
    return allThemes.find((t) => t.id === currentTheme) || presetThemes[0];
  };

  const handlePreviewTheme = (theme: ColorScheme) => setPreviewTheme(theme);

  const handleApplyTheme = (themeId: string) => {
    setCurrentTheme(themeId);
    clearPreview();
    showNotification("Theme applied successfully!");
  };

  const handleSaveCustomTheme = async (data: ColorScheme) => {
    setIsLoading(true);
    try {
      addCustomTheme(data);
      await mockAPI.saveThemeToSchool(data);
      showNotification("Custom theme saved successfully!");
      reset();
      setActiveTab("preset");
    } catch {
      showNotification("Failed to save theme", "error");
    } finally {
      setIsLoading(false);
    }
  };

  const handleLoadPreset = (theme: ColorScheme) => {
    Object.keys(theme).forEach((key) => {
      if (key !== "id" && key !== "name") {
        setValue(key as keyof ColorScheme, (theme as any)[key]);
      }
    });
    setValue("name", `Custom ${theme.name}`);
  };

  return (
    <div
      className="min-h-screen transition-colors duration-300"
      style={{
        backgroundColor: getCurrentThemeData().background,
        color: getCurrentThemeData().text,
      }}
    >
      {/* Notification */}
      {notification && (
        <div
          className={`fixed top-4 right-4 z-50 px-4 py-2 rounded-lg shadow-lg ${
            notification.type === "success"
              ? "bg-green-500 text-white"
              : "bg-red-500 text-white"
          }`}
        >
          {notification.message}
        </div>
      )}

      {/* Rest of your UI remains unchanged (Tabs, Presets, School, Custom, Preview) */}
      <div className="max-w-6xl mx-auto p-6">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-3 mb-2">
            <Palette
              className="w-8 h-8"
              style={{ color: getCurrentThemeData().primary }}
            />
            <h1 className="text-3xl font-bold">App Settings</h1>
          </div>
          <p className="text-lg opacity-75">
            Personalize your app with custom colors and themes
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Settings Panel */}
          <div className="lg:col-span-2 space-y-6">
            {/* Tab Navigation */}
            <div
              className="flex space-x-1 p-1 rounded-lg"
              style={{ backgroundColor: getCurrentThemeData().surface }}
            >
              {[
                { id: "preset", label: "Preset Themes" },
                { id: "school", label: "School Themes" },
                { id: "custom", label: "Create Custom" },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => {
                    setActiveTab(tab.id);
                    if (tab.id !== "custom") clearPreview();
                  }}
                  className={`flex-1 py-2 px-4 rounded-md font-medium transition-colors ${
                    activeTab === tab.id
                      ? "text-white shadow-sm"
                      : "hover:opacity-75"
                  }`}
                  style={{
                    backgroundColor:
                      activeTab === tab.id
                        ? getCurrentThemeData().primary
                        : "transparent",
                    color:
                      activeTab === tab.id
                        ? "#ffffff"
                        : getCurrentThemeData().text,
                  }}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Preset Themes */}
            {activeTab === "preset" && (
              <div className="space-y-4">
                <h2 className="text-xl font-semibold">Choose a Preset Theme</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {presetThemes.map((theme) => (
                    <div
                      key={theme.id}
                      className="p-4 rounded-lg border-2 cursor-pointer transition-all hover:scale-105"
                      style={{
                        backgroundColor: getCurrentThemeData().surface,
                        borderColor:
                          currentTheme === theme.id
                            ? getCurrentThemeData().primary
                            : "transparent",
                      }}
                    >
                      <div className="flex justify-between items-start mb-3">
                        <h3 className="font-medium">{theme.name}</h3>
                        <div className="flex space-x-1">
                          <button
                            onClick={() => handlePreviewTheme(theme)}
                            className="p-1 rounded hover:opacity-75"
                            style={{ color: getCurrentThemeData().primary }}
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleApplyTheme(theme.id!)}
                            className="p-1 rounded hover:opacity-75"
                            style={{ color: getCurrentThemeData().accent }}
                          >
                            <Check className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleLoadPreset(theme)}
                            className="p-1 rounded hover:opacity-75"
                            style={{ color: getCurrentThemeData().secondary }}
                          >
                            <Plus className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        {[
                          theme.primary,
                          theme.secondary,
                          theme.accent,
                          theme.background,
                        ].map((color, index) => (
                          <div
                            key={index}
                            className="w-6 h-6 rounded-full border border-gray-300"
                            style={{ backgroundColor: color }}
                          />
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* School Themes */}
            {activeTab === "school" && (
              <div className="space-y-4">
                <h2 className="text-xl font-semibold">School Themes</h2>
                {schoolThemes.length === 0 ? (
                  <div className="text-center py-8 opacity-75">
                    <Palette className="w-12 h-12 mx-auto mb-3" />
                    <p>No school themes available yet</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {schoolThemes.map((theme) => (
                      <div
                        key={theme.id}
                        className="p-4 rounded-lg border-2"
                        style={{
                          backgroundColor: getCurrentThemeData().surface,
                          borderColor:
                            currentTheme === theme.id
                              ? getCurrentThemeData().primary
                              : "transparent",
                        }}
                      >
                        <div className="flex justify-between items-start mb-3">
                          <div>
                            <h3 className="font-medium">{theme.name}</h3>
                            <p className="text-sm opacity-75">
                              by {theme.createdBy}
                            </p>
                          </div>
                          <div className="flex space-x-1">
                            <button
                              onClick={() => handlePreviewTheme(theme)}
                              className="p-1 rounded hover:opacity-75"
                              style={{ color: getCurrentThemeData().primary }}
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleApplyTheme(theme.id!)}
                              className="p-1 rounded hover:opacity-75"
                              style={{ color: getCurrentThemeData().accent }}
                            >
                              <Check className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                        <div className="flex space-x-2">
                          {[
                            theme.primary,
                            theme.secondary,
                            theme.accent,
                            theme.background,
                          ].map((color, index) => (
                            <div
                              key={index}
                              className="w-6 h-6 rounded-full border border-gray-300"
                              style={{ backgroundColor: color }}
                            />
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Custom Theme Creator */}
            {activeTab === "custom" && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold">Create Custom Theme</h2>

                <div
                  className="p-6 rounded-lg"
                  style={{ backgroundColor: getCurrentThemeData().surface }}
                >
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium">Theme Name</label>
                      <input
                        {...register("name")}
                        className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Enter theme name"
                      />
                      {errors.name && (
                        <p className="text-sm text-red-500 mt-1">
                          {errors.name.message}
                        </p>
                      )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <ColorPicker
                        label="Primary Color"
                        value={watch("primary")}
                        onChange={(value) => setValue("primary", value)}
                        error={errors.primary}
                      />
                      <ColorPicker
                        label="Secondary Color"
                        value={watch("secondary")}
                        onChange={(value) => setValue("secondary", value)}
                        error={errors.secondary}
                      />
                      <ColorPicker
                        label="Accent Color"
                        value={watch("accent")}
                        onChange={(value) => setValue("accent", value)}
                        error={errors.accent}
                      />
                      <ColorPicker
                        label="Background Color"
                        value={watch("background")}
                        onChange={(value) => setValue("background", value)}
                        error={errors.background}
                      />
                      <ColorPicker
                        label="Surface Color"
                        value={watch("surface")}
                        onChange={(value) => setValue("surface", value)}
                        error={errors.surface}
                      />
                      <ColorPicker
                        label="Text Color"
                        value={watch("text")}
                        onChange={(value) => setValue("text", value)}
                        error={errors.text}
                      />
                    </div>

                    <div className="flex space-x-3 pt-4">
                      <button
                        onClick={handleSubmit(handleSaveCustomTheme)}
                        disabled={isLoading}
                        className="flex items-center space-x-2 px-4 py-2 rounded-lg text-white font-medium disabled:opacity-50"
                        style={{
                          backgroundColor: getCurrentThemeData().primary,
                        }}
                      >
                        <Save className="w-4 h-4" />
                        <span>{isLoading ? "Saving..." : "Save Theme"}</span>
                      </button>
                      <button
                        onClick={() => reset()}
                        className="flex items-center space-x-2 px-4 py-2 rounded-lg border font-medium"
                        style={{
                          borderColor: getCurrentThemeData().primary,
                          color: getCurrentThemeData().primary,
                        }}
                      >
                        <RotateCcw className="w-4 h-4" />
                        <span>Reset</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Preview Panel */}
          <div className="lg:col-span-1">
            <div className="sticky top-6 space-y-4">
              <h3 className="text-lg font-semibold">Live Preview</h3>
              <ThemePreview theme={getCurrentThemeData()} />

              {previewTheme && (
                <div className="space-y-2">
                  <button
                    onClick={() => handleApplyTheme("preview")}
                    className="w-full py-2 px-4 rounded-lg text-white font-medium"
                    style={{ backgroundColor: getCurrentThemeData().primary }}
                  >
                    Apply This Theme
                  </button>
                  <button
                    onClick={clearPreview}
                    className="w-full py-2 px-4 rounded-lg border font-medium"
                    style={{
                      borderColor: getCurrentThemeData().primary,
                      color: getCurrentThemeData().primary,
                    }}
                  >
                    Cancel Preview
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
