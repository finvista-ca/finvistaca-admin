"use client";

import { useState, useMemo, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ConsultationService, Consultation } from "@/services/consultation.service";
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
import { 
  AlertTriangle, Phone, MapPin, Briefcase, Calendar as CalendarIcon, 
  Clock, MessageSquare, Search, Download, RefreshCw, Eye, CheckCircle, 
  XCircle, CheckSquare, MessageCircle, Mail, User
} from "lucide-react";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { BranchBadge } from "@/components/ui/branch-badge";
import { BRANCHES } from "@/lib/constants";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export default function ConsultationsPage() {
  const queryClient = useQueryClient();
  const [selectedRow, setSelectedRow] = useState<Consultation | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  // Filters state
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [serviceFilter, setServiceFilter] = useState("All");
  const [branchFilter, setBranchFilter] = useState("All");
  const [sortOrder, setSortOrder] = useState<"newest" | "oldest">("newest");
  const [dateFilter, setDateFilter] = useState("");

  const { data = [], isLoading, isError, error, refetch } = useQuery({
    queryKey: ["consultations"],
    queryFn: ConsultationService.getAll,
    retry: false
  });

  const rawData = Array.isArray(data) ? data : [];

  // Log error to console, avoid showing technical error to user
  useEffect(() => {
    if (isError && error) {
      console.warn("Consultations API Error:", error);
    }
  }, [isError, error]);

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
    onError: (err) => {
      console.error(err);
      toast.error("Failed to update status");
    }
  });

  const handleUpdateStatus = (row: Consultation, status: Consultation["status"]) => {
    const rowId = row.id || row._id;
    if (!rowId) {
      toast.error("Invalid booking ID");
      return;
    }
    updateMutation.mutate({ id: rowId, status });
  };

  // Filter by branch first (affects stats and list)
  const branchFilteredData = useMemo(() => {
    let result = [...rawData];
    if (branchFilter !== "All") {
      result = result.filter(c => c.branch === branchFilter);
    }
    return result;
  }, [rawData, branchFilter]);

  // Compute stats
  const stats = useMemo(() => {
    return {
      pending: branchFilteredData.filter(c => c.status === "Pending").length,
      confirmed: branchFilteredData.filter(c => c.status === "Confirmed").length,
      completed: branchFilteredData.filter(c => c.status === "Completed").length,
      cancelled: branchFilteredData.filter(c => c.status === "Cancelled").length,
    };
  }, [branchFilteredData]);

  const uniqueServices = useMemo(() => {
    const services = new Set(branchFilteredData.map(c => c.service).filter(Boolean));
    return Array.from(services);
  }, [branchFilteredData]);

  // Filter and sort data
  const filteredData = useMemo(() => {
    let result = [...branchFilteredData];

    // Search
    if (searchQuery) {
      const lowerQ = searchQuery.toLowerCase();
      result = result.filter(c => 
        (c.clientName && c.clientName.toLowerCase().includes(lowerQ)) ||
        (c.phone && c.phone.includes(lowerQ))
      );
    }

    // Status Filter
    if (statusFilter !== "All") {
      result = result.filter(c => c.status === statusFilter);
    }

    // Service Filter
    if (serviceFilter !== "All") {
      result = result.filter(c => c.service === serviceFilter);
    }

    // Date Filter (Preferred Date)
    if (dateFilter) {
      result = result.filter(c => {
        if (!c.date) return false;
        const cDate = new Date(c.date).toISOString().split('T')[0];
        return cDate === dateFilter;
      });
    }

    // Sort
    result.sort((a, b) => {
      const timeA = new Date(a.date || 0).getTime();
      const timeB = new Date(b.date || 0).getTime();
      return sortOrder === "newest" ? timeB - timeA : timeA - timeB;
    });

    return result;
  }, [branchFilteredData, searchQuery, statusFilter, serviceFilter, sortOrder, dateFilter]);

  const exportToCSV = () => {
    if (!filteredData.length) {
      toast.error("No data to export.");
      return;
    }
    const headers = ["Client Name", "Phone", "Service", "Preferred Date", "Preferred Time", "Booked On", "Status", "Message"];
    const csvRows = [headers.join(",")];
    
    for (const row of filteredData) {
      const values = [
        `"${row.clientName || ""}"`,
        `"${row.phone || ""}"`,
        `"${row.service || ""}"`,
        `"${row.date || ""}"`,
        `"${row.time || ""}"`,
        `"${row.bookedOn || row.createdAt || "N/A"}"`,
        `"${row.status || ""}"`,
        `"${(row.message || "").replace(/"/g, '""')}"`
      ];
      csvRows.push(values.join(","));
    }
    
    const blob = new Blob([csvRows.join("\n")], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.setAttribute("hidden", "");
    a.setAttribute("href", url);
    a.setAttribute("download", `consultations_${new Date().toISOString().split("T")[0]}.csv`);
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    toast.success("CSV Exported successfully!");
  };

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return "N/A";
    return new Date(dateStr).toLocaleDateString("en-IN", {
      day: "numeric", month: "short", year: "numeric"
    });
  };

  // Reusable actions component for table rows and mobile cards
  const RowActions = ({ row }: { row: Consultation }) => (
    <div className="flex items-center gap-1">
      <Button 
        variant="ghost" 
        size="icon" 
        title="View Details"
        className="w-8 h-8 hover:bg-primary/10 hover:text-primary" 
        onClick={() => { setSelectedRow(row); setIsDrawerOpen(true); }}
      >
        <Eye className="w-4 h-4" />
      </Button>
      
      <Button 
        variant="ghost" 
        size="icon" 
        title="Confirm"
        className="w-8 h-8 hover:bg-emerald-100 hover:text-emerald-700" 
        onClick={() => handleUpdateStatus(row, "Confirmed")} 
        disabled={row.status === "Confirmed" || updateMutation.isPending}
      >
        <CheckCircle className="w-4 h-4" />
      </Button>
      
      <Button 
        variant="ghost" 
        size="icon" 
        title="Complete"
        className="w-8 h-8 hover:bg-blue-100 hover:text-blue-700" 
        onClick={() => handleUpdateStatus(row, "Completed")} 
        disabled={row.status === "Completed" || updateMutation.isPending}
      >
        <CheckSquare className="w-4 h-4" />
      </Button>
      
      <Button 
        variant="ghost" 
        size="icon" 
        title="Cancel"
        className="w-8 h-8 hover:bg-destructive/10 hover:text-destructive" 
        onClick={() => handleUpdateStatus(row, "Cancelled")} 
        disabled={row.status === "Cancelled" || updateMutation.isPending}
      >
        <XCircle className="w-4 h-4" />
      </Button>
      
      <a href={`https://wa.me/${row.phone?.replace(/\D/g,'')}`} target="_blank" rel="noreferrer" title="Open WhatsApp">
        <Button variant="ghost" size="icon" className="w-8 h-8 hover:bg-green-100 hover:text-green-700">
          <MessageCircle className="w-4 h-4" />
        </Button>
      </a>
      
      <a href={`tel:${row.phone}`} title="Call Client">
        <Button variant="ghost" size="icon" className="w-8 h-8 hover:bg-muted">
          <Phone className="w-4 h-4" />
        </Button>
      </a>
    </div>
  );

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex flex-col gap-1">
          <h1 className="text-3xl font-bold tracking-tight">Consultations</h1>
          <p className="text-muted-foreground">Manage, schedule and track all client consultation requests.</p>
        </div>
        <div className="grid gap-4 grid-cols-2 md:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-24 w-full rounded-xl" />
          ))}
        </div>
        <Skeleton className="h-16 w-full rounded-xl" />
        <Skeleton className="h-[400px] w-full rounded-xl" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="space-y-6">
        <div className="flex flex-col gap-1">
          <h1 className="text-3xl font-bold tracking-tight">Consultations</h1>
          <p className="text-muted-foreground">Manage, schedule and track all client consultation requests.</p>
        </div>
        <Card className="border-destructive/50 bg-destructive/10 shadow-sm">
          <CardHeader>
            <CardTitle className="text-destructive flex items-center gap-2">
              <AlertTriangle className="h-5 w-5" />
              Unable to load consultation data.
            </CardTitle>
            <CardDescription className="text-destructive/80 text-base mt-2">
              We couldn&apos;t retrieve consultation requests at the moment. Please check your connection and try again.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="outline" className="border-destructive/50 text-destructive hover:bg-destructive/10" onClick={() => refetch()}>
              Retry Connection
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-10">
      {/* Header */}
      <div className="flex flex-col gap-1">
        <h1 className="text-3xl font-bold tracking-tight">Consultations</h1>
        <p className="text-muted-foreground">Manage, schedule and track all client consultation requests.</p>
      </div>

      {/* Quick Summary Cards */}
      <div className="grid gap-4 grid-cols-2 md:grid-cols-4">
        <Card className="bg-amber-500/10 border-amber-200/50 shadow-none">
          <CardHeader className="p-4 flex flex-row items-center justify-between space-y-0">
            <CardTitle className="text-sm font-medium text-amber-800">Pending</CardTitle>
            <Clock className="w-4 h-4 text-amber-600" />
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <div className="text-2xl font-bold text-amber-900">{stats.pending}</div>
          </CardContent>
        </Card>
        <Card className="bg-emerald-500/10 border-emerald-200/50 shadow-none">
          <CardHeader className="p-4 flex flex-row items-center justify-between space-y-0">
            <CardTitle className="text-sm font-medium text-emerald-800">Confirmed</CardTitle>
            <CheckCircle className="w-4 h-4 text-emerald-600" />
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <div className="text-2xl font-bold text-emerald-900">{stats.confirmed}</div>
          </CardContent>
        </Card>
        <Card className="bg-blue-500/10 border-blue-200/50 shadow-none">
          <CardHeader className="p-4 flex flex-row items-center justify-between space-y-0">
            <CardTitle className="text-sm font-medium text-blue-800">Completed</CardTitle>
            <CheckSquare className="w-4 h-4 text-blue-600" />
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <div className="text-2xl font-bold text-blue-900">{stats.completed}</div>
          </CardContent>
        </Card>
        <Card className="bg-destructive/10 border-destructive/20 shadow-none">
          <CardHeader className="p-4 flex flex-row items-center justify-between space-y-0">
            <CardTitle className="text-sm font-medium text-destructive">Cancelled</CardTitle>
            <XCircle className="w-4 h-4 text-destructive" />
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <div className="text-2xl font-bold text-destructive">{stats.cancelled}</div>
          </CardContent>
        </Card>
      </div>

      {/* Toolbar */}
      <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between bg-card p-4 rounded-xl border shadow-sm">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:flex lg:flex-row items-center gap-3 w-full xl:w-auto">
          <div className="relative w-full lg:w-64">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Search name or phone..." 
              className="pl-9 bg-background w-full"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Select value={branchFilter} onValueChange={(v) => setBranchFilter(v || "All")}>
            <SelectTrigger className="w-full lg:w-[150px] bg-background">
              <SelectValue placeholder="Branch" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All">All Branches</SelectItem>
              {BRANCHES.map(b => (
                <SelectItem key={b} value={b}>
                  {b === "Vijayawada" ? "Vijayawada (Head Office)" : b}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={statusFilter} onValueChange={(v) => setStatusFilter(v || "All")}>
            <SelectTrigger className="w-full lg:w-[130px] bg-background">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All">All Statuses</SelectItem>
              <SelectItem value="Pending">Pending</SelectItem>
              <SelectItem value="Confirmed">Confirmed</SelectItem>
              <SelectItem value="Completed">Completed</SelectItem>
              <SelectItem value="Cancelled">Cancelled</SelectItem>
            </SelectContent>
          </Select>
          <Select value={serviceFilter} onValueChange={(v) => setServiceFilter(v || "All")}>
            <SelectTrigger className="w-full lg:w-[150px] bg-background">
              <SelectValue placeholder="Service" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All">All Services</SelectItem>
              {uniqueServices.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
            </SelectContent>
          </Select>
          <div className="relative w-full lg:w-[150px]">
             <Input 
              type="date"
              className="bg-background w-full"
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              title="Filter by Preferred Date"
            />
          </div>
          <Select value={sortOrder} onValueChange={(v) => setSortOrder((v || "newest") as any)}>
            <SelectTrigger className="w-full lg:w-[130px] bg-background">
              <SelectValue placeholder="Sort" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="newest">Newest First</SelectItem>
              <SelectItem value="oldest">Oldest First</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="flex items-center gap-2 justify-end w-full xl:w-auto">
          <Button variant="outline" className="gap-2 bg-background w-full sm:w-auto" onClick={exportToCSV}>
            <Download className="w-4 h-4" /> <span className="hidden sm:inline">Export CSV</span>
          </Button>
          <Button variant="outline" size="icon" className="bg-background shrink-0" onClick={() => refetch()} title="Refresh Data">
            <RefreshCw className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Main Content Area */}
      {filteredData.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-center bg-card rounded-xl border shadow-sm px-4">
          <div className="w-20 h-20 bg-muted/50 rounded-full flex items-center justify-center mb-6">
            <CalendarIcon className="w-10 h-10 text-muted-foreground/50" />
          </div>
          <h3 className="text-xl font-semibold text-foreground mb-2">No consultation requests yet.</h3>
          <p className="text-muted-foreground max-w-sm mb-6">
            New consultation requests submitted from the website will appear here.
          </p>
          <Button variant="outline" className="gap-2" onClick={() => refetch()}>
            <RefreshCw className="w-4 h-4" /> Refresh
          </Button>
        </div>
      ) : (
        <>
          {/* Desktop Table View */}
          <div className="hidden lg:block overflow-x-auto rounded-xl border bg-card shadow-sm">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/30">
                  <TableHead>Client</TableHead>
                  <TableHead>Phone</TableHead>
                  <TableHead>Service</TableHead>
                  <TableHead>Preferred Date</TableHead>
                  <TableHead>Preferred Time</TableHead>
                  <TableHead>Booked On</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredData.map((row, index) => (
                  <TableRow key={row.id || row._id || index}>
                    <TableCell className="font-medium">{row.clientName}</TableCell>
                    <TableCell>{row.phone}</TableCell>
                    <TableCell className="max-w-[150px] truncate" title={row.service}>{row.service}</TableCell>
                    <TableCell>{formatDate(row.date)}</TableCell>
                    <TableCell>{row.time}</TableCell>
                    <TableCell>{formatDate(row.bookedOn || row.createdAt)}</TableCell>
                    <TableCell>
                      <StatusBadge status={row.status} />
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end">
                        <RowActions row={row} />
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {/* Mobile Stacked Cards View */}
          <div className="grid grid-cols-1 gap-4 lg:hidden">
            {filteredData.map((row, index) => (
              <Card key={row.id || row._id || index} className="shadow-sm">
                <CardContent className="p-4 space-y-4">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h3 className="font-semibold text-lg">{row.clientName}</h3>
                      <p className="text-sm text-muted-foreground">{row.phone}</p>
                    </div>
                    <StatusBadge status={row.status} />
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-sm bg-muted/30 p-3 rounded-lg border">
                    <div>
                      <p className="text-xs text-muted-foreground">Service</p>
                      <p className="font-medium truncate" title={row.service}>{row.service}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Preferred Date</p>
                      <p className="font-medium">{formatDate(row.date)}</p>
                    </div>
                  </div>
                  <div className="pt-2 border-t flex items-center justify-between overflow-x-auto">
                    <RowActions row={row} />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </>
      )}

      {/* Detailed Drawer */}
      <Sheet open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
        <SheetContent className="w-full sm:max-w-md overflow-y-auto">
          <SheetHeader className="mb-6">
            <SheetTitle>Consultation Workspace</SheetTitle>
            <SheetDescription>View details and manage this request.</SheetDescription>
          </SheetHeader>
          
          {selectedRow && (
            <div className="space-y-6">
              {/* Header Info */}
              <div className="flex items-center justify-between border-b pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                    <User className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg leading-tight">{selectedRow.clientName}</h3>
                    <p className="text-sm text-muted-foreground">Client Details</p>
                  </div>
                </div>
                <StatusBadge status={selectedRow.status} />
              </div>

              {/* Client Info */}
              <div className="space-y-4 text-sm">
                <h4 className="font-semibold text-foreground">Contact Information</h4>
                <div className="grid grid-cols-3 items-center gap-4">
                  <span className="text-muted-foreground flex items-center gap-2 col-span-1">
                    <Phone className="w-4 h-4" /> Phone
                  </span>
                  <span className="col-span-2 font-medium">{selectedRow.phone}</span>
                </div>
                {selectedRow.email && (
                  <div className="grid grid-cols-3 items-center gap-4">
                    <span className="text-muted-foreground flex items-center gap-2 col-span-1">
                      <Mail className="w-4 h-4" /> Email
                    </span>
                    <span className="col-span-2 font-medium break-all">{selectedRow.email}</span>
                  </div>
                )}
                <div className="grid grid-cols-3 items-center gap-4">
                  <span className="text-muted-foreground flex items-center gap-2 col-span-1">
                    <MapPin className="w-4 h-4" /> Branch
                  </span>
                  <BranchBadge branch={selectedRow.branch} className="col-span-2" />
                </div>
              </div>

              {/* Request Details */}
              <div className="space-y-4 text-sm pt-4 border-t">
                <h4 className="font-semibold text-foreground">Request Details</h4>
                <div className="grid grid-cols-3 items-start gap-4">
                  <span className="text-muted-foreground flex items-center gap-2 col-span-1">
                    <Briefcase className="w-4 h-4" /> Service
                  </span>
                  <span className="col-span-2 font-medium">{selectedRow.service}</span>
                </div>
                <div className="grid grid-cols-3 items-center gap-4">
                  <span className="text-muted-foreground flex items-center gap-2 col-span-1">
                    <CalendarIcon className="w-4 h-4" /> Date
                  </span>
                  <span className="col-span-2 font-medium">
                    {formatDate(selectedRow.date)}
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
                <div className="rounded-lg bg-muted/50 p-4 space-y-2 text-sm border border-muted shadow-sm">
                  <div className="font-semibold flex items-center gap-2">
                    <MessageSquare className="w-4 h-4" /> Notes / Message
                  </div>
                  <p className="text-muted-foreground italic leading-relaxed">&quot;{selectedRow.message}&quot;</p>
                </div>
              )}

              {/* Timeline */}
              <div className="pt-4 border-t">
                <h4 className="font-semibold text-sm mb-4">Request Timeline</h4>
                <div className="relative border-l-2 border-muted ml-3 space-y-6">
                  <div className="relative pl-6">
                    <div className="absolute w-3 h-3 bg-muted-foreground rounded-full -left-[7px] top-1.5 ring-4 ring-background" />
                    <p className="font-medium text-sm">Created</p>
                    <p className="text-xs text-muted-foreground">
                      Booked on {formatDate(selectedRow.bookedOn || selectedRow.createdAt)}
                    </p>
                  </div>
                  {['Confirmed', 'Completed', 'Cancelled'].includes(selectedRow.status) && (
                    <div className="relative pl-6">
                      <div className="absolute w-3 h-3 bg-primary rounded-full -left-[7px] top-1.5 ring-4 ring-background" />
                      <p className="font-medium text-sm">{selectedRow.status}</p>
                      <p className="text-xs text-muted-foreground">Status updated</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Drawer Actions */}
              <div className="pt-6 border-t space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <a href={`https://wa.me/${selectedRow.phone?.replace(/\D/g,'')}`} target="_blank" rel="noreferrer" className="w-full">
                    <Button variant="outline" className="w-full gap-2 border-green-200 text-green-700 hover:bg-green-50 shadow-sm">
                      <MessageCircle className="w-4 h-4" /> WhatsApp
                    </Button>
                  </a>
                  <a href={`tel:${selectedRow.phone}`} className="w-full">
                    <Button variant="outline" className="w-full gap-2 shadow-sm">
                      <Phone className="w-4 h-4" /> Call Client
                    </Button>
                  </a>
                </div>
                
                <h4 className="font-semibold text-sm mt-4">Update Status</h4>
                <div className="grid grid-cols-2 gap-3">
                  <Button 
                    variant="outline" 
                    className="w-full border-emerald-200 text-emerald-700 hover:bg-emerald-50 hover:text-emerald-800 shadow-sm"
                    onClick={() => handleUpdateStatus(selectedRow, "Confirmed")}
                    disabled={updateMutation.isPending || selectedRow.status === "Confirmed"}
                  >
                    Confirm
                  </Button>
                  <Button 
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white shadow-sm"
                    onClick={() => handleUpdateStatus(selectedRow, "Completed")}
                    disabled={updateMutation.isPending || selectedRow.status === "Completed"}
                  >
                    Complete
                  </Button>
                  <Button 
                    variant="destructive" 
                    className="w-full col-span-2 shadow-sm"
                    onClick={() => handleUpdateStatus(selectedRow, "Cancelled")}
                    disabled={updateMutation.isPending || selectedRow.status === "Cancelled"}
                  >
                    Cancel Booking
                  </Button>
                </div>
                <Button 
                  variant="ghost" 
                  className="w-full mt-2 text-muted-foreground"
                  onClick={() => setIsDrawerOpen(false)}
                >
                  Close
                </Button>
              </div>
            </div>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}