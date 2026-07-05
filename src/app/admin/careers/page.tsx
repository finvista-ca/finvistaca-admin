"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { CareerService, CareerApplication } from "@/services/career.service";
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
import { AlertTriangle, User, Phone, Mail, Briefcase, Calendar, FileText } from "lucide-react";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { StatusBadge } from "@/components/ui/status-badge";

export default function CareersPage() {
  const queryClient = useQueryClient();
  const [selectedRow, setSelectedRow] = useState<CareerApplication | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const { data = [], isLoading, isError, error } = useQuery({
    queryKey: ["careers"],
    queryFn: CareerService.getAll
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: CareerApplication["status"] }) => 
      CareerService.updateStatus(id, status),
    onSuccess: (_, variables) => {
      toast.success(`Application marked as ${variables.status}`);
      queryClient.invalidateQueries({ queryKey: ["careers"] });
      if (selectedRow) {
        setSelectedRow({ ...selectedRow, status: variables.status });
      }
    },
    onError: () => {
      toast.error("Failed to update status");
    }
  });

  const handleUpdateStatus = (status: CareerApplication["status"]) => {
    if (!selectedRow) return;
    const rowId = selectedRow.id || selectedRow._id;
    if (!rowId) {
      toast.error("Invalid application ID");
      return;
    }
    updateMutation.mutate({ id: rowId, status });
  };

  const columns: ColumnDef<CareerApplication>[] = [
    {
      accessorKey: "applicantName",
      header: "Applicant Name",
      cell: ({ row }) => <div className="font-medium">{row.original.applicantName}</div>,
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
      accessorKey: "position",
      header: "Position",
      cell: ({ row }) => <div className="font-semibold text-primary">{row.original.position}</div>,
    },
    {
      accessorKey: "appliedDate",
      header: "Applied Date",
      cell: ({ row }) => row.original.appliedDate ? new Date(row.original.appliedDate).toLocaleDateString() : "-",
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
        <h1 className="text-3xl font-bold tracking-tight">Career Applications</h1>
        <Skeleton className="h-[500px] w-full rounded-xl" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold tracking-tight">Career Applications</h1>
        <Card className="border-destructive/50 bg-destructive/10">
          <CardHeader>
            <CardTitle className="text-destructive flex items-center gap-2">
              <AlertTriangle className="h-5 w-5" />
              Connection Error
            </CardTitle>
            <CardDescription className="text-destructive/80">
              {error instanceof Error ? error.message : "Failed to load applications. Ensure backend APIs are running."}
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Career Applications</h1>
      </div>

      <DataTable 
        columns={columns} 
        data={data} 
        searchKey="applicantName" 
        searchPlaceholder="Search applicants..."
        onRowClick={(row) => {
          setSelectedRow(row);
          setIsDrawerOpen(true);
        }}
      />

      <Sheet open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
        <SheetContent className="w-full sm:max-w-md overflow-y-auto">
          <SheetHeader className="mb-6">
            <SheetTitle>Application Details</SheetTitle>
            <SheetDescription>Review candidate and update status.</SheetDescription>
          </SheetHeader>
          
          {selectedRow && (
            <div className="space-y-6">
              <div className="flex items-center gap-4 border-b pb-4">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary text-xl font-bold">
                  {selectedRow.applicantName?.charAt(0) || "U"}
                </div>
                <div>
                  <h3 className="font-semibold text-lg">{selectedRow.applicantName}</h3>
                  <StatusBadge status={selectedRow.status} />
                </div>
              </div>

              <div className="space-y-4 text-sm">
                <div className="grid grid-cols-3 items-center gap-4">
                  <span className="text-muted-foreground flex items-center gap-2 col-span-1">
                    <Briefcase className="w-4 h-4" /> Position
                  </span>
                  <span className="col-span-2 font-semibold text-primary">{selectedRow.position}</span>
                </div>
                
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
                    <Calendar className="w-4 h-4" /> Applied
                  </span>
                  <span className="col-span-2 font-medium">
                    {selectedRow.appliedDate ? new Date(selectedRow.appliedDate).toLocaleDateString() : "-"}
                  </span>
                </div>
              </div>

              <div className="rounded-lg bg-muted p-4 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="font-semibold flex items-center gap-2">
                    <FileText className="w-4 h-4" /> Resume
                  </div>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => window.open(selectedRow.resumeUrl, "_blank")}
                  >
                    View Document
                  </Button>
                </div>
                {selectedRow.coverLetter && (
                  <>
                    <div className="h-px bg-border w-full" />
                    <div>
                      <h4 className="font-semibold text-sm mb-2">Cover Letter</h4>
                      <p className="text-sm text-muted-foreground whitespace-pre-wrap">{selectedRow.coverLetter}</p>
                    </div>
                  </>
                )}
              </div>

              <div className="pt-6 border-t space-y-3">
                <h4 className="font-semibold text-sm">Update Status</h4>
                <div className="grid grid-cols-2 gap-3">
                  <Button 
                    variant="outline" 
                    className="w-full border-blue-200 text-blue-700 hover:bg-blue-50"
                    onClick={() => handleUpdateStatus("Shortlisted")}
                    disabled={updateMutation.isPending || selectedRow.status === "Shortlisted"}
                  >
                    Shortlist
                  </Button>
                  <Button 
                    className="w-full bg-emerald-600 hover:bg-emerald-700 text-white"
                    onClick={() => handleUpdateStatus("Contacted")}
                    disabled={updateMutation.isPending || selectedRow.status === "Contacted"}
                  >
                    Contacted
                  </Button>
                  <Button 
                    variant="destructive" 
                    className="w-full col-span-2"
                    onClick={() => handleUpdateStatus("Rejected")}
                    disabled={updateMutation.isPending || selectedRow.status === "Rejected"}
                  >
                    Reject Application
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
