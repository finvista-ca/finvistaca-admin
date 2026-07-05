"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ConsultationService, Consultation } from "@/services/consultation.service";
import { DataTable } from "@/components/tables/data-table";
import { ColumnDef } from "@tanstack/react-table";
import { StatusBadge } from "@/components/ui/status-badge";
import { 
  Sheet, 
  SheetContent, 
  SheetHeader, 
  SheetTitle, 
  SheetDescription 
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { AlertTriangle, Phone, MapPin, Briefcase, Calendar, Clock, MessageSquare } from "lucide-react";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

export default function ConsultationsPage() {
  const queryClient = useQueryClient();
  const [selectedRow, setSelectedRow] = useState<Consultation | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const { data = [], isLoading, isError, error } = useQuery({
    queryKey: ["consultations"],
    queryFn: ConsultationService.getAll
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: Consultation["status"] }) => 
      ConsultationService.updateStatus(id, status),
    onSuccess: (_, variables) => {
      toast.success(`Consultation marked as ${variables.status}`);
      queryClient.invalidateQueries({ queryKey: ["consultations"] });
      if (selectedRow) {
        setSelectedRow({ ...selectedRow, status: variables.status });
      }
    },
    onError: () => {
      toast.error("Failed to update status");
    }
  });

  const handleUpdateStatus = (status: Consultation["status"]) => {
    if (!selectedRow) return;
    // Handle both _id (MongoDB) and id fields
    const rowId = selectedRow.id || selectedRow._id;
    if (!rowId) {
      toast.error("Invalid booking ID");
      return;
    }
    updateMutation.mutate({ id: rowId, status });
  };

  const columns: ColumnDef<Consultation>[] = [
    {
      accessorKey: "clientName",
      header: "Client Name",
      cell: ({ row }) => <div className="font-medium">{row.original.clientName}</div>,
    },
    {
      accessorKey: "phone",
      header: "Phone",
    },
    {
      accessorKey: "branch",
      header: "Branch",
    },
    {
      accessorKey: "service",
      header: "Service",
    },
    {
      accessorKey: "date",
      header: "Date",
      cell: ({ row }) => new Date(row.original.date).toLocaleDateString(),
    },
    {
      accessorKey: "time",
      header: "Time",
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
        <h1 className="text-3xl font-bold tracking-tight">Consultations</h1>
        <Skeleton className="h-[500px] w-full rounded-xl" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold tracking-tight">Consultations</h1>
        <Card className="border-destructive/50 bg-destructive/10">
          <CardHeader>
            <CardTitle className="text-destructive flex items-center gap-2">
              <AlertTriangle className="h-5 w-5" />
              Connection Error
            </CardTitle>
            <CardDescription className="text-destructive/80">
              {error instanceof Error ? error.message : "Failed to load consultations"}
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Consultations</h1>
      </div>

      <DataTable 
        columns={columns} 
        data={data} 
        searchKey="clientName" 
        searchPlaceholder="Search by client name..."
        onRowClick={(row) => {
          setSelectedRow(row);
          setIsDrawerOpen(true);
        }}
      />

      <Sheet open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
        <SheetContent className="w-full sm:max-w-md overflow-y-auto">
          <SheetHeader className="mb-6">
            <SheetTitle>Consultation Details</SheetTitle>
            <SheetDescription>View and manage this booking.</SheetDescription>
          </SheetHeader>
          
          {selectedRow && (
            <div className="space-y-6">
              <div className="flex items-center gap-4 border-b pb-4">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary text-xl font-bold">
                  {selectedRow.clientName?.charAt(0) || "U"}
                </div>
                <div>
                  <h3 className="font-semibold text-lg">{selectedRow.clientName}</h3>
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
                    <MapPin className="w-4 h-4" /> Branch
                  </span>
                  <span className="col-span-2 font-medium">{selectedRow.branch}</span>
                </div>

                <div className="grid grid-cols-3 items-center gap-4">
                  <span className="text-muted-foreground flex items-center gap-2 col-span-1">
                    <Briefcase className="w-4 h-4" /> Service
                  </span>
                  <span className="col-span-2 font-medium">{selectedRow.service}</span>
                </div>

                <div className="grid grid-cols-3 items-center gap-4">
                  <span className="text-muted-foreground flex items-center gap-2 col-span-1">
                    <Calendar className="w-4 h-4" /> Date
                  </span>
                  <span className="col-span-2 font-medium">
                    {selectedRow.date ? new Date(selectedRow.date).toLocaleDateString() : "N/A"}
                  </span>
                </div>

                <div className="grid grid-cols-3 items-center gap-4">
                  <span className="text-muted-foreground flex items-center gap-2 col-span-1">
                    <Clock className="w-4 h-4" /> Time
                  </span>
                  <span className="col-span-2 font-medium">{selectedRow.time}</span>
                </div>
              </div>

              {selectedRow.message && (
                <div className="rounded-lg bg-muted p-4 space-y-2 text-sm">
                  <div className="font-semibold flex items-center gap-2">
                    <MessageSquare className="w-4 h-4" /> Message
                  </div>
                  <p className="text-muted-foreground italic">&quot;{selectedRow.message}&quot;</p>
                </div>
              )}

              <div className="pt-6 border-t space-y-3">
                <h4 className="font-semibold text-sm">Actions</h4>
                <div className="grid grid-cols-2 gap-3">
                  <Button 
                    variant="outline" 
                    className="w-full border-blue-200 text-blue-700 hover:bg-blue-50"
                    onClick={() => handleUpdateStatus("Confirmed")}
                    disabled={updateMutation.isPending || selectedRow.status === "Confirmed"}
                  >
                    Confirm
                  </Button>
                  <Button 
                    className="w-full bg-emerald-600 hover:bg-emerald-700 text-white"
                    onClick={() => handleUpdateStatus("Completed")}
                    disabled={updateMutation.isPending || selectedRow.status === "Completed"}
                  >
                    Complete
                  </Button>
                  <Button 
                    variant="destructive" 
                    className="w-full col-span-2"
                    onClick={() => handleUpdateStatus("Cancelled")}
                    disabled={updateMutation.isPending || selectedRow.status === "Cancelled"}
                  >
                    Cancel Booking
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
