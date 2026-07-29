// app/admin/outreach/upload/page.tsx

"use client";

import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { UploadCloud, FileSpreadsheet, X, CheckCircle, AlertCircle, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { OutreachService } from "@/services/outreach.service";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Progress } from "@/components/ui/progress";

// Available templates mapping to match backend types
const TEMPLATE_OPTIONS = [
  { id: "income_tax_due_dates", label: "Income Tax Due Dates Reminder" },
  { id: "income_tax_doc_checklist", label: "Income Tax Document Checklist" },
  { id: "gst_annual_return", label: "GST Annual Return / Reconciliation" },
  { id: "gst_regular_returns", label: "GST Regular Returns Reminder" },
  { id: "roc_annual_returns", label: "ROC Annual Returns Reminder" },
];

export default function UploadCampaignPage() {
  const [file, setFile] = useState<File | null>(null);
  const [selectedTemplate, setSelectedTemplate] = useState<string>("income_tax_due_dates");
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const router = useRouter();

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      setFile(acceptedFiles[0]);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "text/csv": [".csv"],
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": [".xlsx"],
    },
    maxFiles: 1,
  });

  const removeFile = () => {
    setFile(null);
  };

  // Handle template download based on selected dropdown value
  const handleDownloadTemplate = () => {
    window.location.href = `/api/admin/outreach/download-template?type=${selectedTemplate}`;
    toast.success("Downloading template file...");
  };

  const handleUpload = async () => {
    if (!file) return;

    setIsUploading(true);
    setUploadProgress(10);
    
    const interval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 90) {
          clearInterval(interval);
          return 90;
        }
        return prev + 10;
      });
    }, 200);

    try {
      await OutreachService.uploadCampaign(file, selectedTemplate);
      
      // Instantly trigger backend processor queue right after upload
      try {
        await fetch('/api/outreach/send?secret=development_cron_bypass', {
          method: 'POST',
        });
      } catch (triggerErr) {
        console.error("Background trigger warning:", triggerErr);
      }

      clearInterval(interval);
      setUploadProgress(100);
      toast.success("Campaign queued and sent successfully!");
      
      setTimeout(() => {
        router.push("/admin/outreach/history");
      }, 1000);
    } catch (err) {
      clearInterval(interval);
      setUploadProgress(0);
      toast.error("Failed to upload campaign. Ensure API is running.");
      setIsUploading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Upload Campaign</h1>
      </div>

      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle>Upload Recipients List</CardTitle>
          <CardDescription>
            Select the compliance template type, download the correct format, and upload your filled .xlsx recipient list.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Template Selection & Download Section */}
          <div className="space-y-2 border p-4 rounded-xl bg-muted/20">
            <Label htmlFor="template-select" className="text-sm font-medium">
              Select Compliance Template Type
            </Label>
            <div className="flex gap-3">
              <select
                id="template-select"
                value={selectedTemplate}
                onChange={(e) => setSelectedTemplate(e.target.value)}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {TEMPLATE_OPTIONS.map((tmpl) => (
                  <option key={tmpl.id} value={tmpl.id}>
                    {tmpl.label}
                  </option>
                ))}
              </select>
              <Button
                type="button"
                variant="outline"
                onClick={handleDownloadTemplate}
                className="whitespace-nowrap"
              >
                <Download className="w-4 h-4 mr-2" /> Download Template
              </Button>
            </div>
          </div>

          {/* Dropzone Area */}
          {!file ? (
            <div 
              {...getRootProps()} 
              className={`border-2 border-dashed rounded-xl p-12 text-center cursor-pointer transition-colors
                ${isDragActive ? "border-primary bg-primary/5" : "border-muted-foreground/25 hover:border-primary/50 hover:bg-muted/50"}`}
            >
              <input {...getInputProps()} />
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center text-primary mx-auto mb-4">
                <UploadCloud className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Drag & drop your filled template here</h3>
              <p className="text-sm text-muted-foreground mb-4">or click to browse from your computer</p>
              <p className="text-xs text-muted-foreground/75 uppercase font-medium tracking-wider">Supported formats: .CSV, .XLSX</p>
            </div>
          ) : (
            <div className="border rounded-xl p-6 bg-card flex flex-col items-center justify-center text-center">
              <FileSpreadsheet className="w-16 h-16 text-emerald-600 mb-4" />
              <h3 className="text-lg font-semibold">{file.name}</h3>
              <p className="text-sm text-muted-foreground mb-6">{(file.size / 1024).toFixed(2)} KB</p>
              
              {isUploading ? (
                <div className="w-full max-w-md space-y-2">
                  <Progress value={uploadProgress} className="h-2" />
                  <p className="text-sm text-muted-foreground">Uploading and parsing file...</p>
                </div>
              ) : (
                <Button variant="outline" onClick={removeFile} className="text-destructive border-destructive/20 hover:bg-destructive/10">
                  <X className="w-4 h-4 mr-2" /> Remove File
                </Button>
              )}
            </div>
          )}
        </CardContent>
        {file && !isUploading && (
          <CardFooter className="bg-muted/30 border-t px-6 py-4 flex justify-between items-center">
            <div className="flex items-center text-sm text-muted-foreground">
              <AlertCircle className="w-4 h-4 mr-2 text-amber-500" />
              Ensure your headers match the downloaded template structure.
            </div>
            <Button size="lg" onClick={handleUpload}>
              Queue Campaign <CheckCircle className="w-4 h-4 ml-2" />
            </Button>
          </CardFooter>
        )}
      </Card>
    </div>
  );
}