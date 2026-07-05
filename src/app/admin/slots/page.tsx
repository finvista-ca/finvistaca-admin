"use client";

import { useState } from "react";
import { format } from "date-fns";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { SlotService, Slot } from "@/services/slot.service";
import { Calendar } from "@/components/ui/calendar";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { 
  AlertTriangle, 
  Clock, 
  CalendarDays, 
  MapPin, 
  Plus,
  ShieldAlert,
  Unlock,
  Lock
} from "lucide-react";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription,
  DialogFooter
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const BRANCHES = [
  "Parvathipuram",
  "Vijayawada",
  "Visakhapatnam",
  "Bobbili",
  "Peddapuram",
  "Rayagada (Odisha)"
];

export default function SlotManagerPage() {
  const queryClient = useQueryClient();
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [branch, setBranch] = useState<string>(BRANCHES[0]);
  const [isAddSlotOpen, setIsAddSlotOpen] = useState(false);
  const [newSlotTime, setNewSlotTime] = useState("");

  const formattedDate = date ? format(date, "yyyy-MM-dd") : "";

  const { data: slots = [], isLoading, isError, error } = useQuery({
    queryKey: ["slots", formattedDate, branch],
    queryFn: () => SlotService.getSlotsByDateAndBranch(formattedDate, branch),
    enabled: !!formattedDate && !!branch,
  });

  const generateMutation = useMutation({
    mutationFn: () => SlotService.generateDailySlots(formattedDate, branch),
    onSuccess: () => {
      toast.success("Daily slots generated successfully");
      queryClient.invalidateQueries({ queryKey: ["slots", formattedDate, branch] });
    },
    onError: () => toast.error("Failed to generate slots")
  });

  const blockDayMutation = useMutation({
    mutationFn: () => SlotService.blockEntireDay(formattedDate, branch),
    onSuccess: () => {
      toast.success(`Entire day blocked for ${branch}`);
      queryClient.invalidateQueries({ queryKey: ["slots", formattedDate, branch] });
    },
    onError: () => toast.error("Failed to block entire day")
  });

  const blockSlotMutation = useMutation({
    mutationFn: (slot: Slot) => {
      const slotId = slot.id || slot._id;
      if (!slotId) throw new Error("Invalid slot ID");
      return slot.status === "Blocked" 
        ? SlotService.unblockSlot(slotId) 
        : SlotService.blockSlot(slotId);
    },
    onSuccess: (_, slot) => {
      toast.success(`Slot ${slot.time} ${slot.status === "Blocked" ? "unblocked" : "blocked"}`);
      queryClient.invalidateQueries({ queryKey: ["slots", formattedDate, branch] });
    },
    onError: () => toast.error("Action failed")
  });

  const addCustomSlotMutation = useMutation({
    mutationFn: () => SlotService.addCustomSlot(formattedDate, branch, newSlotTime),
    onSuccess: () => {
      toast.success("Custom slot added");
      setIsAddSlotOpen(false);
      setNewSlotTime("");
      queryClient.invalidateQueries({ queryKey: ["slots", formattedDate, branch] });
    },
    onError: () => toast.error("Failed to add custom slot")
  });

  const getStatusBadge = (status: Slot["status"]) => {
    if (status === "Available") return <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200">Available</Badge>;
    if (status === "Booked") return <Badge className="bg-primary hover:bg-primary/90 text-primary-foreground">Booked</Badge>;
    if (status === "Blocked") return <Badge variant="destructive">Blocked</Badge>;
    return null;
  };

  const isMutating = generateMutation.isPending || blockDayMutation.isPending || blockSlotMutation.isPending || addCustomSlotMutation.isPending;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h1 className="text-3xl font-bold tracking-tight">Slot Manager</h1>
        <div className="flex items-center gap-2">
          <MapPin className="w-5 h-5 text-muted-foreground" />
          <Select value={branch} onValueChange={(val) => val && setBranch(val)}>
            <SelectTrigger className="w-[220px] bg-card">
              <SelectValue placeholder="Select Branch" />
            </SelectTrigger>
            <SelectContent>
              {BRANCHES.map(b => (
                <SelectItem key={b} value={b}>{b}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        <div className="md:col-span-4 lg:col-span-3 space-y-6">
          <Card className="shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center gap-2">
                <CalendarDays className="w-5 h-5 text-primary" /> Select Date
              </CardTitle>
            </CardHeader>
            <CardContent className="flex justify-center">
              <Calendar
                mode="single"
                selected={date}
                onSelect={setDate}
                className="rounded-md border shadow-sm"
              />
            </CardContent>
          </Card>

          <Card className="shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <ShieldAlert className="w-5 h-5 text-primary" /> Admin Actions
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button 
                variant="outline" 
                className="w-full justify-start"
                onClick={() => generateMutation.mutate()}
                disabled={isMutating || !date || isLoading}
              >
                <Plus className="w-4 h-4 mr-2" /> Generate Daily Slots
              </Button>
              <Button 
                variant="outline" 
                className="w-full justify-start text-destructive hover:text-destructive hover:bg-destructive/10"
                onClick={() => blockDayMutation.mutate()}
                disabled={isMutating || !date || isLoading}
              >
                <Lock className="w-4 h-4 mr-2" /> Block Entire Day
              </Button>
              <Button 
                variant="outline" 
                className="w-full justify-start"
                onClick={() => setIsAddSlotOpen(true)}
                disabled={isMutating || !date || isLoading}
              >
                <Clock className="w-4 h-4 mr-2" /> Add Custom Slot
              </Button>
            </CardContent>
          </Card>
        </div>

        <div className="md:col-span-8 lg:col-span-9">
          <Card className="shadow-sm min-h-[600px]">
            <CardHeader>
              <CardTitle>Daily Slots Overview</CardTitle>
              <CardDescription>
                {date ? format(date, "EEEE, MMMM do, yyyy") : "Select a date"} • {branch}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {Array.from({ length: 9 }).map((_, i) => (
                    <Skeleton key={i} className="h-24 w-full rounded-xl" />
                  ))}
                </div>
              ) : isError ? (
                <div className="flex flex-col items-center justify-center py-12 text-center text-muted-foreground">
                  <AlertTriangle className="w-12 h-12 text-destructive mb-4 opacity-80" />
                  <p>{error instanceof Error ? error.message : "Failed to load slots for this date and branch."}</p>
                </div>
              ) : slots.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 text-center border-2 border-dashed rounded-xl">
                  <CalendarDays className="w-12 h-12 text-muted-foreground mb-4 opacity-50" />
                  <h3 className="text-lg font-medium text-foreground">No slots generated</h3>
                  <p className="text-muted-foreground mb-6 max-w-sm">
                    There are no slots available for this date at {branch}. Generate standard slots or add custom ones.
                  </p>
                  <Button onClick={() => generateMutation.mutate()} disabled={isMutating}>Generate Slots</Button>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                  {slots.map((slot: Slot) => (
                    <div 
                      key={slot.id || slot._id} 
                      className={`relative flex flex-col justify-between p-4 rounded-xl border transition-colors ${
                        slot.status === "Blocked" ? "bg-muted/50 border-destructive/20 opacity-80" : "bg-card hover:border-primary/50"
                      }`}
                    >
                      <div className="flex justify-between items-start mb-4">
                        <div className="text-xl font-bold flex items-center gap-2">
                          <Clock className="w-4 h-4 text-primary" /> {slot.time}
                        </div>
                        {getStatusBadge(slot.status)}
                      </div>
                      
                      <div className="flex items-center justify-between mt-auto">
                        <div className="text-sm font-medium text-muted-foreground">
                          {slot.status === "Booked" && slot.clientName ? (
                            <span className="text-foreground">{slot.clientName}</span>
                          ) : (
                            <span>{slot.status === "Available" ? "Open for booking" : "Unavailable"}</span>
                          )}
                        </div>
                        
                        {slot.status !== "Booked" && (
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => blockSlotMutation.mutate(slot)}
                            disabled={isMutating}
                            className={slot.status === "Available" ? "text-destructive hover:text-destructive hover:bg-destructive/10" : "text-emerald-600 hover:text-emerald-700 hover:bg-emerald-100"}
                          >
                            {slot.status === "Available" ? <Lock className="w-4 h-4" /> : <Unlock className="w-4 h-4" />}
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      <Dialog open={isAddSlotOpen} onOpenChange={setIsAddSlotOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Custom Slot</DialogTitle>
            <DialogDescription>
              Create a specific time slot outside of the generated schedule.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="time">Slot Time</Label>
              <Input 
                id="time" 
                placeholder="e.g. 02:15 PM" 
                value={newSlotTime}
                onChange={(e) => setNewSlotTime(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddSlotOpen(false)} disabled={isMutating}>Cancel</Button>
            <Button onClick={() => addCustomSlotMutation.mutate()} disabled={isMutating || !newSlotTime}>Add Slot</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
