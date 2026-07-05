import { api } from "@/lib/api-client";

export interface Slot {
  id?: string;
  _id?: string;
  time: string;
  status: "Available" | "Booked" | "Blocked";
  clientName?: string;
}

export const SlotService = {
  getSlotsByDateAndBranch: async (date: string, branch: string): Promise<Slot[]> => {
    const response = await api.get(`/api/admin/slots?date=${date}&branch=${branch}`);
    return response.data?.slots || response.data || [];
  },

  generateDailySlots: async (date: string, branch: string): Promise<void> => {
    await api.post("/api/admin/slots", { action: "generate", date, branch });
  },

  addCustomSlot: async (date: string, branch: string, time: string): Promise<void> => {
    await api.post("/api/admin/slots", { action: "add_custom", date, branch, time });
  },

  deleteSlot: async (slotId: string): Promise<void> => {
    await api.delete(`/api/admin/slots?id=${slotId}`);
  },

  blockEntireDay: async (date: string, branch: string): Promise<void> => {
    await api.post("/api/admin/block", { action: "block_day", date, branch });
  },

  blockSlot: async (slotId: string): Promise<void> => {
    await api.post(`/api/admin/block`, { action: "block_slot", slotId });
  },

  unblockSlot: async (slotId: string): Promise<void> => {
    await api.delete(`/api/admin/block?id=${slotId}`);
  }
};
