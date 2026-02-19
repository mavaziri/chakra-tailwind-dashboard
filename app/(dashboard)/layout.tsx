/**
 * Dashboard Layout
 * Layout for protected dashboard pages
 */

import { Metadata } from "next";
import { DashboardNav } from "@/components/layout/DashboardNav";

export const metadata: Metadata = {
  title: "Dashboard - Enterprise Dashboard",
};

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardNav />
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">{children}</main>
    </div>
  );
}
