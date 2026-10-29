"use client";

import { ReactNode } from "react";
import dynamic from "next/dynamic";

// Force the Sidebar to only render on the client side
const Sidebar = dynamic(() => import("./Sidebar").then((mod) => mod.Sidebar), { 
  ssr: false 
});

export function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Sidebar />
      <main className="flex-1 p-6 overflow-auto h-screen">
        {children}
      </main>
    </div>
  );
}