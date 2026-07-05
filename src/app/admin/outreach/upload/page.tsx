"use client";

import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { UploadCloud, FileSpreadsheet, X, CheckCircle, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { OutreachService } from "@/services/outreach.service";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Progress } from "@/components/ui/progress";

export default function UploadCampaignPage() {
  const [file, setFile] = useState<File | null>(null);
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

  const handleUpload = async () => {
    if (!file) return;

    setIsUploading(true);
    setUploadProgress(10);
    
    // Simulate progress bar for better UX
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
      await OutreachService.uploadCampaign(file);
      clearInterval(interval);
      setUploadProgress(100);
      toast.success("Campaign queued successfully!");
      
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
            Upload a .csv or .xlsx file containing Name, Phone, and Reminder Type.
          </CardDescription>
        </CardHeader>
        <CardContent>
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
              <h3 className="text-lg font-semibold mb-2">Drag & drop your file here</h3>
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
              Please ensure your file has the correct headers.
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
