"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { icon: "⌂", label: "Dashboard", path: "/" },
  { icon: "♧", label: "Trip Management", path: "/trips" },
  { icon: "♙", label: "Customers", path: "/customers" },
  { icon: "♟", label: "Riders", path: "/riders" },
  { icon: "⌖", label: "Live Map", path: "/map" },
  { icon: "⚿", label: "Motorcycles & Documents", path: "/documents" },
  { icon: "◷", label: "Dispatch & Availability", path: "/dispatch" },
  { icon: "▣", label: "Fare & Pricing", path: "/pricing" },
  { icon: "◎", label: "Revenue & Commissions", path: "/revenue" },
  { icon: "▤", label: "Payments & Reconciliation", path: "/payments" },
];

export default function Sidebar() {
  const pathname = usePathname();
  return (
    <aside className="w-[238px] bg-[#0b121b] text-[#e8eef8] flex flex-col z-20 shrink-0 h-screen">
      <div className="flex items-center gap-2 px-4 py-5 border-b border-slate-700">
        <b className="text-4xl italic text-[#ffbd19]">ϟ</b>
        <div>
          <div className="text-2xl font-extrabold text-white leading-none">TORQ</div>
          <div className="text-[9px] tracking-widest mt-1">RIDE • DELIVER • CONNECT</div>
        </div>
      </div>
      <nav className="flex-1 overflow-y-auto mt-2 px-2 space-y-1 pb-4">
        {navItems.map((item, i) => {
          const isActive = pathname === item.path;
          return (
            <Link key={i} href={item.path} className={`flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-semibold transition-colors ${isActive ? 'bg-[#ffbd19] text-[#101827]' : 'text-[#d6deea] hover:bg-[#202b39]'}`}>
              <span>{item.icon}</span> <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>
      <div className="p-4 border-t border-slate-700 text-xs text-slate-400">
        🟢 System Operational<br/><br/>TORQ Admin • Live Data
      </div>
    </aside>
  );
}
