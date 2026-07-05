"use client";

import { useQuery } from "@tanstack/react-query";
import { DashboardService } from "@/services/dashboard.service";
import { CampaignHistory } from "@/services/outreach.service";
import { StatsCard } from "@/components/cards/stats-card";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  Users, 
  CalendarDays, 
  CheckCircle, 
  XCircle, 
  Clock, 
  MessageSquare, 
  AlertTriangle,
  Briefcase,
  Mail,
  Activity
} from "lucide-react";
import { 
  PieChart, Pie, Cell, Legend, Tooltip as RechartsTooltip, ResponsiveContainer
} from "recharts";

export default function DashboardPage() {
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["dashboard-stats"],
    queryFn: DashboardService.getStats
  });

  if (isLoading) {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-32 w-full rounded-xl" />
          ))}
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-32 w-full rounded-xl" />
          ))}
        </div>
        <Skeleton className="h-[400px] w-full rounded-xl" />
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <Card className="border-destructive/50 bg-destructive/10">
          <CardHeader>
            <CardTitle className="text-destructive flex items-center gap-2">
              <AlertTriangle className="h-5 w-5" />
              Connection Error
            </CardTitle>
            <CardDescription className="text-destructive/80">
              {error instanceof Error ? error.message : "Failed to connect to the backend server."}
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  const { dashboard, campaigns } = data;
  const PIE_COLORS = ['#0F4C81', '#1D4ED8', '#60A5FA', '#EF4444'];

  const consultationStatusData = [
    { name: "Pending", value: dashboard.consultations.pending_consultations },
    { name: "Confirmed", value: dashboard.consultations.confirmed_consultations },
    { name: "Completed", value: dashboard.consultations.completed_consultations },
    { name: "Cancelled", value: dashboard.consultations.cancelled_consultations },
  ].filter(item => item.value > 0);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
      </div>

      {/* Row 1: Consultations */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
        <StatsCard title="Total Consultations" value={dashboard.consultations.total_consultations} icon={CalendarDays} />
        <StatsCard title="Pending" value={dashboard.consultations.pending_consultations} icon={Clock} />
        <StatsCard title="Confirmed" value={dashboard.consultations.confirmed_consultations} icon={CheckCircle} />
        <StatsCard title="Completed" value={dashboard.consultations.completed_consultations} icon={CheckCircle} className="bg-primary/5" />
        <StatsCard title="Cancelled" value={dashboard.consultations.cancelled_consultations} icon={XCircle} />
      </div>

      {/* Row 2: Clients & Campaigns */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <StatsCard title="Total Clients" value={dashboard.clients.total_clients} icon={Users} />
        <StatsCard title="Total Campaigns" value={campaigns.length} icon={MessageSquare} />
        <StatsCard title="New Enquiries" value={dashboard.enquiries.new_enquiries} icon={Mail} />
      </div>

      {/* Row 3: Other */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-2">
        <StatsCard title="Career Applications" value={dashboard.careers.total_applications} icon={Briefcase} />
        <StatsCard title="Contact Enquiries" value={dashboard.enquiries.total_enquiries} icon={Mail} />
      </div>

      {/* Charts */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-2">
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle>Consultation Status</CardTitle>
            <CardDescription>Current status distribution</CardDescription>
          </CardHeader>
          <CardContent className="h-[300px]">
            {consultationStatusData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={consultationStatusData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {consultationStatusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                    ))}
                  </Pie>
                  <RechartsTooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                No consultation data available
              </div>
            )}
          </CardContent>
        </Card>

        {/* Recent Campaigns (Activity) */}
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle>Recent Campaigns</CardTitle>
            <CardDescription>Latest outreach campaigns</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4 max-h-[300px] overflow-y-auto">
              {campaigns.slice(0, 5).map((campaign: CampaignHistory, idx: number) => (
                <div key={idx} className="flex items-center gap-4 border-b last:border-0 pb-4 last:pb-0">
                  <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
                    <Activity className="w-5 h-5 text-muted-foreground" />
                  </div>
                  <div className="flex-1 space-y-1">
                    <p className="text-sm font-medium leading-none">{campaign.name || "Unnamed Campaign"}</p>
                    <p className="text-sm text-muted-foreground">
                      Status: {campaign.status || "Unknown"}
                    </p>
                  </div>
                </div>
              ))}
              {campaigns.length === 0 && (
                <p className="text-sm text-muted-foreground text-center py-4">No recent campaigns.</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
