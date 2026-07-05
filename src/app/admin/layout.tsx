"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { AuthService } from "@/services/auth.service";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/layout/app-sidebar";
import { TopNavbar } from "@/components/layout/top-navbar";

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
    return <div className="min-h-screen bg-background" />; // Optional: Add a nice full-page loader here
  }

  return (
    <SidebarProvider>
      <AppSidebar />
      <div className="flex w-full flex-col overflow-hidden">
        <TopNavbar />
        <main className="flex-1 overflow-y-auto bg-muted/20 p-4 md:p-6 lg:p-8">
          {children}
        </main>
      </div>
    </SidebarProvider>
  );
}
