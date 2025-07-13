"use client";

import React, { useState } from "react";
import {
  Calendar,
  Users,
  FileText,
  Plus,
  Edit3,
  Trash2,
  Eye,
  Clock,
  MapPin,
  AlertCircle,
  CheckCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Event,
  Newsletter,
  EventFormData,
  NewsletterFormData,
  RecipientGroup,
  Priority,
  Status,
} from "./types";
import CreateEventModal from "./createEventModal";
import CreateNewsletterModal from "./createNewsletterModal";

const CommunicationCenter: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>("events");
  const [showCreateEvent, setShowCreateEvent] = useState<boolean>(false);
  const [showCreateNewsletter, setShowCreateNewsletter] =
    useState<boolean>(false);

  const [events, setEvents] = useState<Event[]>([
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

  const [newsletters, setNewsletters] = useState<Newsletter[]>([
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

  const [eventForm, setEventForm] = useState<EventFormData>({
    title: "",
    description: "",
    date: "",
    time: "",
    location: "",
    recipients: [],
    priority: "medium",
  });

  const [newsletterForm, setNewsletterForm] = useState<NewsletterFormData>({
    title: "",
    content: "",
    recipients: [],
    attachment: null,
  });

  const recipientOptions: RecipientGroup[] = [
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

  const handleCreateEvent = (): void => {
    if (eventForm.title && eventForm.date && eventForm.recipients.length > 0) {
      const newEvent: Event = {
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

  const handleCreateNewsletter = (): void => {
    if (
      newsletterForm.title &&
      newsletterForm.content &&
      newsletterForm.recipients.length > 0
    ) {
      const newNewsletter: Newsletter = {
        id: Date.now(),
        ...newsletterForm,
        status: "sent",
        sentDate: new Date().toISOString().split("T")[0],
        hasAttachment: !!newsletterForm.attachment,
        attachmentName: newsletterForm.attachment?.name || undefined,
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

  const handleRecipientToggle = (recipient: string, isEvent: boolean): void => {
    if (isEvent) {
      const currentRecipients = eventForm.recipients;
      const newRecipients = currentRecipients.includes(recipient)
        ? currentRecipients.filter((r) => r !== recipient)
        : [...currentRecipients, recipient];
      setEventForm({ ...eventForm, recipients: newRecipients });
    } else {
      const currentRecipients = newsletterForm.recipients;
      const newRecipients = currentRecipients.includes(recipient)
        ? currentRecipients.filter((r) => r !== recipient)
        : [...currentRecipients, recipient];
      setNewsletterForm({ ...newsletterForm, recipients: newRecipients });
    }
  };

  const getStatusVariant = (
    status: Status
  ):
    | "default"
    | "secondary"
    | "outline"
    | "destructive"
    | "success"
    | "warning"
    | "info" => {
    switch (status) {
      case "sent":
        return "success";
      case "draft":
        return "secondary";
      case "scheduled":
        return "default";
      default:
        return "outline";
    }
  };

  const getPriorityVariant = (
    priority: Priority
  ):
    | "default"
    | "secondary"
    | "outline"
    | "destructive"
    | "success"
    | "warning"
    | "info" => {
    switch (priority) {
      case "high":
        return "destructive";
      case "medium":
        return "warning";
      case "low":
        return "default";
      default:
        return "default";
    }
  };

  const StatusIcon: React.FC<{ status: Status }> = ({ status }) => {
    switch (status) {
      case "sent":
        return <CheckCircle className="h-4 w-4" />;
      case "draft":
        return <Edit3 className="h-4 w-4" />;
      case "scheduled":
        return <Clock className="h-4 w-4" />;
      default:
        return <AlertCircle className="h-4 w-4" />;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="">
        <div className="container mx-auto px-6 py-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-foreground">
                Communication Center
              </h1>
              <p className="text-muted-foreground mt-2">
                Send events and newsletters to parents, students, and teachers
              </p>
            </div>
            <div className="flex gap-3">
              <Button
                onClick={() => setShowCreateEvent(true)}
                variant="default"
              >
                <Plus className="h-4 w-4 mr-2" />
                Create Event
              </Button>
              <Button
                onClick={() => setShowCreateNewsletter(true)}
                variant="destructive"
              >
                <Plus className="h-4 w-4 mr-2" />
                Create Newsletter
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto p-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="events" className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Events
            </TabsTrigger>
            <TabsTrigger
              value="newsletters"
              className="flex items-center gap-2"
            >
              <FileText className="h-4 w-4" />
              Newsletters
            </TabsTrigger>
          </TabsList>

          <TabsContent value="events" className="space-y-4">
            {events.map((event) => (
              <Card
                key={event.id}
                className="hover:shadow-md transition-shadow"
              >
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="space-y-2">
                      <div className="flex items-center gap-3">
                        <CardTitle className="text-lg">{event.title}</CardTitle>
                        <Badge
                          variant={getStatusVariant(event.status)}
                          className="flex items-center gap-1"
                        >
                          <StatusIcon status={event.status} />
                          {event.status}
                        </Badge>
                        <Badge variant={getPriorityVariant(event.priority)}>
                          {event.priority} priority
                        </Badge>
                      </div>
                      <p className="text-muted-foreground">
                        {event.description}
                      </p>
                    </div>
                    <div className="flex items-center gap-1">
                      <Button variant="ghost" size="icon">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon">
                        <Edit3 className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="flex items-center gap-6 text-sm text-muted-foreground mb-4">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      {event.date}
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      {event.time}
                    </div>
                    <div className="flex items-center gap-1">
                      <MapPin className="h-4 w-4" />
                      {event.location}
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2 mb-3">
                    {event.recipients.map((recipient) => (
                      <Badge key={recipient} variant="outline">
                        <Users className="h-3 w-3 mr-1" />
                        {recipient}
                      </Badge>
                    ))}
                  </div>
                  {event.sentDate && (
                    <p className="text-xs text-muted-foreground">
                      Sent on {event.sentDate}
                    </p>
                  )}
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          <TabsContent value="newsletters" className="space-y-4">
            {newsletters.map((newsletter) => (
              <Card
                key={newsletter.id}
                className="hover:shadow-md transition-shadow"
              >
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="space-y-2">
                      <div className="flex items-center gap-3">
                        <CardTitle className="text-lg">
                          {newsletter.title}
                        </CardTitle>
                        <Badge
                          variant={getStatusVariant(newsletter.status)}
                          className="flex items-center gap-1"
                        >
                          <StatusIcon status={newsletter.status} />
                          {newsletter.status}
                        </Badge>
                        {newsletter.hasAttachment && (
                          <Badge variant="secondary">
                            <FileText className="h-3 w-3 mr-1" />
                            Attachment
                          </Badge>
                        )}
                      </div>
                      <p className="text-muted-foreground line-clamp-3">
                        {newsletter.content}
                      </p>
                    </div>
                    <div className="flex items-center gap-1">
                      <Button variant="ghost" size="icon">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon">
                        <Edit3 className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="flex flex-wrap gap-2 mb-3">
                    {newsletter.recipients.map((recipient) => (
                      <Badge key={recipient} variant="outline">
                        <Users className="h-3 w-3 mr-1" />
                        {recipient}
                      </Badge>
                    ))}
                  </div>
                  {newsletter.hasAttachment && newsletter.attachmentName && (
                    <div className="flex items-center text-sm text-muted-foreground mb-2">
                      <FileText className="h-4 w-4 mr-1" />
                      {newsletter.attachmentName}
                    </div>
                  )}
                  {newsletter.sentDate && (
                    <p className="text-xs text-muted-foreground">
                      Sent on {newsletter.sentDate}
                    </p>
                  )}
                </CardContent>
              </Card>
            ))}
          </TabsContent>
        </Tabs>
      </div>

      {/* Modals */}
      <CreateEventModal
        isOpen={showCreateEvent}
        onClose={() => setShowCreateEvent(false)}
        onSubmit={handleCreateEvent}
        form={eventForm}
        setForm={setEventForm}
        recipientOptions={recipientOptions}
        handleRecipientToggle={handleRecipientToggle}
      />

      <CreateNewsletterModal
        isOpen={showCreateNewsletter}
        onClose={() => setShowCreateNewsletter(false)}
        onSubmit={handleCreateNewsletter}
        form={newsletterForm}
        setForm={setNewsletterForm}
        recipientOptions={recipientOptions}
        handleRecipientToggle={handleRecipientToggle}
      />
    </div>
  );
};

export default CommunicationCenter;
