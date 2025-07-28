export interface Session {
  session_id: string;
  name: string;
  start_date: string;
  end_date: string;
  is_active: boolean;
  terms_count?: number;
  students_count?: number;
  terms?: Term[];
}

export interface Term {
  term_id: string;
  name: string;
  start_date: string;
  end_date: string;
  is_active: boolean;
}

export interface SessionFormData {
  name: string;
  start_date: string;
  end_date: string;
}

export interface TermFormData {
  name: string;
  start_date: string;
  end_date: string;
}

export interface CreateItemDialogProps {
  open: boolean;
  setOpen: (value: boolean) => void;
  onSubmit: (data: SessionFormData | TermFormData) => void;
  initialData?: Session | Term | null;
  title: string;
  submitLabel: string;
  nameLabel: string;
}

export interface SessionCardProps {
  session: Session;
  onEditClick: (session: Session) => void;
  toggleActive: (session: Session) => void;
  onViewDetails: (session: Session) => void;
}

export interface SessionListProps {
  sessions: Session[];
  isLoading: boolean;
  onEditClick: (session: Session) => void;
  toggleActive: (session: Session) => void;
  onViewDetails: (session: Session) => void;
}

export interface TermsViewProps {
  session: Session;
  onBack: () => void;
}

export type ViewType = "sessions" | "terms";
