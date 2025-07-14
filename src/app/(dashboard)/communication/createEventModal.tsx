"use client";

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
  formData,
  setFormData,
  formErrors,
  messageTypes,
  handleFileUpload,
  handleRecipientToggle,
  handleSubmit,
  recipientOptions,
  createMessageMutation,
}: any) {
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-w-2xl rounded-2xl bg-white">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">
            Send New Message
          </DialogTitle>
        </DialogHeader>

        <form
          onSubmit={handleSubmit}
          className="space-y-6 max-h-[80vh] p-2  overflow-y-auto"
        >
          {/* Message Type */}
          <div>
            <label className="block text-sm font-medium text-muted-foreground mb-2">
              Message Type
            </label>
            <div className="grid grid-cols-2 gap-3">
              {messageTypes.map((type: any) => {
                const Icon = type.icon;
                const isActive = formData.type === type.value;
                return (
                  <button
                    key={type.value}
                    type="button"
                    onClick={() =>
                      setFormData((prev: any) => ({
                        ...prev,
                        type: type.value,
                      }))
                    }
                    className={`flex flex-col items-center justify-center gap-1 p-4 rounded-xl border transition-all ${
                      isActive
                        ? "border-green-500 bg-green-50 text-green-700 font-medium"
                        : "border-gray-200 hover:border-gray-300 text-gray-700"
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="text-sm">{type.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-muted-foreground mb-1">
              Title
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) =>
                setFormData((prev: any) => ({ ...prev, title: e.target.value }))
              }
              placeholder="Enter message title"
              className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                formErrors.title ? "border-red-500" : "border-gray-300"
              }`}
            />
            {formErrors.title && (
              <p className="text-red-500 text-sm mt-1">{formErrors.title}</p>
            )}
          </div>

          {/* Tabs for Content */}
          <Tabs
            defaultValue="write"
            onValueChange={(value) =>
              setFormData((prev: any) => ({ ...prev, contentMode: value }))
            }
          >
            <TabsList className="grid w-full grid-cols-2 mb-3 bg-muted rounded-lg">
              <TabsTrigger value="write">Write Content</TabsTrigger>
              <TabsTrigger value="upload">Upload File</TabsTrigger>
            </TabsList>

            <TabsContent value="write">
              <label className="block text-sm font-medium text-muted-foreground mb-1">
                Content
              </label>
              <textarea
                value={formData.content}
                onChange={(e) =>
                  setFormData((prev: any) => ({
                    ...prev,
                    content: e.target.value,
                  }))
                }
                rows={6}
                placeholder="Type your message here..."
                className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 ${
                  formErrors.content ? "border-red-500" : "border-gray-300"
                }`}
              />
              {formErrors.content && (
                <p className="text-red-500 text-sm mt-1">
                  {formErrors.content}
                </p>
              )}
            </TabsContent>

            <TabsContent value="upload">
              <label className="block text-sm font-medium text-muted-foreground mb-1">
                Upload Content File
              </label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                <Upload className="w-8 h-8 mx-auto text-gray-400 mb-2" />
                <p className="text-sm text-gray-600 mb-2">
                  Drop content file here or click to upload
                </p>
                <input
                  type="file"
                  onChange={handleFileUpload}
                  accept=".pdf,.doc,.docx,.txt"
                  className="hidden"
                  id="content-upload"
                />
                <label
                  htmlFor="content-upload"
                  className="cursor-pointer bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 text-sm"
                >
                  Choose File
                </label>
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
                setFormData((prev: any) => ({
                  ...prev,
                  attachment: e.target.files?.[0] || null,
                }))
              }
              accept=".pdf,.doc,.docx,.txt,.jpg,.jpeg,.png"
              id="attachment-upload"
            />
            {formData.attachment && (
              <p className="text-sm text-gray-600 mt-2 flex items-center">
                <FileText className="w-4 h-4 mr-1" />
                {formData.attachment.name}
              </p>
            )}
          </div>

          {/* Recipients */}
          <div>
            <label className="block text-sm font-medium text-muted-foreground mb-1">
              Recipients
            </label>
            <p className="text-xs text-gray-500 mb-3">
              Select who should receive this message. You can choose specific
              classes or all.
            </p>

            <div className=" grid grid-cols-2 gap-x-4 space-y-4">
              {recipientOptions.map((group: any) => (
                <div key={group.group}>
                  <label className="block text-sm font-medium text-gray-800 mb-1">
                    {group.group}
                  </label>
                  <select
                    value={formData.recipientSelections?.[group.group] || ""}
                    onChange={(e) =>
                      setFormData((prev: any) => ({
                        ...prev,
                        recipientSelections: {
                          ...prev.recipientSelections,
                          [group.group]: e.target.value,
                        },
                      }))
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  >
                    <option value="">Select...</option>
                    {group.options.map((option: string) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                </div>
              ))}
            </div>

            {formErrors.recipients && (
              <p className="text-red-500 text-sm mt-1">
                {formErrors.recipients}
              </p>
            )}
          </div>

          {/* Footer */}
          <div className="flex justify-end gap-3 pt-6 border-t">
            <DialogClose asChild>
              <button
                type="button"
                className="px-6 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
              >
                Cancel
              </button>
            </DialogClose>
            <button
              type="submit"
              disabled={createMessageMutation.isPending}
              className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center disabled:opacity-50"
            >
              {createMessageMutation.isPending ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                  Sending...
                </>
              ) : (
                <>
                  <Send className="w-4 h-4 mr-2" />
                  Send Message
                </>
              )}
            </button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
