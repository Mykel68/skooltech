import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { Subject, SchoolClass } from "./types";

export const useSubjects = (
  schoolId?: string,
  sessionId?: string,
  termId?: string
) => {
  const queryClient = useQueryClient();

  const { data: classes = [], isPending: loadingClasses } = useQuery({
    queryKey: ["classes", schoolId],
    queryFn: async (): Promise<SchoolClass[]> => {
      const { data } = await axios.get(`/api/class/get-all-classs/${schoolId}`);
      return data.data.classes;
    },
    enabled: !!schoolId,
  });

  const { data: subjects = [], isPending: loadingSubjects } = useQuery({
    queryKey: ["subjects", schoolId, sessionId, termId],
    queryFn: async (): Promise<Subject[]> => {
      const { data } = await axios.get(
        `/api/subject/get-all-subject/${schoolId}/${sessionId}/${termId}`
      );
      return data.data;
    },
    enabled: !!schoolId && !!sessionId && !!termId,
  });

  const approve = useMutation({
    mutationFn: (subjectId: string) =>
      axios.patch(`/api/subject/approve/${subjectId}`),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["subjects", schoolId] }),
  });

  const disapprove = useMutation({
    mutationFn: (subjectId: string) =>
      axios.patch(`/api/subject/disapprove/${subjectId}`),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["subjects", schoolId] }),
  });

  const remove = useMutation({
    mutationFn: (subjectId: string) =>
      axios.delete(`/api/subject/delete/${subjectId}`),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["subjects", schoolId] }),
  });

  return {
    classes,
    subjects,
    loadingClasses,
    loadingSubjects,
    approve,
    disapprove,
    remove,
  };
};
