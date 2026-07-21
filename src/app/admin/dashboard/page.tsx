"use client";

import { useQueries } from "@tanstack/react-query";
import { DashboardService, DashboardResponse } from "@/services/dashboard.service";
import { ConsultationService, Consultation } from "@/services/consultation.service";
import { EnquiryService, ContactEnquiry } from "@/services/enquiry.service";
import { StatsCard } from "@/components/cards/stats-card";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  CalendarDays, 
  Clock, 
  Mail,
  MessageSquare,
  AlertTriangle,
  ArrowRight,
  Inbox,
  CalendarX,
  MessageCircleOff
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { StatusBadge } from "@/components/ui/status-badge";
import Link from "next/link";
import { useEffect } from "react";

export default function DashboardPage() {
  const results = useQueries({
    queries: [
      { queryKey: ["dashboard-stats"], queryFn: DashboardService.getStats, retry: false },
      { queryKey: ["consultations"], queryFn: ConsultationService.getAll, retry: false },
      { queryKey: ["enquiries"], queryFn: EnquiryService.getAll, retry: false },
    ]
  });

  const isLoading = results.some(r => r.isLoading);
  const isError = results.some(r => r.isError);

  const handleRetry = () => {
    results.forEach(r => r.refetch());
  };

  useEffect(() => {
    if (isError) {
      const errors = results.map(r => r.error).filter(e => e !== null);
      if (errors.length > 0) {
        console.warn("Dashboard API Errors:", errors);
      }
    }
  }, [isError, results]);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-32 w-full rounded-xl" />
          ))}
        </div>
        <Skeleton className="h-[300px] w-full rounded-xl" />
        <Skeleton className="h-[300px] w-full rounded-xl" />
      </div>
    );
  }

  const statsData = (results[0].data as DashboardResponse | undefined);
  const rawConsultations = results[1].data;
  const consultations = Array.isArray(rawConsultations) ? rawConsultations : [];
  
  const rawEnquiries = results[2].data;
  const enquiries = Array.isArray(rawEnquiries) ? rawEnquiries : [];

  if (isError && !statsData) {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <Card className="border-destructive/50 bg-destructive/10">
          <CardHeader>
            <CardTitle className="text-destructive flex items-center gap-2">
              <AlertTriangle className="h-5 w-5" />
              Unable to Load Dashboard
            </CardTitle>
            <CardDescription className="text-destructive/80 text-base mt-2">
              We encountered a problem while retrieving your dashboard data. Please check your connection and try again.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="outline" className="border-destructive/50 text-destructive hover:bg-destructive/10" onClick={handleRetry}>
              Retry Connection
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const isToday = (dateString: string) => {
    if (!dateString) return false;
    const today = new Date();
    const date = new Date(dateString);
    return date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear();
  };

  const todaysConsultations = consultations.filter(c => isToday(c.date)).length;
  const pendingConsultations = statsData?.dashboard?.consultations?.pending_consultations || 0;
  const newEnquiries = statsData?.dashboard?.enquiries?.new_enquiries || 0;
  const campaignsSentToday = statsData?.campaigns?.filter(c => isToday(c.uploadDate)).length || 0;

  const recentConsultations = [...consultations]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 5);

  const recentEnquiries = [...enquiries]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 5);

  const latestCampaign = statsData?.campaigns?.[0] || null;

  const formatDate = (dateStr: string) => {
    if (!dateStr) return "N/A";
    return new Date(dateStr).toLocaleDateString("en-IN", {
      day: "numeric", month: "short", year: "numeric"
    });
  };

  return (
    <div className="space-y-6 pb-10">
      <div className="flex items-center justify-between space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
      </div>

      {/* Row 1: Statistic Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard title="Today's Consultations" value={todaysConsultations} icon={CalendarDays} />
        <StatsCard title="Pending Consultations" value={pendingConsultations} icon={Clock} />
        <StatsCard title="New Contact Enquiries" value={newEnquiries} icon={Mail} />
        <StatsCard title="Campaigns Sent Today" value={campaignsSentToday} icon={MessageSquare} />
      </div>

      {/* Row 2: Recent Consultations */}
      <Card className="shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Recent Consultations</CardTitle>
            <CardDescription>Latest 5 consultations scheduled</CardDescription>
          </div>
          <Link href="/admin/consultations">
            <Button variant="outline" size="sm" className="gap-2">
              View All Consultations <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </CardHeader>
        <CardContent>
          {recentConsultations.length > 0 ? (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Client Name</TableHead>
                    <TableHead>Service</TableHead>
                    <TableHead>Preferred Date &amp; Time</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {recentConsultations.map((consultation, i) => (
                    <TableRow key={consultation.id || consultation._id || i}>
                      <TableCell className="font-medium">{consultation.clientName}</TableCell>
                      <TableCell>{consultation.service}</TableCell>
                      <TableCell>
                        {formatDate(consultation.date)} at {consultation.time}
                      </TableCell>
                      <TableCell>
                        <StatusBadge status={consultation.status} />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-16 text-muted-foreground bg-muted/10 rounded-xl border border-dashed gap-4">
              <CalendarX className="w-12 h-12 text-muted-foreground/50" />
              <div className="text-center">
                <p className="text-base font-medium text-foreground">No consultations scheduled yet.</p>
                <p className="text-sm">When clients book a consultation, they will appear here.</p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Row 3: Recent Contact Enquiries */}
      <Card className="shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Recent Contact Enquiries</CardTitle>
            <CardDescription>Latest 5 enquiries received</CardDescription>
          </div>
          <Link href="/admin/enquiries">
            <Button variant="outline" size="sm" className="gap-2">
              View All Enquiries <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </CardHeader>
        <CardContent>
          {recentEnquiries.length > 0 ? (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Subject</TableHead>
                    <TableHead>Received Date</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {recentEnquiries.map((enquiry, i) => (
                    <TableRow key={enquiry.id || enquiry._id || i}>
                      <TableCell className="font-medium">{enquiry.name}</TableCell>
                      <TableCell className="max-w-[200px] truncate" title={enquiry.message}>
                        {enquiry.message}
                      </TableCell>
                      <TableCell>{formatDate(enquiry.date)}</TableCell>
                      <TableCell>
                        <StatusBadge status={enquiry.status} />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-16 text-muted-foreground bg-muted/10 rounded-xl border border-dashed gap-4">
              <Inbox className="w-12 h-12 text-muted-foreground/50" />
              <div className="text-center">
                <p className="text-base font-medium text-foreground">No enquiries received yet.</p>
                <p className="text-sm">New messages from the contact form will show up here.</p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Row 4: Latest WhatsApp Campaign Summary */}
      <Card className="shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Latest WhatsApp Campaign</CardTitle>
            <CardDescription>Performance summary of the most recent campaign</CardDescription>
          </div>
          <Link href="/admin/outreach/history">
            <Button variant="outline" size="sm" className="gap-2">
              View Campaign History <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </CardHeader>
        <CardContent>
          {latestCampaign ? (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-6 border rounded-xl p-6 bg-muted/5">
              <div className="lg:col-span-2">
                <p className="text-sm text-muted-foreground mb-1">Campaign Name</p>
                <p className="font-semibold text-lg">{latestCampaign.name || "Unnamed Campaign"}</p>
                <p className="text-sm text-muted-foreground mt-1">Sent: {formatDate(latestCampaign.uploadDate)}</p>
              </div>
              <div className="bg-background rounded-lg p-3 border shadow-sm">
                <p className="text-xs text-muted-foreground mb-1">Total Recipients</p>
                <p className="font-bold text-2xl">{latestCampaign.totalRecipients}</p>
              </div>
              <div className="bg-background rounded-lg p-3 border shadow-sm">
                <p className="text-xs text-muted-foreground mb-1">Delivered (Sent)</p>
                <p className="font-bold text-2xl text-emerald-600">{latestCampaign.sent}</p>
              </div>
              <div className="bg-background rounded-lg p-3 border shadow-sm">
                <p className="text-xs text-muted-foreground mb-1">Pending</p>
                <p className="font-bold text-2xl text-amber-600">{latestCampaign.pending}</p>
              </div>
              <div className="bg-background rounded-lg p-3 border shadow-sm">
                <p className="text-xs text-muted-foreground mb-1">Failed</p>
                <p className="font-bold text-2xl text-destructive">{latestCampaign.failed}</p>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-16 text-muted-foreground bg-muted/10 rounded-xl border border-dashed gap-4">
              <MessageCircleOff className="w-12 h-12 text-muted-foreground/50" />
              <div className="text-center">
                <p className="text-base font-medium text-foreground">No campaigns have been sent yet.</p>
                <p className="text-sm">When you send a WhatsApp campaign, the analytics will appear here.</p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
