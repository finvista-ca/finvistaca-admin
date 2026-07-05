import { api } from "@/lib/api-client";

export interface ContactEnquiry {
  id?: string;
  _id?: string;
  name: string;
  phone: string;
  email: string;
  message: string;
  date: string;
  status: "New" | "Resolved" | "Archived";
  notes?: string;
}

export const EnquiryService = {
  getAll: async (): Promise<ContactEnquiry[]> => {
    const response = await api.get("/api/admin/enquiries");
    return response.data?.enquiries || response.data || [];
  },

  updateStatus: async (id: string, status: ContactEnquiry["status"]): Promise<void> => {
    await api.patch(`/api/admin/enquiries`, { id, status });
  },

  updateNotes: async (id: string, notes: string): Promise<void> => {
    await api.patch(`/api/admin/enquiries`, { id, notes });
  }
};
