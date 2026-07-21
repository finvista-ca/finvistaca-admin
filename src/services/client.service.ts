import { api } from "@/lib/api-client";
import { Consultation } from "./consultation.service";

export interface Client {
  id?: string;
  _id?: string;
  name: string;
  phone: string;
  email?: string;
  totalConsultations: number;
  lastConsultationDate?: string;
  doNotContact: boolean;
  timeline?: {
    id: string;
    title: string;
    date: string;
    type: "Booking" | "Message" | "StatusChange";
  }[];
  consultationHistory?: Consultation[];
}

export const ClientService = {
  getAll: async (): Promise<Client[]> => {
    const response = await api.get("/api/admin/clients");
    return response.data?.patients || response.data || [];
  },

  updateDoNotContact: async (id: string, doNotContact: boolean): Promise<void> => {
    // According to the prompt: PATCH /api/admin/clients
    await api.patch("/api/admin/clients", { id, doNotContact });
  }
};
