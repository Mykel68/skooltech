"use client";

import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { messageSchema, MessageFormData } from "@/schema/messageSchema";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Upload,
  FileText,
  Send,
  X,
  Image,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";
import { uploadAttachment } from "@/utils/vercelBlob";
import { useState } from "react";

export default function CreateMessageDialog({
  open,
  setOpen,
  messageTypes,
  recipientOptions,
  createMessageMutation,
}: any) {
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [fileSizeError, setFileSizeError] = useState<string>("");

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    watch,
    setValue,
    reset,
  } = useForm<MessageFormData>({
    resolver: zodResolver(messageSchema),
    defaultValues: {
      title: "",
      content: "",
      recipients: [],
      type: "announcement",
      attachment_name: null,
      contentMode: "write",
    },
  });

  const contentMode = watch("contentMode") || "write";
  const attachment_name = watch("attachment_name");

  const validateFileSize = (file: File | null) => {
    if (file && file.size > 10 * 1024 * 1024) {
      // 10MB
      setFileSizeError("File size must not exceed 10MB");
      return false;
    }
    setFileSizeError("");
    return true;
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;

    if (file && !validateFileSize(file)) {
      e.target.value = ""; // Clear the input
      setImagePreview(null);
      setValue("attachment_name", null);
      return;
    }

    setValue("attachment_name", file);

    // Create image preview for image files
    if (file && file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setImagePreview(null);
    }
  };

  const removeAttachment = () => {
    setValue("attachment_name", null);
    setImagePreview(null);
    setFileSizeError("");
    // Clear the file input
    const fileInput = document.getElementById(
      "attachment-upload"
    ) as HTMLInputElement;
    if (fileInput) fileInput.value = "";
  };

  const onSubmit = async (data: MessageFormData) => {
    const selections = data.recipientSelections
      ? Object.values(data.recipientSelections).filter(Boolean)
      : [];

    let attachmentUrl: string | null = null;

    if (data.attachment_name instanceof File) {
      attachmentUrl = await uploadAttachment(data.attachment_name, "file"); // <-- Here
    }

    if (data.contentMode === "upload" && data.contentFile instanceof File) {
      const contentFileUrl = await uploadAttachment(data.contentFile, "store"); // <-- And here
      data.content = contentFileUrl;
    }

    createMessageMutation.mutate({
      ...data,
      recipients: selections,
      attachment_name: attachmentUrl,
    });

    reset();
    setImagePreview(null);
    setFileSizeError("");
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-w-3xl rounded-3xl bg-gradient-to-br from-white via-gray-50 to-blue-50 shadow-2xl border-0 overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-green-400 via-blue-500 to-purple-600"></div>

        <DialogHeader className="pb-6 border-b border-gray-100">
          <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-r from-green-400 to-blue-500 flex items-center justify-center">
              <Send className="w-5 h-5 text-white" />
            </div>
            Send New Message
          </DialogTitle>
        </DialogHeader>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-8 max-h-[80vh] p-1 overflow-y-auto overflow-x-hidden custom-scrollbar"
        >
          {/* Type Selection - Enhanced */}
          <div className="space-y-3">
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              Message Type
            </label>
            <div className="grid grid-cols-2 gap-4">
              {messageTypes.map((type: any) => (
                <button
                  key={type.value}
                  type="button"
                  onClick={() => setValue("type", type.value)}
                  className={`group relative flex flex-col items-center justify-center gap-2 p-6 rounded-2xl border-2 transition-all duration-300 transform hover:scale-105 ${
                    watch("type") === type.value
                      ? "border-green-400 bg-gradient-to-br from-green-50 to-emerald-50 text-green-700 shadow-lg shadow-green-100"
                      : "border-gray-200 hover:border-gray-300 text-gray-700 bg-white hover:shadow-md"
                  }`}
                >
                  <div
                    className={`p-3 rounded-full ${
                      watch("type") === type.value
                        ? "bg-green-100"
                        : "bg-gray-100 group-hover:bg-gray-200"
                    }`}
                  >
                    <type.icon className="w-6 h-6" />
                  </div>
                  <span className="text-sm font-medium">{type.label}</span>
                  {watch("type") === type.value && (
                    <CheckCircle2 className="absolute top-2 right-2 w-5 h-5 text-green-600" />
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Title - Enhanced */}
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-gray-700">
              Title
            </label>
            <div className="relative">
              <Input
                {...register("title")}
                placeholder="Enter a compelling message title..."
                className="bg-white/80 backdrop-blur border-gray-200 rounded-xl h-12 px-4 text-gray-800 placeholder-gray-400 focus:border-green-400 focus:ring-2 focus:ring-green-100 transition-all duration-200"
              />
            </div>
            {errors.title && (
              <div className="flex items-center gap-2 text-red-500 text-sm">
                <AlertCircle className="w-4 h-4" />
                {errors.title.message}
              </div>
            )}
          </div>

          {/* Content Tabs - Enhanced */}
          <div className="space-y-4">
            <Tabs
              defaultValue="write"
              onValueChange={(v) => {
                setValue("contentMode", v as "write" | "upload");
                if (v === "upload") setValue("content", "");
                if (v === "write") setValue("contentFile", null);
              }}
            >
              <TabsList className="grid w-full grid-cols-2 bg-gray-100/80 backdrop-blur rounded-xl p-1 h-12">
                <TabsTrigger
                  value="write"
                  className="rounded-lg font-medium data-[state=active]:bg-white data-[state=active]:shadow-sm transition-all duration-200"
                >
                  ✍️ Write Content
                </TabsTrigger>
                <TabsTrigger
                  value="upload"
                  className="rounded-lg font-medium data-[state=active]:bg-white data-[state=active]:shadow-sm transition-all duration-200"
                >
                  📎 Upload File
                </TabsTrigger>
              </TabsList>

              <TabsContent value="write" className="space-y-3 mt-6">
                <label className="block text-sm font-semibold text-gray-700">
                  Message Content
                </label>
                <div className="relative">
                  <textarea
                    {...register("content")}
                    rows={8}
                    placeholder="Craft your message here... Make it engaging and clear!"
                    className="w-full px-4 py-4 bg-white/80 backdrop-blur border border-gray-200 rounded-xl focus:border-green-400 focus:ring-2 focus:ring-green-100 resize-none text-gray-800 placeholder-gray-400 transition-all duration-200"
                  />
                  <div className="absolute bottom-3 right-3 text-xs text-gray-400">
                    Rich content supported
                  </div>
                </div>
                {errors.content && (
                  <div className="flex items-center gap-2 text-red-500 text-sm">
                    <AlertCircle className="w-4 h-4" />
                    {"Failed to upload file. Please try again."}
                  </div>
                )}
              </TabsContent>

              <TabsContent value="upload" className="space-y-3 mt-6">
                <label className="block text-sm font-semibold text-gray-700">
                  Upload Content File
                </label>
                <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center bg-white/50 backdrop-blur hover:border-green-300 transition-all duration-300">
                  <div className="space-y-3">
                    <div className="w-16 h-16 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full flex items-center justify-center mx-auto">
                      <Upload className="w-8 h-8 text-white" />
                    </div>
                    <div>
                      <p className="text-gray-700 font-medium">
                        Upload your document
                      </p>
                      <p className="text-sm text-gray-500">
                        PDF, DOC, DOCX, TXT formats supported
                      </p>
                    </div>
                    <Controller
                      control={control}
                      name="contentFile"
                      render={({ field }) => (
                        <Input
                          type="file"
                          accept=".pdf,.doc,.docx,.txt"
                          onChange={(e) =>
                            field.onChange(e.target.files?.[0] || null)
                          }
                          className="max-w-xs mx-auto"
                        />
                      )}
                    />
                  </div>
                </div>
                {typeof errors.contentFile?.message === "string" && (
                  <div className="flex items-center gap-2 text-red-500 text-sm">
                    <AlertCircle className="w-4 h-4" />
                    {errors.contentFile.message}
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </div>

          {/* Enhanced Attachment Section */}
          <div className="space-y-4">
            <label className="block text-sm font-semibold text-gray-700">
              Attachment (Optional) - Max 10MB
            </label>

            {!attachment_name ? (
              <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center bg-white/50 backdrop-blur hover:border-green-300 transition-all duration-300">
                <div className="space-y-3">
                  <div className="w-12 h-12 bg-gradient-to-r from-green-400 to-blue-500 rounded-full flex items-center justify-center mx-auto">
                    <Upload className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <p className="text-gray-700 font-medium">
                      Add an attachment
                    </p>
                    <p className="text-sm text-gray-500">
                      Images, documents, and more
                    </p>
                  </div>
                  <Input
                    type="file"
                    className="max-w-xs mx-auto bg-white/80"
                    onChange={handleFileChange}
                    accept=".pdf,.doc,.docx,.txt,.jpg,.jpeg,.png"
                    id="attachment-upload"
                  />
                </div>
              </div>
            ) : (
              <div className="bg-white/80 backdrop-blur rounded-xl border border-gray-200 overflow-hidden">
                {imagePreview ? (
                  <div className="relative">
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="w-full h-48 object-cover"
                    />
                    <button
                      type="button"
                      onClick={removeAttachment}
                      className="absolute top-3 right-3 w-8 h-8 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center transition-all duration-200 shadow-lg"
                    >
                      <X className="w-4 h-4" />
                    </button>
                    <div className="absolute bottom-3 left-3 bg-black/70 backdrop-blur text-white px-3 py-1 rounded-lg text-sm">
                      <Image className="w-4 h-4 inline mr-1" />
                      {attachment_name.name}
                    </div>
                  </div>
                ) : (
                  <div className="p-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                        <FileText className="w-5 h-5 text-blue-600" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-800">
                          {attachment_name.name}
                        </p>
                        <p className="text-sm text-gray-500">
                          {(attachment_name.size / (1024 * 1024)).toFixed(2)} MB
                        </p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={removeAttachment}
                      className="w-8 h-8 bg-red-100 hover:bg-red-200 text-red-600 rounded-full flex items-center justify-center transition-all duration-200"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>
            )}

            {fileSizeError && (
              <div className="flex items-center gap-2 text-red-500 text-sm bg-red-50 p-3 rounded-lg">
                <AlertCircle className="w-4 h-4" />
                {fileSizeError}
              </div>
            )}
          </div>

          {/* Recipients - Enhanced */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Recipients
              </label>
              <p className="text-xs text-gray-500 mb-4">
                Choose who should receive this important message
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {recipientOptions.map((group: any) => (
                <div key={group.group} className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    {group.group}
                  </label>
                  <div className="relative">
                    <select
                      {...register(
                        `recipientSelections.${group.group}` as const
                      )}
                      className="w-full px-4 py-3 bg-white/80 backdrop-blur border border-gray-200 rounded-xl focus:border-green-400 focus:ring-2 focus:ring-green-100 appearance-none cursor-pointer text-gray-800 transition-all duration-200"
                    >
                      <option value="">Select recipient...</option>
                      {group.options.map((option: any) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                    <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none">
                      <svg
                        className="w-4 h-4 text-gray-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 9l-7 7-7-7"
                        />
                      </svg>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            {errors.recipients && (
              <div className="flex items-center gap-2 text-red-500 text-sm">
                <AlertCircle className="w-4 h-4" />
                {errors.recipients.message}
              </div>
            )}
          </div>

          {/* Enhanced Footer */}
          <div className="flex justify-end gap-4 pt-8 border-t border-gray-100">
            <DialogClose asChild>
              <button
                type="button"
                className="px-8 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-medium transition-all duration-200 hover:scale-105"
              >
                Cancel
              </button>
            </DialogClose>
            <button
              type="submit"
              disabled={createMessageMutation.isPending || !!fileSizeError}
              className="px-8 py-3 bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-600 hover:to-blue-700 text-white rounded-xl font-medium flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 hover:scale-105 shadow-lg hover:shadow-xl"
            >
              {createMessageMutation.isPending ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white" />
                  Sending...
                </>
              ) : (
                <>
                  <Send className="w-5 h-5" />
                  Send Message
                </>
              )}
            </button>
          </div>
        </form>

        <style jsx>{`
          .custom-scrollbar::-webkit-scrollbar {
            width: 6px;
          }
          .custom-scrollbar::-webkit-scrollbar-track {
            background: #f1f1f1;
            border-radius: 10px;
          }
          .custom-scrollbar::-webkit-scrollbar-thumb {
            background: #c1c1c1;
            border-radius: 10px;
          }
          .custom-scrollbar::-webkit-scrollbar-thumb:hover {
            background: #a8a8a8;
          }
        `}</style>
      </DialogContent>
    </Dialog>
  );
}
