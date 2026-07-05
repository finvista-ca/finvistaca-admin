import { api } from "@/lib/api-client";

export interface CareerApplication {
  id?: string;
  _id?: string;
  applicantName: string;
  phone: string;
  email: string;
  position: string;
  appliedDate: string;
  status: "New" | "Shortlisted" | "Contacted" | "Rejected";
  resumeUrl: string;
  coverLetter?: string;
}

export const CareerService = {
  getAll: async (): Promise<CareerApplication[]> => {
    const response = await api.get("/api/admin/careers");
    return response.data?.careers || response.data || [];
  },

  updateStatus: async (id: string, status: CareerApplication["status"]): Promise<void> => {
    await api.patch(`/api/admin/careers`, { id, status });
  }
};
