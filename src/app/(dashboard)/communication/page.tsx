"use client";

import React, { useState } from "react";
import {
  Calendar,
  Users,
  FileText,
  Send,
  Plus,
  Edit3,
  Trash2,
  Eye,
  Clock,
  CheckCircle,
  AlertCircle,
  Upload,
  Download,
} from "lucide-react";

const CommunicationCenter = () => {
  const [activeTab, setActiveTab] = useState("events");
  const [showCreateEvent, setShowCreateEvent] = useState(false);
  const [showCreateNewsletter, setShowCreateNewsletter] = useState(false);
  const [events, setEvents] = useState([
    {
      id: 1,
      title: "Annual Sports Day",
      description:
        "Join us for our annual sports day celebration with various competitions and activities.",
      date: "2024-08-15",
      time: "09:00",
      location: "Main Sports Ground",
      recipients: ["All Parents", "All Students", "All Teachers"],
      status: "sent",
      sentDate: "2024-07-20",
      priority: "high",
    },
    {
      id: 2,
      title: "Parent-Teacher Meeting",
      description:
        "Scheduled meetings to discuss student progress and academic performance.",
      date: "2024-08-10",
      time: "14:00",
      location: "Respective Classrooms",
      recipients: ["Grade 5 Parents", "Grade 5 Teachers"],
      status: "draft",
      priority: "medium",
    },
  ]);

  const [newsletters, setNewsletters] = useState([
    {
      id: 1,
      title: "Monthly Newsletter - July 2024",
      content:
        "Dear Parents,\n\nWe hope this message finds you well. Here are the highlights from this month...",
      recipients: ["All Parents"],
      status: "sent",
      sentDate: "2024-07-01",
      hasAttachment: true,
      attachmentName: "july_newsletter.pdf",
    },
    {
      id: 2,
      title: "Academic Calendar Update",
      content:
        "Important updates regarding the upcoming academic calendar changes...",
      recipients: ["All Parents", "All Teachers"],
      status: "draft",
      hasAttachment: false,
    },
  ]);

  const [eventForm, setEventForm] = useState({
    title: "",
    description: "",
    date: "",
    time: "",
    location: "",
    recipients: [],
    priority: "medium",
  });

  const [newsletterForm, setNewsletterForm] = useState({
    title: "",
    content: "",
    recipients: [],
    attachment: null,
  });

  const recipientOptions = [
    {
      group: "Parents",
      options: [
        "All Parents",
        "Grade 1 Parents",
        "Grade 2 Parents",
        "Grade 3 Parents",
        "Grade 4 Parents",
        "Grade 5 Parents",
      ],
    },
    {
      group: "Students",
      options: [
        "All Students",
        "Grade 1 Students",
        "Grade 2 Students",
        "Grade 3 Students",
        "Grade 4 Students",
        "Grade 5 Students",
      ],
    },
    {
      group: "Teachers",
      options: [
        "All Teachers",
        "Grade 1 Teachers",
        "Grade 2 Teachers",
        "Grade 3 Teachers",
        "Grade 4 Teachers",
        "Grade 5 Teachers",
        "Subject Teachers",
      ],
    },
  ];

  const handleCreateEvent = () => {
    if (eventForm.title && eventForm.date && eventForm.recipients.length > 0) {
      const newEvent = {
        id: Date.now(),
        ...eventForm,
        status: "sent",
        sentDate: new Date().toISOString().split("T")[0],
      };
      setEvents([newEvent, ...events]);
      setEventForm({
        title: "",
        description: "",
        date: "",
        time: "",
        location: "",
        recipients: [],
        priority: "medium",
      });
      setShowCreateEvent(false);
    }
  };

  const handleCreateNewsletter = () => {
    if (
      newsletterForm.title &&
      newsletterForm.content &&
      newsletterForm.recipients.length > 0
    ) {
      const newNewsletter = {
        id: Date.now(),
        ...newsletterForm,
        status: "sent",
        sentDate: new Date().toISOString().split("T")[0],
        hasAttachment: !!newsletterForm.attachment,
        attachmentName: newsletterForm.attachment?.name || null,
      };
      setNewsletters([newNewsletter, ...newsletters]);
      setNewsletterForm({
        title: "",
        content: "",
        recipients: [],
        attachment: null,
      });
      setShowCreateNewsletter(false);
    }
  };

  const handleRecipientToggle = (recipient, isEvent = true) => {
    const form = isEvent ? eventForm : newsletterForm;
    const setForm = isEvent ? setEventForm : setNewsletterForm;
    const field = "recipients";

    const currentRecipients = form[field];
    const newRecipients = currentRecipients.includes(recipient)
      ? currentRecipients.filter((r) => r !== recipient)
      : [...currentRecipients, recipient];

    setForm({ ...form, [field]: newRecipients });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "sent":
        return "text-green-600 bg-green-50";
      case "draft":
        return "text-yellow-600 bg-yellow-50";
      case "scheduled":
        return "text-blue-600 bg-blue-50";
      default:
        return "text-gray-600 bg-gray-50";
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "high":
        return "text-red-600 bg-red-50";
      case "medium":
        return "text-yellow-600 bg-yellow-50";
      case "low":
        return "text-green-600 bg-green-50";
      default:
        return "text-gray-600 bg-gray-50";
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Communication Center
              </h1>
              <p className="text-gray-600 mt-1">
                Send events and newsletters to parents, students, and teachers
              </p>
            </div>
            <div className="flex space-x-3">
              <button
                onClick={() => setShowCreateEvent(true)}
                className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Plus className="w-4 h-4 mr-2" />
                Create Event
              </button>
              <button
                onClick={() => setShowCreateNewsletter(true)}
                className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                <FileText className="w-4 h-4 mr-2" />
                Create Newsletter
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        {/* Tabs */}
        <div className="flex space-x-1 mb-6">
          <button
            onClick={() => setActiveTab("events")}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              activeTab === "events"
                ? "bg-blue-600 text-white"
                : "bg-white text-gray-700 hover:bg-gray-50"
            }`}
          >
            <Calendar className="w-4 h-4 inline mr-2" />
            Events
          </button>
          <button
            onClick={() => setActiveTab("newsletters")}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              activeTab === "newsletters"
                ? "bg-blue-600 text-white"
                : "bg-white text-gray-700 hover:bg-gray-50"
            }`}
          >
            <FileText className="w-4 h-4 inline mr-2" />
            Newsletters
          </button>
        </div>

        {/* Events Tab */}
        {activeTab === "events" && (
          <div className="space-y-4">
            {events.map((event) => (
              <div
                key={event.id}
                className="bg-white rounded-lg shadow-sm border p-6"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="text-lg font-semibold text-gray-900">
                        {event.title}
                      </h3>
                      <span
                        className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(
                          event.status
                        )}`}
                      >
                        {event.status}
                      </span>
                      <span
                        className={`px-2 py-1 text-xs font-medium rounded-full ${getPriorityColor(
                          event.priority
                        )}`}
                      >
                        {event.priority} priority
                      </span>
                    </div>
                    <p className="text-gray-600 mb-3">{event.description}</p>
                    <div className="flex items-center space-x-6 text-sm text-gray-500 mb-3">
                      <div className="flex items-center">
                        <Calendar className="w-4 h-4 mr-1" />
                        {event.date}
                      </div>
                      <div className="flex items-center">
                        <Clock className="w-4 h-4 mr-1" />
                        {event.time}
                      </div>
                      <div className="flex items-center">
                        <Users className="w-4 h-4 mr-1" />
                        {event.location}
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-2 mb-3">
                      {event.recipients.map((recipient) => (
                        <span
                          key={recipient}
                          className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded"
                        >
                          {recipient}
                        </span>
                      ))}
                    </div>
                    {event.sentDate && (
                      <p className="text-xs text-gray-500">
                        Sent on {event.sentDate}
                      </p>
                    )}
                  </div>
                  <div className="flex items-center space-x-2">
                    <button className="p-2 text-gray-400 hover:text-gray-600">
                      <Eye className="w-4 h-4" />
                    </button>
                    <button className="p-2 text-gray-400 hover:text-gray-600">
                      <Edit3 className="w-4 h-4" />
                    </button>
                    <button className="p-2 text-gray-400 hover:text-red-600">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Newsletters Tab */}
        {activeTab === "newsletters" && (
          <div className="space-y-4">
            {newsletters.map((newsletter) => (
              <div
                key={newsletter.id}
                className="bg-white rounded-lg shadow-sm border p-6"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="text-lg font-semibold text-gray-900">
                        {newsletter.title}
                      </h3>
                      <span
                        className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(
                          newsletter.status
                        )}`}
                      >
                        {newsletter.status}
                      </span>
                      {newsletter.hasAttachment && (
                        <span className="px-2 py-1 text-xs font-medium rounded-full text-purple-600 bg-purple-50">
                          Has Attachment
                        </span>
                      )}
                    </div>
                    <p className="text-gray-600 mb-3 line-clamp-3">
                      {newsletter.content}
                    </p>
                    <div className="flex flex-wrap gap-2 mb-3">
                      {newsletter.recipients.map((recipient) => (
                        <span
                          key={recipient}
                          className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded"
                        >
                          {recipient}
                        </span>
                      ))}
                    </div>
                    {newsletter.hasAttachment && (
                      <div className="flex items-center text-sm text-gray-500 mb-2">
                        <FileText className="w-4 h-4 mr-1" />
                        {newsletter.attachmentName}
                      </div>
                    )}
                    {newsletter.sentDate && (
                      <p className="text-xs text-gray-500">
                        Sent on {newsletter.sentDate}
                      </p>
                    )}
                  </div>
                  <div className="flex items-center space-x-2">
                    <button className="p-2 text-gray-400 hover:text-gray-600">
                      <Eye className="w-4 h-4" />
                    </button>
                    <button className="p-2 text-gray-400 hover:text-gray-600">
                      <Edit3 className="w-4 h-4" />
                    </button>
                    <button className="p-2 text-gray-400 hover:text-red-600">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Create Event Modal */}
      {showCreateEvent && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold">Create Event</h2>
              <button
                onClick={() => setShowCreateEvent(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Event Title
                </label>
                <input
                  type="text"
                  value={eventForm.title}
                  onChange={(e) =>
                    setEventForm({ ...eventForm, title: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter event title"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  value={eventForm.description}
                  onChange={(e) =>
                    setEventForm({ ...eventForm, description: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows="4"
                  placeholder="Enter event description"
                />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Date
                  </label>
                  <input
                    type="date"
                    value={eventForm.date}
                    onChange={(e) =>
                      setEventForm({ ...eventForm, date: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Time
                  </label>
                  <input
                    type="time"
                    value={eventForm.time}
                    onChange={(e) =>
                      setEventForm({ ...eventForm, time: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Priority
                  </label>
                  <select
                    value={eventForm.priority}
                    onChange={(e) =>
                      setEventForm({ ...eventForm, priority: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Location
                </label>
                <input
                  type="text"
                  value={eventForm.location}
                  onChange={(e) =>
                    setEventForm({ ...eventForm, location: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter event location"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Recipients
                </label>
                <div className="border border-gray-300 rounded-lg p-3 max-h-48 overflow-y-auto">
                  {recipientOptions.map((group) => (
                    <div key={group.group} className="mb-4">
                      <h4 className="font-medium text-gray-800 mb-2">
                        {group.group}
                      </h4>
                      <div className="space-y-2">
                        {group.options.map((option) => (
                          <label key={option} className="flex items-center">
                            <input
                              type="checkbox"
                              checked={eventForm.recipients.includes(option)}
                              onChange={() =>
                                handleRecipientToggle(option, true)
                              }
                              className="mr-2"
                            />
                            <span className="text-sm text-gray-700">
                              {option}
                            </span>
                          </label>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => setShowCreateEvent(false)}
                className="px-4 py-2 text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateEvent}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center"
              >
                <Send className="w-4 h-4 mr-2" />
                Send Event
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Create Newsletter Modal */}
      {showCreateNewsletter && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold">Create Newsletter</h2>
              <button
                onClick={() => setShowCreateNewsletter(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Newsletter Title
                </label>
                <input
                  type="text"
                  value={newsletterForm.title}
                  onChange={(e) =>
                    setNewsletterForm({
                      ...newsletterForm,
                      title: e.target.value,
                    })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter newsletter title"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Content
                </label>
                <textarea
                  value={newsletterForm.content}
                  onChange={(e) =>
                    setNewsletterForm({
                      ...newsletterForm,
                      content: e.target.value,
                    })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows="8"
                  placeholder="Write your newsletter content here..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Attachment (Optional)
                </label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                  <Upload className="w-8 h-8 mx-auto text-gray-400 mb-2" />
                  <p className="text-sm text-gray-600">
                    Drop files here or click to upload
                  </p>
                  <input
                    type="file"
                    accept=".pdf,.doc,.docx"
                    onChange={(e) =>
                      setNewsletterForm({
                        ...newsletterForm,
                        attachment: e.target.files[0],
                      })
                    }
                    className="hidden"
                  />
                </div>
                {newsletterForm.attachment && (
                  <p className="text-sm text-gray-600 mt-2">
                    Selected: {newsletterForm.attachment.name}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Recipients
                </label>
                <div className="border border-gray-300 rounded-lg p-3 max-h-48 overflow-y-auto">
                  {recipientOptions.map((group) => (
                    <div key={group.group} className="mb-4">
                      <h4 className="font-medium text-gray-800 mb-2">
                        {group.group}
                      </h4>
                      <div className="space-y-2">
                        {group.options.map((option) => (
                          <label key={option} className="flex items-center">
                            <input
                              type="checkbox"
                              checked={newsletterForm.recipients.includes(
                                option
                              )}
                              onChange={() =>
                                handleRecipientToggle(option, false)
                              }
                              className="mr-2"
                            />
                            <span className="text-sm text-gray-700">
                              {option}
                            </span>
                          </label>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => setShowCreateNewsletter(false)}
                className="px-4 py-2 text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateNewsletter}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center"
              >
                <Send className="w-4 h-4 mr-2" />
                Send Newsletter
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CommunicationCenter;
