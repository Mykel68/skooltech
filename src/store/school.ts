import { create } from "zustand";

interface SchoolData {
  id?: string;
  name: string;
  address: string;
  admin_email: string;
  phone_number: string;
  school_image?: string;
}

interface SchoolStore {
  schoolData: SchoolData | null;
  setSchoolData: (data: SchoolData) => void;
  clearSchoolData: () => void;
}

export const useSchoolStore = create<SchoolStore>((set) => ({
  schoolData: null,
  setSchoolData: (data) => set({ schoolData: data }),
  clearSchoolData: () => set({ schoolData: null }),
}));
