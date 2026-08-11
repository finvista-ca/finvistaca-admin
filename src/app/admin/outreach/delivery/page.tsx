"use client";

import { useState, useMemo } from "react";
import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { OutreachService, DeliveryStatus } from "@/services/outreach.service";
import { DataTable } from "@/components/tables/data-table";
import { ColumnDef } from "@tanstack/react-table";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { AlertTriangle } from "lucide-react";
import { StatusBadge } from "@/components/ui/status-badge";

function DeliveryStatusContent() {
  const searchParams = useSearchParams();
  const campaignId = searchParams?.get("campaignId") || undefined;
  
  const [selectedStatus, setSelectedStatus] = useState("ALL");

  const { data = [], isLoading, isError, error } = useQuery({
    queryKey: ["deliveryStatus", campaignId],
    queryFn: () => OutreachService.getDeliveryStatus(campaignId)
  });

  const filteredData = useMemo(() => {
    if (selectedStatus === "ALL") return data;
    return data.filter((item) => 
      item.status?.toLowerCase() === selectedStatus.toLowerCase()
    );
  }, [data, selectedStatus]);

  const columns: ColumnDef<DeliveryStatus>[] = [
    {
      accessorKey: "clientName",
      header: "Client Name",
      cell: ({ row }) => <div className="font-medium">{row.original.clientName || "-"}</div>,
    },
    {
      accessorKey: "phone",
      header: "Phone",
    },
    {
      accessorKey: "reminderType",
      header: "Reminder Type",
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => <StatusBadge status={row.original.status} />,
    },
    {
      accessorKey: "sentTime",
      header: "Sent Time",
      cell: ({ row }) => row.original.sentTime ? new Date(row.original.sentTime).toLocaleString() : "-",
    },
  ];

  if (isLoading) {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold tracking-tight">Delivery Status</h1>
        <Skeleton className="h-[500px] w-full rounded-xl" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold tracking-tight">Delivery Status</h1>
        <Card className="border-destructive/50 bg-destructive/10">
          <CardHeader>
            <CardTitle className="text-destructive flex items-center gap-2">
              <AlertTriangle className="h-5 w-5" />
              Connection Error
            </CardTitle>
            <CardDescription className="text-destructive/80">
              {error instanceof Error ? error.message : "Failed to load delivery status. Ensure backend APIs are running."}
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Delivery Status</h1>
          {campaignId && (
            <p className="text-muted-foreground mt-1">Filtering by Campaign ID: {campaignId}</p>
          )}
        </div>

        <div className="flex items-center gap-2">
          <label htmlFor="status-filter" className="text-sm font-medium text-muted-foreground">
            Filter Status:
          </label>
          <select
            id="status-filter"
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="border border-input bg-background text-foreground rounded-md px-3 py-1.5 text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-ring"
          >
            <option value="ALL">All Statuses</option>
            <option value="Sent">Sent</option>
            <option value="Processing">Processing</option>
            <option value="Pending">Pending</option>
            <option value="Failed">Failed</option>
          </select>
        </div>
      </div>

      <Card className="shadow-sm">
        <div className="p-1">
          <DataTable 
            columns={columns} 
            data={filteredData} 
            searchKey="phone" 
            searchPlaceholder="Search by phone number..."
          />
        </div>
      </Card>
    </div>
  );
}

export default function DeliveryStatusPage() {
  return (
    <Suspense fallback={<Skeleton className="h-[500px] w-full rounded-xl" />}>
      <DeliveryStatusContent />
    </Suspense>
  );
}