import { 
  LayoutDashboard, Map, Route, Bike, Users, 
  Truck, MapPin, Calculator, DollarSign, 
  CreditCard, Wallet, Percent, Gift, 
  Star, HeadphonesIcon, ShieldAlert, MessageSquare, 
  Megaphone, BarChart3, UserCog, Key, 
  ScrollText, Activity, Settings 
} from "lucide-react";

export type NavItem = {
  title: string;
  href: string;
  icon: any;
};

export const NAVIGATION_GROUPS: { label: string; items: NavItem[] }[] = [
  {
    label: "OPERATIONS",
    items: [
      { title: "Overview", href: "/dashboard", icon: LayoutDashboard },
      { title: "Live Map", href: "/map", icon: Map },
      { title: "Trips & Bookings", href: "/trips", icon: Route },
      { title: "Riders / Drivers", href: "/riders", icon: Bike },
      { title: "Passengers", href: "/passengers", icon: Users },
      { title: "Motorcycle Fleet", href: "/fleet", icon: Truck },
      { title: "Service Areas", href: "/service-areas", icon: MapPin },
    ]
  },
  {
    label: "FINANCE",
    items: [
      { title: "Pricing & Fares", href: "/pricing", icon: Calculator },
      { title: "Revenue & Finance", href: "/finance", icon: DollarSign },
      { title: "Payments", href: "/payments", icon: CreditCard },
      { title: "Wallets & Payouts", href: "/payouts", icon: Wallet },
      { title: "Commission", href: "/commission", icon: Percent },
      { title: "Promotions", href: "/promotions", icon: Gift },
    ]
  },
  {
    label: "SUPPORT & SAFETY",
    items: [
      { title: "Ratings", href: "/ratings", icon: Star },
      { title: "Customer Support", href: "/support", icon: HeadphonesIcon },
      { title: "Safety & Incidents", href: "/safety", icon: ShieldAlert },
      { title: "Disputes", href: "/disputes", icon: MessageSquare },
      { title: "Notifications", href: "/notifications", icon: Megaphone },
    ]
  },
  {
    label: "ADMINISTRATION",
    items: [
      { title: "Reports & Analytics", href: "/reports", icon: BarChart3 },
      { title: "Staff Management", href: "/staff", icon: UserCog },
      { title: "Roles & Permissions", href: "/roles", icon: Key },
      { title: "Audit Logs", href: "/audit-logs", icon: ScrollText },
      { title: "System Health", href: "/system-health", icon: Activity },
      { title: "Settings", href: "/settings", icon: Settings },
    ]
  }
];
