"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ClientService, Client } from "@/services/client.service";
import { DataTable } from "@/components/tables/data-table";
import { ColumnDef } from "@tanstack/react-table";
import { 
  Sheet, 
  SheetContent, 
  SheetHeader, 
  SheetTitle, 
  SheetDescription 
} from "@/components/ui/sheet";
import { Skeleton } from "@/components/ui/skeleton";
import { AlertTriangle, Phone, Mail, Activity, CalendarDays } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { StatusBadge } from "@/components/ui/status-badge";

export default function ClientsPage() {
  const queryClient = useQueryClient();
  const [selectedRow, setSelectedRow] = useState<Client | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const { data = [], isLoading, isError, error } = useQuery({
    queryKey: ["clients"],
    queryFn: ClientService.getAll
  });

  const updateDncMutation = useMutation({
    mutationFn: ({ id, checked }: { id: string; checked: boolean }) => 
      ClientService.updateDoNotContact(id, checked),
    onSuccess: (_, variables) => {
      toast.success(variables.checked ? "Client marked as Do Not Contact" : "Client opted in for contact");
      queryClient.invalidateQueries({ queryKey: ["clients"] });
      if (selectedRow) {
        setSelectedRow({ ...selectedRow, doNotContact: variables.checked });
      }
    },
    onError: () => {
      toast.error("Failed to update status");
    }
  });

  const handleToggleDNC = (checked: boolean) => {
    if (!selectedRow) return;
    const rowId = selectedRow.id || selectedRow._id;
    if (!rowId) {
      toast.error("Invalid client ID");
      return;
    }
    updateDncMutation.mutate({ id: rowId, checked });
  };

  const columns: ColumnDef<Client>[] = [
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
      cell: ({ row }) => row.original.email || "-",
    },
    {
      accessorKey: "totalConsultations",
      header: "Total Consultations",
      cell: ({ row }) => <div className="text-center">{row.original.totalConsultations || 0}</div>,
    },
    {
      accessorKey: "lastConsultationDate",
      header: "Last Consultation",
      cell: ({ row }) => row.original.lastConsultationDate ? new Date(row.original.lastConsultationDate).toLocaleDateString() : "-",
    },
  ];

  if (isLoading) {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold tracking-tight">Clients</h1>
        <Skeleton className="h-[500px] w-full rounded-xl" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold tracking-tight">Clients</h1>
        <Card className="border-destructive/50 bg-destructive/10">
          <CardHeader>
            <CardTitle className="text-destructive flex items-center gap-2">
              <AlertTriangle className="h-5 w-5" />
              Connection Error
            </CardTitle>
            <CardDescription className="text-destructive/80">
              {error instanceof Error ? error.message : "Failed to load clients."}
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Clients CRM</h1>
      </div>

      <DataTable 
        columns={columns} 
        data={data} 
        searchKey="name" 
        searchPlaceholder="Search by client name..."
        onRowClick={(row) => {
          setSelectedRow(row);
          setIsDrawerOpen(true);
        }}
      />

      <Sheet open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
        <SheetContent className="w-full sm:max-w-md overflow-y-auto">
          <SheetHeader className="mb-6">
            <SheetTitle>Client Profile</SheetTitle>
            <SheetDescription>View history and manage preferences.</SheetDescription>
          </SheetHeader>
          
          {selectedRow && (
            <div className="space-y-6">
              <div className="flex items-center gap-4 border-b pb-4">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary text-xl font-bold">
                  {selectedRow.name?.charAt(0) || "U"}
                </div>
                <div>
                  <h3 className="font-semibold text-lg">{selectedRow.name}</h3>
                  <div className="text-sm text-muted-foreground flex items-center gap-2 mt-1">
                    <Phone className="w-3 h-3" /> {selectedRow.phone}
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between p-4 rounded-lg border bg-card shadow-sm">
                <div className="space-y-0.5">
                  <Label htmlFor="dnc" className="text-base font-semibold">Do Not Contact</Label>
                  <p className="text-xs text-muted-foreground">Opt this client out of bulk campaigns.</p>
                </div>
                <Switch 
                  id="dnc" 
                  checked={selectedRow.doNotContact}
                  onCheckedChange={handleToggleDNC}
                  disabled={updateDncMutation.isPending}
                />
              </div>

              {selectedRow.email && (
                <div className="flex items-center gap-3 text-sm text-muted-foreground">
                  <Mail className="w-4 h-4" /> {selectedRow.email}
                </div>
              )}

              <div className="space-y-3">
                <h4 className="font-semibold text-sm flex items-center gap-2">
                  <Activity className="w-4 h-4 text-primary" /> 
                  Activity Timeline
                </h4>
                <div className="relative pl-6 space-y-4 border-l ml-3">
                  {selectedRow.timeline?.map((item) => (
                    <div key={item.id} className="relative">
                      <span className="absolute -left-[31px] bg-background p-1">
                        <span className="block w-2 h-2 rounded-full bg-primary" />
                      </span>
                      <p className="text-sm font-medium">{item.title}</p>
                      <p className="text-xs text-muted-foreground">{new Date(item.date).toLocaleString()}</p>
                    </div>
                  ))}
                  {(!selectedRow.timeline || selectedRow.timeline.length === 0) && (
                    <p className="text-sm text-muted-foreground">No recent activity.</p>
                  )}
                </div>
              </div>

              <div className="space-y-3 pt-4 border-t">
                <h4 className="font-semibold text-sm flex items-center gap-2">
                  <CalendarDays className="w-4 h-4 text-primary" /> 
                  Consultation History
                </h4>
                <div className="space-y-3">
                  {selectedRow.consultationHistory?.map((consultation) => (
                    <div key={consultation.id} className="p-3 border rounded-lg bg-muted/30 text-sm space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="font-medium">{consultation.service}</span>
                        <StatusBadge status={consultation.status} />
                      </div>
                      <div className="flex justify-between text-muted-foreground text-xs">
                        <span>{new Date(consultation.date).toLocaleDateString()}</span>
                        <span>{consultation.branch}</span>
                      </div>
                    </div>
                  ))}
                  {(!selectedRow.consultationHistory || selectedRow.consultationHistory.length === 0) && (
                    <p className="text-sm text-muted-foreground">No consultation history.</p>
                  )}
                </div>
              </div>
            </div>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}
