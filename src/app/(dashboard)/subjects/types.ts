export type SchoolClass = {
  class_id: string;
  name: string;
  grade_level: string;
};

// export type Subject = {
//   subject_id: string;
//   name: string;
//   class_name: string;
//   grade_level: string;
//   teacher_name: string;
//   teacher_email: string;
//   is_approved: boolean;
// };

// types.ts
// export type Subject = {
//   id: string;
//   subject_id: string;
//   name: string;
//   is_approved: boolean;
//   class: {
//     name: string;
//     grade_level: string;
//   };
//   teacher: {
//     name: string;
//     email: string;
//     teacher_id: string;
//   };
// };

export interface Teacher {
  teacher_id: string;
  name: string;
  username: string;
  email: string;
}

export interface Class {
  class_id: string;
  name: string;
  grade_level: string;
}

export interface Subject {
  subject_id: string;
  name: string;
  short: string;
  class_id: string;
  is_approved: boolean;
  class: Class;
  teacher: Teacher;
  created_at: string;
  student_count: number;
}

export interface SubjectFormData {
  class_id: string;
  name: string;
  short: string;
}

export interface SubjectStats {
  total: number;
  approved: number;
  pending: number;
  teachers: number;
}

export interface SubjectFilters {
  searchTerm: string;
  statusFilter: "all" | "approved" | "pending";
  gradeFilter: string;
}

export interface SubjectFormDialogProps {
  classes: Class[];
  onCreateSubject: (formData: SubjectFormData) => void;
}

export interface SubjectTableRowProps {
  subject: Subject;
  onApprove: () => void;
  onDisapprove: () => void;
  onDelete: () => void;
}

export interface UseSubjectsReturn {
  classes: Class[];
  subjects: Subject[];
  loadingSubjects: boolean;
  approve: {
    mutate: (subjectId: string) => void;
    isPending: boolean;
  };
  disapprove: {
    mutate: (subjectId: string) => void;
    isPending: boolean;
  };
  remove: {
    mutate: (subjectId: string) => void;
    isPending: boolean;
  };
}
