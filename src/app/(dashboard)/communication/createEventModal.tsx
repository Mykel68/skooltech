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
import { Upload, FileText, Send } from "lucide-react";

export default function CreateMessageDialog({
  open,
  setOpen,
  messageTypes,
  recipientOptions,
  createMessageMutation,
}: any) {
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
      attachment: null,
    },
  });

  const contentMode = watch("contentMode") || "write";
  const attachment = watch("attachment");

  const onSubmit = (data: MessageFormData) => {
    // flatten recipientSelections to recipients array
    const selections = data.recipientSelections
      ? Object.values(data.recipientSelections).filter(Boolean)
      : [];
    createMessageMutation.mutate({ ...data, recipients: selections });
    reset();
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-w-2xl rounded-2xl bg-white">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">
            Send New Message
          </DialogTitle>
        </DialogHeader>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-6 max-h-[80vh] p-2  overflow-y-auto"
        >
          {/* Type */}
          <div>
            <label className="block text-sm font-medium text-muted-foreground mb-2">
              Message Type
            </label>
            <div className="grid grid-cols-2 gap-3">
              {messageTypes.map((type: any) => (
                <button
                  key={type.value}
                  type="button"
                  onClick={() => setValue("type", type.value)}
                  className={`flex flex-col items-center justify-center gap-1 p-4 rounded-xl border ${
                    watch("type") === type.value
                      ? "border-green-500 bg-green-50 text-green-700 font-medium"
                      : "border-gray-200 hover:border-gray-300 text-gray-700"
                  }`}
                >
                  <type.icon className="w-5 h-5" />
                  <span className="text-sm">{type.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-muted-foreground mb-1">
              Title
            </label>
            <Input
              {...register("title")}
              placeholder="Enter message title"
              className="bg-transparent"
            />
            {errors.title && (
              <p className="text-red-500 text-sm">{errors.title.message}</p>
            )}
          </div>

          {/* Tabs */}
          <Tabs
            defaultValue="write"
            onValueChange={(v) => setValue("contentMode", v)}
          >
            <TabsList className="grid w-full grid-cols-2 mb-3 bg-muted rounded-lg gap-4">
              <TabsTrigger value="write">Write Content</TabsTrigger>
              <TabsTrigger value="upload">Upload Content File</TabsTrigger>
            </TabsList>

            <TabsContent value="write">
              <label className="block text-sm font-medium mb-1">Content</label>
              <textarea
                {...register("content")}
                rows={6}
                placeholder="Type your message here..."
                className="w-full px-4 py-2 border rounded-lg focus:ring-green-500"
              />
              {errors.content && (
                <p className="text-red-500 text-sm">{errors.content.message}</p>
              )}
            </TabsContent>

            <TabsContent value="upload">
              <label className="block text-sm font-medium text-muted-foreground mb-1">
                Upload Content File
              </label>
              <div className="border border-dashed border-gray-300 rounded-lg p-4 text-center">
                <p className="text-sm text-gray-600 mb-2">
                  Upload your document (PDF, DOC, TXT)
                </p>
                <Input
                  type="file"
                  accept=".pdf,.doc,.docx,.txt"
                  {...register("contentFile")}
                />
                {errors.contentFile && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.contentFile.message}
                  </p>
                )}
              </div>
            </TabsContent>
          </Tabs>

          {/* Optional Attachment */}
          <div>
            <label className="block text-sm font-medium text-muted-foreground mb-1">
              Attachment (Optional)
            </label>
            <Input
              type="file"
              className="bg-transparent"
              onChange={(e) =>
                setValue("attachment", e.target.files?.[0] || null)
              }
              accept=".pdf,.doc,.docx,.txt,.jpg,.jpeg,.png"
              id="attachment-upload"
            />
            {attachment && (
              <p className="text-sm text-gray-600 mt-2 flex items-center">
                <FileText className="w-4 h-4 mr-1" />
                {attachment.name}
              </p>
            )}
          </div>

          {/* Recipients */}
          <div>
            <label className="block text-sm font-medium mb-1">Recipients</label>
            <p className="text-xs text-gray-500 mb-3">
              Select who should receive this message
            </p>
            <div className="grid grid-cols-2 gap-x-4 space-y-4">
              {recipientOptions.map((group: any) => (
                <div key={group.group}>
                  <label className="block text-sm font-medium mb-1">
                    {group.group}
                  </label>
                  <select
                    {...register(`recipientSelections.${group.group}` as const)}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-green-500"
                  >
                    <option value="">Select...</option>
                    {group.options.map((option: any) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
              ))}
            </div>
            {errors.recipients && (
              <p className="text-red-500 text-sm mt-1">
                {errors.recipients.message}
              </p>
            )}
          </div>

          {/* Footer */}
          <div className="flex justify-end gap-3 pt-6 border-t">
            <DialogClose asChild>
              <button
                type="button"
                className="px-6 py-2 bg-gray-100 rounded-lg"
              >
                Cancel
              </button>
            </DialogClose>
            <button
              type="submit"
              disabled={createMessageMutation.isPending}
              className="px-6 py-2 bg-green-600 text-white rounded-lg flex items-center disabled:opacity-50"
            >
              {createMessageMutation.isPending ? (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
              ) : (
                <Send className="w-4 h-4 mr-2" />
              )}
              Send
            </button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
