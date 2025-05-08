import axios from "axios";

export type Teacher = {
  user_id: string;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  role: string;
  school_id: string;
  is_approved: boolean;
};

export async function fetchTeachers(schoolId: string): Promise<Teacher[]> {
  const { data } = await axios.get<{ success: boolean; data: Teacher[] }>(
    `/api/user/get-teachers/${schoolId}`
  );
  if (!data.success) {
    throw new Error("API returned success=false");
  }
  console.log("Fetched teachers:", data.data);
  return data.data;
}
