"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Save, Building2, Phone, Mail, MapPin, MessageCircle, Link, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";

export default function SettingsPage() {
  const [isSaving, setIsSaving] = useState(false);

  // General settings state
  const [generalData, setGeneralData] = useState({
    companyName: "Finvista Chartered Accountants",
    supportPhone: "+91 9876543210",
    supportEmail: "support@finvista.in",
    officeAddresses: "Vijayawada, Andhra Pradesh (Head Office)\nKakinada, Andhra Pradesh\nVisakhapatnam, Andhra Pradesh\nParvathipuram, Andhra Pradesh\nBobbili, Andhra Pradesh\nPeddapuram, Andhra Pradesh\nHyderabad, Telangana\nOdisha",
  });

  // WhatsApp settings state
  const [whatsappData, setWhatsappData] = useState({
    metaPhoneId: "123456789012345",
    whatsappTemplates: "remind_appt, doc_request, tax_update",
  });

  const handleGeneralChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setGeneralData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleWhatsappChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setWhatsappData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  async function onGeneralSubmit(e: React.FormEvent) {
    e.preventDefault();
    setIsSaving(true);
    // Simulate API save
    await new Promise((resolve) => setTimeout(resolve, 800));
    setIsSaving(false);
    toast.success("General settings updated successfully");
  }

  async function onWhatsappSubmit(e: React.FormEvent) {
    e.preventDefault();
    setIsSaving(true);
    // Simulate API save
    await new Promise((resolve) => setTimeout(resolve, 800));
    setIsSaving(false);
    toast.success("WhatsApp settings updated successfully");
  }

  return (
    <div className="space-y-6 max-w-5xl">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
      </div>

      <Tabs defaultValue="general" className="w-full">
        <TabsList className="grid w-full sm:w-[400px] grid-cols-2">
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="whatsapp">WhatsApp Integration</TabsTrigger>
        </TabsList>
        
        <TabsContent value="general" className="mt-6">
          <Card className="shadow-sm">
            <CardHeader>
              <CardTitle>Company Details</CardTitle>
              <CardDescription>
                Manage your firm&apos;s contact and public information.
              </CardDescription>
            </CardHeader>
            <form onSubmit={onGeneralSubmit}>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="companyName" className="flex items-center gap-2">
                      <Building2 className="w-4 h-4 text-muted-foreground" /> Company Name
                    </Label>
                    <Input 
                      id="companyName" 
                      name="companyName"
                      value={generalData.companyName}
                      onChange={handleGeneralChange}
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="supportEmail" className="flex items-center gap-2">
                      <Mail className="w-4 h-4 text-muted-foreground" /> Support Email
                    </Label>
                    <Input 
                      id="supportEmail" 
                      type="email" 
                      name="supportEmail"
                      value={generalData.supportEmail}
                      onChange={handleGeneralChange}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="supportPhone" className="flex items-center gap-2">
                      <Phone className="w-4 h-4 text-muted-foreground" /> Support Phone
                    </Label>
                    <Input 
                      id="supportPhone" 
                      name="supportPhone"
                      value={generalData.supportPhone}
                      onChange={handleGeneralChange}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="officeAddresses" className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-muted-foreground" /> Office Addresses
                  </Label>
                  <Textarea 
                    id="officeAddresses"
                    name="officeAddresses"
                    className="min-h-[100px]" 
                    value={generalData.officeAddresses}
                    onChange={handleGeneralChange}
                    required
                  />
                  <p className="text-[0.8rem] text-muted-foreground">
                    Enter addresses separated by a new line.
                  </p>
                </div>
              </CardContent>
              <CardFooter className="border-t bg-muted/20 px-6 py-4">
                <Button type="submit" disabled={isSaving}>
                  {isSaving ? "Saving..." : "Save Settings"}
                  {!isSaving && <Save className="w-4 h-4 ml-2" />}
                </Button>
              </CardFooter>
            </form>
          </Card>
        </TabsContent>
        
        <TabsContent value="whatsapp" className="mt-6">
          <Card className="shadow-sm border-emerald-100">
            <CardHeader className="bg-emerald-50/50 pb-8 border-b border-emerald-100">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-emerald-800 flex items-center gap-2">
                    <MessageCircle className="w-5 h-5" /> Meta WhatsApp Business API
                  </CardTitle>
                  <CardDescription className="mt-1.5">
                    Configure your WhatsApp integration for bulk messaging and automated reminders.
                  </CardDescription>
                </div>
                <Badge variant="outline" className="bg-emerald-100 text-emerald-800 border-emerald-200 gap-1.5 px-3 py-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Webhook Connected
                </Badge>
              </div>
            </CardHeader>
            <form onSubmit={onWhatsappSubmit}>
              <CardContent className="space-y-6 pt-6">
                <div className="space-y-2">
                  <Label htmlFor="metaPhoneId" className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-muted-foreground" /> Meta Phone Number ID
                  </Label>
                  <Input 
                    id="metaPhoneId"
                    name="metaPhoneId"
                    value={whatsappData.metaPhoneId}
                    onChange={handleWhatsappChange}
                    required
                  />
                  <p className="text-[0.8rem] text-muted-foreground">
                    The unique identifier for your WhatsApp Business phone number.
                  </p>
                </div>

                <div className="space-y-3 p-4 bg-muted/50 rounded-lg border">
                  <h4 className="font-medium flex items-center gap-2 text-sm">
                    <Link className="w-4 h-4 text-muted-foreground" /> Webhook URL
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    Use this URL in your Meta App Dashboard to receive message status updates.
                  </p>
                  <code className="text-xs bg-background p-2 rounded border block select-all">
                    https://api.finvista.in/webhooks/whatsapp
                  </code>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="whatsappTemplates" className="flex items-center gap-2">
                    <MessageCircle className="w-4 h-4 text-muted-foreground" /> Approved Templates
                  </Label>
                  <Textarea 
                    id="whatsappTemplates"
                    name="whatsappTemplates"
                    className="min-h-[80px]" 
                    value={whatsappData.whatsappTemplates}
                    onChange={handleWhatsappChange}
                    required
                  />
                  <p className="text-[0.8rem] text-muted-foreground">
                    Comma separated template IDs that have been approved by Meta.
                  </p>
                </div>
              </CardContent>
              <CardFooter className="border-t bg-muted/20 px-6 py-4">
                <Button type="submit" disabled={isSaving} className="bg-emerald-600 hover:bg-emerald-700">
                  {isSaving ? "Saving..." : "Save Configuration"}
                  {!isSaving && <Save className="w-4 h-4 ml-2" />}
                </Button>
              </CardFooter>
            </form>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
