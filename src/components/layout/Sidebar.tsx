"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronLeft, ChevronRight, Zap } from "lucide-react";
import { NAVIGATION_GROUPS } from "@/config/navigation";

export function Sidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const pathname = usePathname();

  return (
    <aside 
      className={`bg-[#0a0a0a] text-white transition-all duration-300 flex flex-col border-r border-gray-800 h-screen sticky top-0 ${
        isCollapsed ? "w-20" : "w-64"
      }`}
    >
      {/* Brand Header */}
      <div className="h-16 flex items-center justify-between px-4 border-b border-gray-800">
        <Link href="/" className="flex items-center gap-2 overflow-hidden">
          <div className="min-w-[32px] h-8 bg-[#FCD34D] rounded flex items-center justify-center">
            <Zap size={20} className="text-black" fill="currentColor" />
          </div>
          {!isCollapsed && (
            <span className="text-xl font-bold tracking-wider text-white">TORQ</span>
          )}
        </Link>
        <button 
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="text-gray-400 hover:text-white hidden md:block"
        >
          {isCollapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
        </button>
      </div>

      {/* Scrollable Navigation Area */}
      <div className="flex-1 overflow-y-auto py-4 custom-scrollbar">
        {NAVIGATION_GROUPS.map((group) => (
          <div key={group.label} className="mb-6">
            {!isCollapsed && (
              <h3 className="px-6 mb-2 text-xs font-semibold text-gray-500 tracking-wider">
                {group.label}
              </h3>
            )}
            
            <ul className="space-y-1 px-3">
              {group.items.map((item) => {
                const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
                
                return (
                  <li key={item.title}>
                    <Link
                      href={item.href}
                      title={isCollapsed ? item.title : undefined}
                      className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors group ${
                        isActive 
                          ? "bg-[#FCD34D] text-black font-medium" 
                          : "text-gray-400 hover:bg-gray-800 hover:text-white"
                      }`}
                    >
                      <item.icon 
                        size={20} 
                        className={isActive ? "text-black" : "text-gray-400 group-hover:text-white"} 
                      />
                      {!isCollapsed && (
                        <span className="text-sm">{item.title}</span>
                      )}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-gray-800">
        <div className={`flex items-center gap-3 ${isCollapsed ? "justify-center" : ""}`}>
          <div className="w-9 h-9 rounded-full bg-gray-700 flex items-center justify-center text-sm font-bold">
            A
          </div>
          {!isCollapsed && (
            <div className="flex flex-col">
              <span className="text-sm font-medium">Admin User</span>
              <span className="text-xs text-gray-500">Super Admin</span>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
}
