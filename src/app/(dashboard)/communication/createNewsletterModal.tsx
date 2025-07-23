"use client";

import React from "react";
import { Send, FileText, Upload, Users } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardContent } from "@/components/ui/card";
import { NewsletterModalProps } from "./types"; 

export default function CreateNewsletterModal({
  isOpen,
  onClose,
  onSubmit,
  form,
  setForm,
  recipientOptions,
  handleRecipientToggle,
}: NewsletterModalProps) {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setForm({ ...form, attachment: file });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-success" />
            Create Newsletter
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <div>
              <Label htmlFor="title">Newsletter Title</Label>
              <Input
                id="title"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                placeholder="Enter newsletter title"
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="content">Content</Label>
              <Textarea
                id="content"
                value={form.content}
                onChange={(e) => setForm({ ...form, content: e.target.value })}
                placeholder="Write your newsletter content here..."
                rows={8}
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="attachment">Attachment (Optional)</Label>
              <Card className="mt-1">
                <CardContent className="p-4">
                  <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 text-center">
                    <Upload className="mx-auto h-8 w-8 text-muted-foreground mb-2" />
                    <p className="text-sm text-muted-foreground mb-2">
                      Drop files here or click to upload
                    </p>
                    <Input
                      id="attachment"
                      type="file"
                      accept=".pdf,.doc,.docx"
                      onChange={handleFileChange}
                      className="max-w-xs mx-auto"
                    />
                  </div>
                  {form.attachment && (
                    <div className="mt-3 p-2 bg-muted rounded flex items-center gap-2">
                      <FileText className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm font-medium">
                        {form.attachment.name}
                      </span>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            <div>
              <Label className="flex items-center gap-1 mb-3">
                <Users className="h-4 w-4" />
                Recipients
              </Label>
              <Card>
                <CardContent className="p-4">
                  <ScrollArea className="h-48">
                    {recipientOptions.map((group) => (
                      <div key={group.group} className="mb-4">
                        <h4 className="font-medium text-sm text-muted-foreground mb-2 uppercase tracking-wide">
                          {group.group}
                        </h4>
                        <div className="space-y-2">
                          {group.options.map((option) => (
                            <div key={option} className="flex items-center space-x-2">
                              <Checkbox
                                id={`newsletter-${option}`}
                                checked={form.recipients.includes(option)}
                                onCheckedChange={() =>
                                  handleRecipientToggle(option, false)
                                }
                              />
                              <Label
                                htmlFor={`newsletter-${option}`}
                                className="text-sm font-normal cursor-pointer"
                              >
                                {option}
                              </Label>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </ScrollArea>
                </CardContent>
              </Card>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" variant="success" className="min-w-32">
              <Send className="h-4 w-4 mr-2" />
              Send Newsletter
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
