import { useQuery } from "@tanstack/react-query";
import axios from "axios";

export type Student = {
  user_id: string;
  first_name: string;
  last_name: string;
  email: string;
  gender: string;
  class: string;
  is_approved: boolean;
  phone: string;
  grade_level: string;
  enrollment_date: string; // ISO string or formatted date
  admission_number: string;
};

export const useStudents = (
  schoolId: string,
  sessionId: string,
  termId: string
) => {
  return useQuery<Student[]>({
    queryKey: ["students", schoolId, sessionId, termId],
    queryFn: async () => {
      const res = await axios.get(
        `/api/user/get-students/${schoolId}/${sessionId}/${termId}`
      );
      return res.data.data;
    },
    enabled: !!schoolId && !!sessionId && !!termId,
  });
};
