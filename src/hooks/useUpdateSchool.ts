import axios from "axios";
import { useMutation } from "@tanstack/react-query";

const updateSchoolProfile = async ({
  schoolId,
  data,
}: {
  schoolId: string;
  data: any;
}) => {
  const response = await axios.patch(
    `/api/school/edit-profile/${schoolId}`,
    data
  );
  return response.data;
};

export const useUpdateSchoolProfile = () => {
  return useMutation({
    mutationFn: updateSchoolProfile,
  });
};
