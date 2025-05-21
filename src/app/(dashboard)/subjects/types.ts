export type SchoolClass = {
  class_id: string;
  name: string;
  grade_level: string;
};

export type Subject = {
  subject_id: string;
  name: string;
  class_name: string;
  grade_level: string;
  teacher_name: string;
  teacher_email: string;
  is_approved: boolean;
};
