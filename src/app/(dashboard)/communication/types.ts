export type Priority = "low" | "medium" | "high";
export type Status = "draft" | "sent" | "scheduled";

export interface RecipientGroup {
  group: string;
  options: string[];
}

export interface Event {
  id: number;
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  recipients: string[];
  status: Status;
  sentDate?: string;
  priority: Priority;
}

export interface Newsletter {
  id: number;
  title: string;
  content: string;
  recipients: string[];
  status: Status;
  sentDate?: string;
  hasAttachment: boolean;
  attachmentName?: string;
}

export interface EventFormData {
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  recipients: string[];
  priority: Priority;
}

export interface NewsletterFormData {
  title: string;
  content: string;
  recipients: string[];
  attachment: File | null;
}

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export interface EventModalProps extends ModalProps {
  onSubmit: () => void;
  form: EventFormData;
  setForm: (form: EventFormData) => void;
  recipientOptions: RecipientGroup[];
  handleRecipientToggle: (recipient: string, isEvent: boolean) => void;
}

export interface NewsletterModalProps extends ModalProps {
  onSubmit: () => void;
  form: NewsletterFormData;
  setForm: (form: NewsletterFormData) => void;
  recipientOptions: RecipientGroup[];
  handleRecipientToggle: (recipient: string, isEvent: boolean) => void;
}
