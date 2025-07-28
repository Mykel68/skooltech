"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { z } from "zod";
import {
  Send,
  FileText,
  Upload,
  Users,
  MessageSquare,
  Calendar,
  Clock,
  CheckCircle,
  AlertCircle,
  Trash2,
  Edit3,
  Eye,
  X,
  Plus,
  Filter,
  Search,
  Download,
  Paperclip,
  Megaphone,
  Mail,
  BookOpen,
} from "lucide-react";
import { useState } from "react";
import CreateMessageDialog from "./createMessageDialog";
import { useUserStore } from "@/stores/userStore";
import { useClasses } from "../classes/useClass";
import axios from "axios";
import { getFileTypeLabel, isValidHttpUrl } from "@/utils/helper";

// ----------------------
// Zod schema and types
// ----------------------

const messageSchema = z.object({
  title: z
    .string()
    .min(1, "Title is required")
    .max(100, "Title must be less than 100 characters"),
  content: z
    .string()
    .min(1, "Content is required")
    .max(5000, "Content must be less than 5000 characters"),
  recipients: z
    .array(z.string())
    .min(1, "At least one recipient group is required"),
  type: z.enum(["announcement", "message", "urgent", "newsletter"]),
  priority: z.enum(["low", "medium", "high"]),
  attachment: z.any().optional(),
  scheduleDate: z.string().optional(),
});

export type MessageFormData = z.infer<typeof messageSchema>;

export interface Message {
  id: number;
  title: string;
  content: string;
  recipients: string[];
  type: "announcement" | "message" | "urgent" | "newsletter";
  priority: "low" | "medium" | "high";
  status: string;
  createdAt: string;
  sentAt: string;
  author: string;
  hasAttachment: boolean;
  attachmentName?: string;
  recipientCount: number;
  readCount: number;
}

type ExtendedFormData = MessageFormData & {
  recipientSelections?: Record<string, string>;
};

type FormErrors = Partial<Record<keyof MessageFormData, string>>;

// ----------------------
// Component
// ----------------------

const CommunicationCenter = () => {
  const [showCreateModal, setShowCreateModal] = useState<boolean>(false);
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);
  const [filterType, setFilterType] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const queryClient = useQueryClient();
  const schoolId = useUserStore((s) => s.schoolId!);
  const sessionId = useUserStore((s) => s.session_id!);
  const termId = useUserStore((s) => s.term_id!);

  const [formData, setFormData] = useState<ExtendedFormData>({
    title: "",
    content: "",
    recipients: [],
    type: "announcement",
    priority: "medium",
    attachment: null,
    scheduleDate: "",
    recipientSelections: {}, // <-- now defined
  });

  const [formErrors, setFormErrors] = useState<FormErrors>({});

  // ----------------------
  // React Query
  // ----------------------
  const {
    data: messages = [],
    isLoading,
    error,
  } = useQuery<Message[]>({
    queryKey: ["messages", schoolId],
    enabled: !!schoolId,
    queryFn: async () => {
      const { data } = await axios.get(`/api/message/get/${schoolId}`);
      const apiMessages = data?.data?.messages ?? [];

      return apiMessages.map((apiMsg: any, index: number) => {
        let recipients: string[] = [];

        // if (apiMsg.class_id) {
        //   // It's a targeted class message
        //   recipients = [apiMsg.class_id];
        // } else if (apiMsg.target_role) {
        //   recipients = [`all-${apiMsg.target_role.toLowerCase()}`];
        // }

        // target_description is recipient
        if (apiMsg.target_description) {
          recipients = [apiMsg.target_description];
        }

        return {
          id: apiMsg.message_id ?? index,
          title: apiMsg.title ?? "Untitled",
          content: apiMsg.content ?? "",
          recipients,
          type: apiMsg.message_type ?? "message",
          priority: "medium", // default or adapt if you add it to your API
          status: apiMsg.status ?? "sent",
          createdAt: apiMsg.created_at ?? new Date().toISOString(),
          sentAt: apiMsg.sent_at ?? new Date().toISOString(),
          author: "Admin", // default until your API adds author
          hasAttachment: apiMsg.has_attachment ?? false,
          attachmentName: apiMsg.attachment_name ?? "",
          recipientCount: apiMsg.recipient_count ?? 0,
          readCount: apiMsg.read_count ?? 0,
          target_description: apiMsg.target_description ?? "",
        };
      });
    },
  });

  const { data: classes = [] } = useClasses(schoolId, sessionId, termId);

  const createMessageMutation = useMutation<Message, Error, MessageFormData>({
    mutationFn: async (newMessage) => {
      if (!newMessage.recipients || newMessage.recipients.length === 0) {
        throw new Error("No recipients selected");
      }

      const rawRecipient = newMessage.recipients[0]; // assuming single target for simplicity
      const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

      let target_role: "Student" | "Teacher" | "Parent" | "All" = "All";
      let class_id: string | undefined = undefined;

      if (rawRecipient.startsWith("all-")) {
        target_role = capitalize(rawRecipient.split("-")[1]) as
          | "Student"
          | "Teacher"
          | "Parent"
          | "All";
      } else {
        target_role = "Student"; // or infer it some other way
        class_id = rawRecipient;
      }

      const payload = {
        school_id: schoolId,
        title: newMessage.title,
        content: newMessage.content,
        message_type: newMessage.type,
        target_role,
        class_id,
        attachment: newMessage.attachment ?? null,
      };

      const { data } = await axios.post<Message>(
        `/api/message/new/${schoolId}`,
        payload
      );

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["messages", schoolId] });
      toast.success("Message sent successfully!");
      setShowCreateModal(false);
      resetForm();
    },
    onError: () => {
      toast.error("Failed to send message. Please try again.");
    },
  });

  const deleteMessageMutation = useMutation<number, Error, number>({
    mutationFn: async (messageId) => {
      await axios.delete(`/api/message/remove/${messageId}`);
      return messageId;
    },
    onSuccess: (messageId) => {
      queryClient.setQueryData<Message[]>(["messages", schoolId], (old = []) =>
        old.filter((msg) => msg.id !== messageId)
      );
      toast.success("Message deleted successfully!");
    },

    onError: () => {
      toast.error("Failed to delete message. Please try again.");
    },
  });

  // ----------------------
  // Recipients and Types
  // ----------------------

  const recipientOptions = [
    {
      group: "Students",
      options: [
        { label: "All Students", value: "all-students" },
        ...classes.map((cls) => ({
          label: `${cls.grade_level} Students`,
          value: cls.class_id,
        })),
      ],
    },
    {
      group: "Parents",
      options: [
        { label: "All Parents", value: "all-parents" },
        ...classes.map((cls) => ({
          label: `${cls.grade_level} Parents`,
          value: cls.class_id,
        })),
      ],
    },
    {
      group: "Teachers",
      options: [
        { label: "All Teachers", value: "all-teachers" },
        ...classes.map((cls) => ({
          label: `${cls.grade_level} Teachers`,
          value: cls.class_id,
        })),
      ],
    },
  ];

  const messageTypes = [
    {
      value: "announcement",
      label: "Announcement",
      icon: Megaphone,
      color: "blue",
    },
    {
      value: "message",
      label: "General Message",
      icon: MessageSquare,
      color: "green",
    },
    {
      value: "urgent",
      label: "Urgent Notice",
      icon: AlertCircle,
      color: "red",
    },
    { value: "newsletter", label: "Newsletter", icon: Mail, color: "purple" },
  ];

  // ----------------------
  // Helpers
  // ----------------------

  const resetForm = () => {
    setFormData({
      title: "",
      content: "",
      recipients: [],
      type: "announcement",
      priority: "medium",
      attachment: null,
      scheduleDate: "",
    });
    setFormErrors({});
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Extract recipients from recipientSelections
    const recipientsFromSelections = Object.values(
      formData.recipientSelections || {}
    ).filter((val: any) => val && val.trim() !== "");

    const submissionData = {
      ...formData,
      recipients: recipientsFromSelections,
    };

    // Validate with Zod
    try {
      messageSchema.parse(submissionData);
      setFormErrors({});
      createMessageMutation.mutate(submissionData as MessageFormData);
    } catch (error: any) {
      if (error?.errors) {
        const errors: FormErrors = {};
        error.errors.forEach((err: any) => {
          errors[err.path[0] as keyof MessageFormData] = err.message;
        });
        setFormErrors(errors);
      }
    }
  };

  const handleRecipientToggle = (recipient: string) => {
    setFormData((prev) => ({
      ...prev,
      recipients: prev.recipients.includes(recipient)
        ? prev.recipients.filter((r) => r !== recipient)
        : [...prev.recipients, recipient],
    }));
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        toast.error("File size must be less than 10MB");
        return;
      }
      setFormData((prev) => ({ ...prev, attachment: file }));
      toast.success("File uploaded successfully");
    }
  };

  const getTypeColor = (type: Message["type"]) => {
    const colors: Record<Message["type"], string> = {
      announcement: "bg-blue-100 text-blue-800",
      message: "bg-green-100 text-green-800",
      urgent: "bg-red-100 text-red-800",
      newsletter: "bg-purple-100 text-purple-800",
    };
    return colors[type];
  };

  const getPriorityColor = (priority: Message["priority"]) => {
    const colors: Record<Message["priority"], string> = {
      low: "bg-green-100 text-green-800",
      medium: "bg-yellow-100 text-yellow-800",
      high: "bg-red-100 text-red-800",
    };
    return colors[priority];
  };

  const filteredMessages = messages.filter((msg) => {
    const matchesFilter = filterType === "all" || msg.type === filterType;
    const matchesSearch =
      msg.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      msg.content.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const EmptyState = () => (
    <div className="text-center py-16">
      <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
        <MessageSquare className="w-12 h-12 text-gray-400" />
      </div>
      <h3 className="text-xl font-semibold text-gray-900 mb-2">
        No messages yet
      </h3>
      <p className="text-gray-600 mb-6 max-w-md mx-auto">
        Start communicating with your school community by sending your first
        announcement or message.
      </p>
      <button
        onClick={() => setShowCreateModal(true)}
        className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors flex items-center mx-auto"
      >
        <Plus className="w-5 h-5 mr-2" />
        Send First Message
      </button>
    </div>
  );

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading messages...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen ">
      {/* Header */}
      <div className="   ">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <Megaphone className="w-8 h-8 text-green-600 mr-3" />
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  Communication Center
                </h1>
                <p className="text-sm text-gray-600">
                  Broadcast messages to your school community
                </p>
              </div>
            </div>
            <button
              onClick={() => setShowCreateModal(true)}
              className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center"
            >
              <Plus className="w-4 h-4 mr-2" />
              New Message
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filters and Search */}
        <div className="mb-6 flex flex-col sm:flex-row gap-4 items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="relative">
              <Search className="w-5 h-5 absolute left-3 top-3 text-gray-400" />
              <input
                type="text"
                placeholder="Search messages..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 w-64"
              />
            </div>
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              <option value="all">All Types</option>
              {messageTypes.map((type) => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-2 text-sm text-gray-600">
            <span>{filteredMessages.length} messages</span>
          </div>
        </div>

        {/* Messages List */}
        {filteredMessages.length === 0 ? (
          <EmptyState />
        ) : (
          <div className="space-y-4">
            {filteredMessages.map((message) => (
              <div
                key={message.id}
                className="bg-white rounded-lg shadow-sm border p-6 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <h3 className="text-lg font-semibold text-gray-900">
                        {message.title}
                      </h3>
                      <span
                        className={`px-2 py-1 text-xs font-medium rounded-full ${getTypeColor(
                          message.type
                        )}`}
                      >
                        {
                          messageTypes.find((t) => t.value === message.type)
                            ?.label
                        }
                      </span>
                      <span
                        className={`px-2 py-1 text-xs font-medium rounded-full ${getPriorityColor(
                          message.priority
                        )}`}
                      >
                        {message.priority} priority
                      </span>
                      {message.hasAttachment && (
                        <span className="flex items-center text-xs text-gray-500">
                          <Paperclip className="w-3 h-3 mr-1" />
                          Attachment
                        </span>
                      )}
                    </div>

                    {isValidHttpUrl(message.content) ? (
                      <span className="text-green-600 underline">
                        [{getFileTypeLabel(message.content)}]
                      </span>
                    ) : (
                      <p className="text-gray-600 mb-4 line-clamp-2">
                        {message.content}
                      </p>
                    )}

                    <div className="flex items-center gap-6 text-sm text-gray-500 mb-3">
                      <div className="flex items-center">
                        <Clock className="w-4 h-4 mr-1" />
                        {new Date(message.createdAt).toLocaleDateString()}
                      </div>
                      <div className="flex items-center">
                        <Users className="w-4 h-4 mr-1" />
                        {message.recipientCount} recipients
                      </div>
                      <div className="flex items-center">
                        <Eye className="w-4 h-4 mr-1" />
                        {message.readCount} read
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      {message.recipients.map((recipient) => (
                        <span
                          key={recipient}
                          className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded"
                        >
                          {recipient}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 ml-4">
                    <button
                      onClick={() => setSelectedMessage(message)}
                      className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    <button className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors">
                      <Edit3 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => deleteMessageMutation.mutate(message.id)}
                      className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Create Message Modal */}
      {showCreateModal && (
        <CreateMessageDialog
          open={showCreateModal}
          setOpen={setShowCreateModal}
          formData={formData}
          setFormData={setFormData}
          formErrors={formErrors}
          messageTypes={messageTypes}
          handleFileUpload={handleFileUpload}
          handleRecipientToggle={handleRecipientToggle}
          handleSubmit={handleSubmit}
          recipientOptions={recipientOptions}
          createMessageMutation={createMessageMutation}
        />
      )}

      {/* Message Detail Modal */}
      {selectedMessage && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-900">
                  {selectedMessage.title}
                </h2>
                <button
                  onClick={() => setSelectedMessage(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>

            <div className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <span
                  className={`px-3 py-1 text-sm font-medium rounded-full ${getTypeColor(
                    selectedMessage.type
                  )}`}
                >
                  {
                    messageTypes.find((t) => t.value === selectedMessage.type)
                      ?.label
                  }
                </span>
                <span
                  className={`px-3 py-1 text-sm font-medium rounded-full ${getPriorityColor(
                    selectedMessage.priority
                  )}`}
                >
                  {selectedMessage.priority} priority
                </span>
              </div>

              <div className="mt-4">
                {isValidHttpUrl(selectedMessage.content) ? (
                  renderPreview(selectedMessage.content)
                ) : (
                  <p className="text-gray-700 whitespace-pre-wrap">
                    {selectedMessage.content}
                  </p>
                )}
              </div>

              {/* {selectedMessage.hasAttachment && (
                <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <FileText className="w-5 h-5 text-gray-400 mr-2" />
                      <span className="text-sm text-gray-700">
                        {selectedMessage.attachmentName}
                      </span>
                    </div>
                    <button className="text-green-600 hover:text-green-800 text-sm flex items-center">
                      <Download className="w-4 h-4 mr-1" />
                      Download
                    </button>
                  </div>
                </div>
              )} */}

              {selectedMessage.hasAttachment &&
                selectedMessage.attachmentName && (
                  <div className="mt-6 p-4 bg-gray-50 rounded-lg space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <FileText className="w-5 h-5 text-gray-400 mr-2" />
                        <span className="text-sm text-gray-700 break-all">
                          {selectedMessage.attachmentName}
                        </span>
                      </div>
                    </div>

                    {selectedMessage.attachmentName.startsWith("http") ? (
                      <>
                        {/* Show preview for images */}
                        {/\.(jpg|jpeg|png|gif|webp)$/i.test(
                          selectedMessage.attachmentName
                        ) ? (
                          <img
                            src={selectedMessage.attachmentName}
                            alt="attachment"
                            className="w-full rounded-lg border"
                          />
                        ) : (
                          <a
                            href={selectedMessage.attachmentName}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-green-600 hover:underline text-sm"
                          >
                            View Attachment
                          </a>
                        )}
                      </>
                    ) : (
                      <a
                        href={`/api/message/download/${selectedMessage.id}`}
                        className="text-green-600 hover:underline text-sm flex items-center"
                      >
                        <Download className="w-4 h-4 mr-1" />
                        Download
                      </a>
                    )}
                  </div>
                )}

              <div className="mt-6 pt-6 border-t">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-500">Sent to:</span>
                    <div className="mt-1 flex flex-wrap gap-1">
                      {selectedMessage.recipients.map((recipient) => (
                        <span
                          key={recipient}
                          className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded"
                        >
                          {recipient}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div>
                    <span className="text-gray-500">Statistics:</span>
                    <div className="mt-1 space-y-1">
                      <div>{selectedMessage.recipientCount} recipients</div>
                      <div>{selectedMessage.readCount} read</div>
                      <div>
                        Sent on{" "}
                        {new Date(selectedMessage.sentAt).toLocaleString()}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const renderPreview = (url: string) => {
  const extension = url.split(".").pop()?.toLowerCase();

  if (!extension) return null;

  if (["jpg", "jpeg", "png", "webp", "gif"].includes(extension)) {
    return (
      <img
        src={url}
        alt="attachment"
        className="max-w-full rounded-lg border"
      />
    );
  }

  if (extension === "pdf") {
    return (
      <iframe
        src={url}
        className="w-full h-[500px] border rounded-lg"
        title="PDF Viewer"
      />
    );
  }

  if (["doc", "docx", "ppt", "pptx", "xls", "xlsx"].includes(extension)) {
    return (
      <iframe
        src={`https://view.officeapps.live.com/op/embed.aspx?src=${encodeURIComponent(
          url
        )}`}
        className="w-full h-[500px] border rounded-lg"
        title="Office Document Viewer"
      />
    );
  }

  // Default fallback
  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="text-green-600 hover:underline break-all"
    >
      {url}
    </a>
  );
};

export default CommunicationCenter;
