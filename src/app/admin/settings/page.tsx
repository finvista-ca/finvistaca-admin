// app/admin/settings/page.tsx

"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";
import { Save, Building2, Phone, Mail, MapPin, Briefcase, Plus, Trash2, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";

export default function SettingsPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  // 1. General Settings State (Matching the frontend contact details exactly)
  const [general, setGeneral] = useState({
    primary_phone: "",
    support_email: "",
    office_address: "",
  });

  // 2. Branches State
  const [branches, setBranches] = useState<any[]>([]);
  const [newBranch, setNewBranch] = useState({ branch_name: "", address: "", phone: "", email: "" });

  // 3. Careers State
  const [jobs, setJobs] = useState<any[]>([]);
  const [newJob, setNewJob] = useState({ title: "", department: "", location: "", jobType: "Full-time", description: "" });

  // Fetch all settings data on load
  useEffect(() => {
    async function loadData() {
      try {
        const [settingsRes, branchesRes, jobsRes] = await Promise.all([
          fetch("/api/admin/settings"),
          fetch("/api/admin/branches"),
          fetch("/api/admin/job-postings"),
        ]);

        if (settingsRes.ok) {
          const data = await settingsRes.json();
          if (data.settings) setGeneral(data.settings);
        }
        if (branchesRes.ok) {
          const data = await branchesRes.json();
          setBranches(data.branches || data);
        }
        if (jobsRes.ok) {
          const data = await jobsRes.json();
          setJobs(Array.isArray(data) ? data : data.jobs || []);
        }
      } catch (err) {
        toast.error("Failed to load settings data.");
      } finally {
        setIsLoading(false);
      }
    }
    loadData();
  }, []);

  // Save General Settings
  async function handleSaveGeneral(e: React.FormEvent) {
    e.preventDefault();
    setIsSaving(true);
    try {
      const res = await fetch("/api/admin/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ settings: general }),
      });
      if (res.ok) {
        toast.success("Contact details updated successfully.");
      } else {
        toast.error("Failed to save settings.");
      }
    } catch (err) {
      toast.error("An error occurred while saving.");
    } finally {
      setIsSaving(false);
    }
  }

  // Add Branch
  async function handleAddBranch(e: React.FormEvent) {
    e.preventDefault();
    if (!newBranch.branch_name || !newBranch.address) {
      toast.error("Branch name and address are required.");
      return;
    }
    try {
      const res = await fetch("/api/admin/branches", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newBranch),
      });
      const data = await res.json();
      if (res.ok) {
        setBranches([...branches, data.branch || data]);
        setNewBranch({ branch_name: "", address: "", phone: "", email: "" });
        toast.success("Branch added successfully.");
      } else {
        toast.error(data.error || "Failed to add branch.");
      }
    } catch (err) {
      toast.error("Failed to add branch.");
    }
  }

  // Delete Branch
  async function handleDeleteBranch(id: number) {
    try {
      const res = await fetch(`/api/admin/branches?id=${id}`, { method: "DELETE" });
      if (res.ok) {
        setBranches(branches.filter(b => b.id !== id));
        toast.success("Branch removed.");
      } else {
        toast.error("Failed to remove branch.");
      }
    } catch (err) {
      toast.error("Failed to delete branch.");
    }
  }

  // Add Job Posting
  async function handleAddJob(e: React.FormEvent) {
    e.preventDefault();
    if (!newJob.title) {
      toast.error("Job title is required.");
      return;
    }
    try {
      const res = await fetch("/api/admin/job-postings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newJob),
      });
      const data = await res.json();
      if (res.ok) {
        setJobs([data.job || data, ...jobs]);
        setNewJob({ title: "", department: "", location: "", jobType: "Full-time", description: "" });
        toast.success("Job posting created.");
      } else {
        toast.error(data.error || "Failed to create job.");
      }
    } catch (err) {
      toast.error("Failed to create job posting.");
    }
  }

  // Delete Job Posting
  async function handleDeleteJob(id: number) {
    try {
      const res = await fetch(`/api/admin/job-postings?id=${id}`, { method: "DELETE" });
      if (res.ok) {
        setJobs(jobs.filter(j => j.id !== id));
        toast.success("Job posting removed.");
      } else {
        toast.error("Failed to remove job.");
      }
    } catch (err) {
      toast.error("Failed to delete job posting.");
    }
  }

  if (isLoading) {
    return <div className="p-8 text-center text-muted-foreground">Loading settings...</div>;
  }

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Website & System Settings</h1>
        <p className="text-sm text-muted-foreground mt-1">Manage global firm contact details, branch networks, and public career listings.</p>
      </div>

      <Tabs defaultValue="general" className="w-full">
        <TabsList className="grid w-full sm:w-[450px] grid-cols-3">
          <TabsTrigger value="general">Contact Info</TabsTrigger>
          <TabsTrigger value="branches">Branches</TabsTrigger>
          <TabsTrigger value="careers">Career Postings</TabsTrigger>
        </TabsList>
        
        {/* TAB 1: GENERAL CONTACT INFO */}
        <TabsContent value="general" className="mt-6">
          <Card className="shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="w-5 h-5 text-primary" /> Public Contact Details
              </CardTitle>
              <CardDescription>
                Updates the contact phone number and email shown across the website CTA and footer sections.
              </CardDescription>
            </CardHeader>
            <form onSubmit={handleSaveGeneral}>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label className="flex items-center gap-2 font-medium">
                    <Phone className="w-4 h-4 text-muted-foreground" /> Contact Phone Number
                  </Label>
                  <Input 
                    value={general.primary_phone || ""}
                    onChange={(e) => setGeneral({ ...general, primary_phone: e.target.value })}
                    placeholder="+91 9908285223"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label className="flex items-center gap-2 font-medium">
                    <Mail className="w-4 h-4 text-muted-foreground" /> Contact Email Address
                  </Label>
                  <Input 
                    type="email"
                    value={general.support_email || ""}
                    onChange={(e) => setGeneral({ ...general, support_email: e.target.value })}
                    placeholder="finvistaca@gmail.com"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label className="flex items-center gap-2 font-medium">
                    <MapPin className="w-4 h-4 text-muted-foreground" /> Primary Office Address
                  </Label>
                  <Textarea 
                    value={general.office_address || ""}
                    onChange={(e) => setGeneral({ ...general, office_address: e.target.value })}
                    placeholder="Enter main office address"
                    className="min-h-[80px]"
                    required
                  />
                </div>
              </CardContent>
              <CardFooter className="border-t bg-muted/20 px-6 py-4">
                <Button type="submit" disabled={isSaving}>
                  {isSaving ? "Saving Changes..." : "Save Changes"}
                  {!isSaving && <Save className="w-4 h-4 ml-2" />}
                </Button>
              </CardFooter>
            </form>
          </Card>
        </TabsContent>

        {/* TAB 2: BRANCHES */}
        <TabsContent value="branches" className="mt-6 space-y-6">
          <Card className="shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building2 className="w-5 h-5 text-primary" /> Add New Branch Office
              </CardTitle>
              <CardDescription>Add branch locations to your network directory.</CardDescription>
            </CardHeader>
            <form onSubmit={handleAddBranch}>
              <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Branch Name</Label>
                  <Input 
                    placeholder="e.g. Visakhapatnam Branch" 
                    value={newBranch.branch_name}
                    onChange={(e) => setNewBranch({ ...newBranch, branch_name: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label>Phone</Label>
                  <Input 
                    placeholder="Branch Contact Phone" 
                    value={newBranch.phone}
                    onChange={(e) => setNewBranch({ ...newBranch, phone: e.target.value })}
                  />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label>Full Address</Label>
                  <Textarea 
                    placeholder="Street, City, State, Pincode" 
                    value={newBranch.address}
                    onChange={(e) => setNewBranch({ ...newBranch, address: e.target.value })}
                    required
                  />
                </div>
              </CardContent>
              <CardFooter className="border-t bg-muted/20 px-6 py-4 flex justify-end">
                <Button type="submit">
                  <Plus className="w-4 h-4 mr-2" /> Add Branch
                </Button>
              </CardFooter>
            </form>
          </Card>

          {/* Existing Branches List */}
          <div className="space-y-3">
            <h3 className="text-lg font-semibold tracking-tight">Active Branches ({branches.length})</h3>
            {branches.length === 0 ? (
              <p className="text-sm text-muted-foreground p-6 border rounded-xl text-center bg-card">No branches added yet.</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {branches.map((b) => (
                  <div key={b.id} className="border rounded-xl p-5 bg-card flex flex-col justify-between space-y-3 shadow-sm">
                    <div>
                      <h4 className="font-semibold text-base">{b.branch_name}</h4>
                      <p className="text-sm text-muted-foreground mt-1 whitespace-pre-line">{b.address}</p>
                      {b.phone && <p className="text-xs text-muted-foreground mt-2">📞 {b.phone}</p>}
                    </div>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="text-destructive hover:bg-destructive/10 w-fit"
                      onClick={() => handleDeleteBranch(b.id)}
                    >
                      <Trash2 className="w-4 h-4 mr-1.5" /> Remove
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </TabsContent>

        {/* TAB 3: CAREER POSTINGS */}
        <TabsContent value="careers" className="mt-6 space-y-6">
          <Card className="shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Briefcase className="w-5 h-5 text-primary" /> Post New Job Opening
              </CardTitle>
              <CardDescription>Instantly publish new job roles to your public careers page.</CardDescription>
            </CardHeader>
            <form onSubmit={handleAddJob}>
              <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Job Title</Label>
                  <Input 
                    placeholder="e.g. Tax Associate / Audit Trainee" 
                    value={newJob.title}
                    onChange={(e) => setNewJob({ ...newJob, title: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label>Department</Label>
                  <Input 
                    placeholder="e.g. Direct Tax / GST / Audit" 
                    value={newJob.department}
                    onChange={(e) => setNewJob({ ...newJob, department: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Location</Label>
                  <Input 
                    placeholder="e.g. Visakhapatnam / Remote" 
                    value={newJob.location}
                    onChange={(e) => setNewJob({ ...newJob, location: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Employment Type</Label>
                  <Input 
                    placeholder="e.g. Full-time / Internship" 
                    value={newJob.jobType}
                    onChange={(e) => setNewJob({ ...newJob, jobType: e.target.value })}
                  />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label>Job Description / Requirements</Label>
                  <Textarea 
                    placeholder="Outline roles, responsibilities, and qualifications..." 
                    value={newJob.description}
                    onChange={(e) => setNewJob({ ...newJob, description: e.target.value })}
                    className="min-h-[100px]"
                  />
                </div>
              </CardContent>
              <CardFooter className="border-t bg-muted/20 px-6 py-4 flex justify-end">
                <Button type="submit">
                  <Plus className="w-4 h-4 mr-2" /> Publish Job Posting
                </Button>
              </CardFooter>
            </form>
          </Card>

          {/* Existing Jobs List */}
          <div className="space-y-3">
            <h3 className="text-lg font-semibold tracking-tight">Active Job Listings ({jobs.length})</h3>
            {jobs.length === 0 ? (
              <p className="text-sm text-muted-foreground p-6 border rounded-xl text-center bg-card">No open positions posted yet.</p>
            ) : (
              <div className="space-y-4">
                {jobs.map((job) => (
                  <div key={job.id} className="border rounded-xl p-5 bg-card flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 shadow-sm">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <h4 className="font-semibold text-lg">{job.title}</h4>
                        <span className="text-xs bg-primary/10 text-primary px-2.5 py-0.5 rounded-full font-medium">{job.jobType || "Full-time"}</span>
                      </div>
                      <p className="text-sm text-muted-foreground">{job.department} • {job.location}</p>
                      {job.description && <p className="text-xs text-muted-foreground/80 mt-2 line-clamp-2">{job.description}</p>}
                    </div>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="text-destructive hover:bg-destructive/10 shrink-0"
                      onClick={() => handleDeleteJob(job.id)}
                    >
                      <Trash2 className="w-4 h-4 mr-1.5" /> Delete
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}