"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { EnquiryService, ContactEnquiry } from "@/services/enquiry.service";
import { DataTable } from "@/components/tables/data-table";
import { ColumnDef } from "@tanstack/react-table";
import { 
  Sheet, 
  SheetContent, 
  SheetHeader, 
  SheetTitle, 
  SheetDescription 
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { AlertTriangle, User, Phone, Mail, Calendar, MessageSquare, StickyNote } from "lucide-react";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { StatusBadge } from "@/components/ui/status-badge";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

export default function EnquiriesPage() {
  const queryClient = useQueryClient();
  const [selectedRow, setSelectedRow] = useState<ContactEnquiry | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [internalNotes, setInternalNotes] = useState("");

  const { data: rawData = [], isLoading, isError, error } = useQuery({
    queryKey: ["enquiries"],
    queryFn: EnquiryService.getAll
  });

  const data = Array.isArray(rawData) ? rawData : [];

  const updateStatusMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: ContactEnquiry["status"] }) => 
      EnquiryService.updateStatus(id, status),
    onSuccess: (_, variables) => {
      toast.success(`Enquiry marked as ${variables.status}`);
      queryClient.invalidateQueries({ queryKey: ["enquiries"] });
      if (selectedRow) {
        setSelectedRow({ ...selectedRow, status: variables.status });
      }
    },
    onError: () => toast.error("Failed to update status")
  });

  const updateNotesMutation = useMutation({
    mutationFn: ({ id, notes }: { id: string; notes: string }) => 
      EnquiryService.updateNotes(id, notes),
    onSuccess: (_, variables) => {
      toast.success(`Internal notes saved`);
      queryClient.invalidateQueries({ queryKey: ["enquiries"] });
      if (selectedRow) {
        setSelectedRow({ ...selectedRow, notes: variables.notes });
      }
    },
    onError: () => toast.error("Failed to save notes")
  });

  const handleUpdateStatus = (status: ContactEnquiry["status"]) => {
    if (!selectedRow) return;
    const rowId = selectedRow.id || selectedRow._id;
    if (!rowId) {
      toast.error("Invalid enquiry ID");
      return;
    }
    updateStatusMutation.mutate({ id: rowId, status });
  };

  const handleSaveNotes = () => {
    if (!selectedRow) return;
    const rowId = selectedRow.id || selectedRow._id;
    if (!rowId) {
      toast.error("Invalid enquiry ID");
      return;
    }
    updateNotesMutation.mutate({ id: rowId, notes: internalNotes });
  };

  const openDrawer = (row: ContactEnquiry) => {
    setSelectedRow(row);
    setInternalNotes(row.notes || "");
    setIsDrawerOpen(true);
  };

  const columns: ColumnDef<ContactEnquiry>[] = [
    {
      accessorKey: "name",
      header: "Name",
      cell: ({ row }) => <div className="font-medium">{row.original.name}</div>,
    },
    {
      accessorKey: "phone",
      header: "Phone",
    },
    {
      accessorKey: "email",
      header: "Email",
    },
    {
      accessorKey: "message",
      header: "Message Preview",
      cell: ({ row }) => (
        <div className="truncate max-w-[200px] text-muted-foreground">
          {row.original.message}
        </div>
      ),
    },
    {
      accessorKey: "date",
      header: "Date",
      cell: ({ row }) => row.original.date ? new Date(row.original.date).toLocaleDateString() : "-",
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => <StatusBadge status={row.original.status} />,
    },
  ];

  if (isLoading) {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold tracking-tight">Contact Enquiries</h1>
        <Skeleton className="h-[500px] w-full rounded-xl" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold tracking-tight">Contact Enquiries</h1>
        <Card className="border-destructive/50 bg-destructive/10">
          <CardHeader>
            <CardTitle className="text-destructive flex items-center gap-2">
              <AlertTriangle className="h-5 w-5" />
              Connection Error
            </CardTitle>
            <CardDescription className="text-destructive/80">
              {error instanceof Error ? error.message : "Failed to fetch enquiries. Ensure backend APIs are running."}
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Contact Enquiries</h1>
      </div>

      <DataTable 
        columns={columns} 
        data={data} 
        searchKey="name" 
        searchPlaceholder="Search by name..."
        onRowClick={openDrawer}
      />

      <Sheet open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
        <SheetContent className="w-full sm:max-w-md overflow-y-auto">
          <SheetHeader className="mb-6">
            <SheetTitle>Enquiry Details</SheetTitle>
            <SheetDescription>Review and respond to this message.</SheetDescription>
          </SheetHeader>
          
          {selectedRow && (
            <div className="space-y-6">
              <div className="flex items-center gap-4 border-b pb-4">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary text-xl font-bold">
                  {selectedRow.name?.charAt(0) || "U"}
                </div>
                <div>
                  <h3 className="font-semibold text-lg">{selectedRow.name}</h3>
                  <StatusBadge status={selectedRow.status} />
                </div>
              </div>

              <div className="space-y-4 text-sm">
                <div className="grid grid-cols-3 items-center gap-4">
                  <span className="text-muted-foreground flex items-center gap-2 col-span-1">
                    <Phone className="w-4 h-4" /> Phone
                  </span>
                  <span className="col-span-2 font-medium">{selectedRow.phone}</span>
                </div>

                <div className="grid grid-cols-3 items-center gap-4">
                  <span className="text-muted-foreground flex items-center gap-2 col-span-1">
                    <Mail className="w-4 h-4" /> Email
                  </span>
                  <span className="col-span-2 font-medium">{selectedRow.email}</span>
                </div>

                <div className="grid grid-cols-3 items-center gap-4">
                  <span className="text-muted-foreground flex items-center gap-2 col-span-1">
                    <Calendar className="w-4 h-4" /> Date
                  </span>
                  <span className="col-span-2 font-medium">
                    {selectedRow.date ? new Date(selectedRow.date).toLocaleString() : "-"}
                  </span>
                </div>
              </div>

              <div className="rounded-lg bg-muted p-4 space-y-2">
                <div className="font-semibold flex items-center gap-2">
                  <MessageSquare className="w-4 h-4" /> Full Message
                </div>
                <p className="text-sm whitespace-pre-wrap">{selectedRow.message}</p>
              </div>

              <div className="space-y-3 pt-4 border-t">
                <div className="flex items-center justify-between">
                  <Label htmlFor="notes" className="font-semibold flex items-center gap-2">
                    <StickyNote className="w-4 h-4" /> Internal Notes
                  </Label>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={handleSaveNotes}
                    disabled={updateNotesMutation.isPending || internalNotes === (selectedRow.notes || "")}
                  >
                    Save Notes
                  </Button>
                </div>
                <Textarea 
                  id="notes" 
                  placeholder="Add private notes here..." 
                  className="min-h-[100px] resize-none"
                  value={internalNotes}
                  onChange={(e) => setInternalNotes(e.target.value)}
                />
              </div>

              <div className="pt-6 border-t space-y-3">
                <h4 className="font-semibold text-sm">Update Status</h4>
                <div className="grid grid-cols-2 gap-3">
                  <Button 
                    variant="outline" 
                    className="w-full border-blue-200 text-blue-700 hover:bg-blue-50"
                    onClick={() => handleUpdateStatus("Resolved")}
                    disabled={updateStatusMutation.isPending || selectedRow.status === "Resolved"}
                  >
                    Mark Resolved
                  </Button>
                  <Button 
                    variant="outline"
                    className="w-full text-muted-foreground"
                    onClick={() => handleUpdateStatus("Archived")}
                    disabled={updateStatusMutation.isPending || selectedRow.status === "Archived"}
                  >
                    Archive
                  </Button>
                </div>
              </div>
            </div>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}
