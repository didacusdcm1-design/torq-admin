import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Construction } from "lucide-react";

export default function PlaceholderPage({ title }: { title: string }) {
  return (
    <DashboardLayout>
      <div className="flex flex-col items-center justify-center h-[70vh] text-center">
        <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-6">
          <Construction size={40} className="text-[#FCD34D]" />
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">{title}</h1>
        <p className="text-gray-500 max-w-md">
          This module is currently under construction. The database schema and API endpoints are being developed in the next phase.
        </p>
      </div>
    </DashboardLayout>
  );
}
