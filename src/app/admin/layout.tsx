// app/admin/layout.tsx

"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { AuthService } from "@/services/auth.service";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/layout/app-sidebar";
import { TopNavbar } from "@/components/layout/top-navbar";
import { Settings, Mail, LayoutDashboard } from "lucide-react";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    if (!AuthService.isAuthenticated()) {
      router.push("/login");
    } else {
      setTimeout(() => setIsAuthorized(true), 0);
    }
  }, [router, pathname]);

  if (!isAuthorized) {
    return <div className="min-h-screen bg-background" />; 
  }

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-muted/20">
        <AppSidebar />
        <div className="flex w-full flex-col overflow-hidden">
          <TopNavbar />
          
          {/* Admin Sub-Navigation Header Bar (Optional quick links) */}
          <div className="bg-card border-b px-6 py-2.5 flex items-center gap-4 text-sm font-medium">
            <span className="text-muted-foreground text-xs uppercase tracking-wider font-semibold">Quick Nav:</span>
            <Link 
              href="/admin/dashboard" 
              className={`flex items-center gap-1.5 transition-colors hover:text-primary ${pathname === '/admin/dashboard' ? 'text-primary font-semibold' : 'text-muted-foreground'}`}
            >
              <LayoutDashboard className="w-4 h-4" /> Dashboard
            </Link>
            <Link 
              href="/admin/settings" 
              className={`flex items-center gap-1.5 transition-colors hover:text-primary ${pathname === '/admin/settings' ? 'text-primary font-semibold' : 'text-muted-foreground'}`}
            >
              <Settings className="w-4 h-4" /> Website Settings
            </Link>
            <Link 
              href="/admin/enquiries" 
              className={`flex items-center gap-1.5 transition-colors hover:text-primary ${pathname === '/admin/enquiries' ? 'text-primary font-semibold' : 'text-muted-foreground'}`}
            >
              <Mail className="w-4 h-4" /> Enquiries
            </Link>
          </div>

          <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
