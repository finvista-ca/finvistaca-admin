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
    try {
      const response = await api.get("/api/admin/enquiries");
      const data = response.data;
      
      if (Array.isArray(data)) {
        return data;
      }
      if (data && Array.isArray(data.enquiries)) {
        return data.enquiries;
      }
      if (data && Array.isArray(data.data)) {
        return data.data;
      }
      return [];
    } catch (error: any) {
      if (error.response?.status === 404) {
        console.warn("Enquiries API not implemented yet, returning empty array.");
        return [];
      }
      throw error;
    }
  },

  updateStatus: async (id: string, status: ContactEnquiry["status"]): Promise<void> => {
    await api.patch(`/api/admin/enquiries`, { id, status });
  },

  updateNotes: async (id: string, notes: string): Promise<void> => {
    await api.patch(`/api/admin/enquiries`, { id, notes });
  }
};
