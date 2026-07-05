"use client";

import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { OutreachService, CampaignHistory } from "@/services/outreach.service";
import { DataTable } from "@/components/tables/data-table";
import { ColumnDef } from "@tanstack/react-table";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { AlertTriangle } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default function CampaignHistoryPage() {
  const router = useRouter();

  const { data = [], isLoading, isError, error } = useQuery({
    queryKey: ["campaignsHistory"],
    queryFn: OutreachService.getCampaignHistory
  });

  const columns: ColumnDef<CampaignHistory>[] = [
    {
      accessorKey: "name",
      header: "Campaign Name",
      cell: ({ row }) => <div className="font-medium text-primary">{row.original.name || "Unnamed"}</div>,
    },
    {
      accessorKey: "uploadDate",
      header: "Upload Date",
      cell: ({ row }) => row.original.uploadDate ? new Date(row.original.uploadDate).toLocaleString() : "-",
    },
    {
      accessorKey: "totalRecipients",
      header: "Total Recipients",
      cell: ({ row }) => row.original.totalRecipients || 0,
    },
    {
      accessorKey: "sent",
      header: "Sent",
      cell: ({ row }) => (
        <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200">
          {row.original.sent || 0}
        </Badge>
      ),
    },
    {
      accessorKey: "pending",
      header: "Pending",
      cell: ({ row }) => (
        <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">
          {row.original.pending || 0}
        </Badge>
      ),
    },
    {
      accessorKey: "failed",
      header: "Failed",
      cell: ({ row }) => (
        <Badge variant="outline" className="bg-destructive/10 text-destructive border-destructive/20">
          {row.original.failed || 0}
        </Badge>
      ),
    },
  ];

  if (isLoading) {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold tracking-tight">Campaign History</h1>
        <Skeleton className="h-[500px] w-full rounded-xl" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold tracking-tight">Campaign History</h1>
        <Card className="border-destructive/50 bg-destructive/10">
          <CardHeader>
            <CardTitle className="text-destructive flex items-center gap-2">
              <AlertTriangle className="h-5 w-5" />
              Connection Error
            </CardTitle>
            <CardDescription className="text-destructive/80">
              {error instanceof Error ? error.message : "Failed to load campaign history. Ensure backend APIs are running."}
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Campaign History</h1>
      </div>

      <Card className="shadow-sm">
        <div className="p-1">
          <DataTable 
            columns={columns} 
            data={data} 
            searchKey="name" 
            searchPlaceholder="Search campaigns..."
            onRowClick={(row) => {
              const rowId = row.id || row._id;
              if (rowId) {
                router.push(`/admin/outreach/delivery?campaignId=${rowId}`);
              }
            }}
          />
        </div>
      </Card>
    </div>
  );
}
