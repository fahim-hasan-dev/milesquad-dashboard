import {
  LayoutDashboard,
  Users,
  Bike,
  Building2,
  UserCheck,
  PackageCheck,
  MapPin,
  Tag,
  ArrowLeftRight,
  Headphones,
  Shield,
  HelpCircle,
} from "lucide-react";

export const sidebarMenuGroups = [
  {
    groupLabel: "MAIN",
    items: [
      {
        title: "Overview",
        url: "/",
        icon: LayoutDashboard,
      },
    ],
  },
  {
    groupLabel: "PLATFORM MANAGEMENT",
    items: [
      {
        title: "Users",
        url: "/users",
        icon: Users,
      },
      {
        title: "Riders",
        url: "/riders",
        icon: Bike,
      },
      {
        title: "Partners",
        url: "/partners",
        icon: Building2,
      },
      {
        title: "Admins",
        url: "/admins",
        icon: UserCheck,
      },
    ],
  },
  {
    groupLabel: "OPERATIONS",
    items: [
      {
        title: "Deliveries",
        url: "/products",
        icon: PackageCheck,
      },
      {
        title: "Live tracking",
        url: "/live-tracking",
        icon: MapPin,
      },
    ],
  },
  {
    groupLabel: "FINANCE",
    items: [
      {
        title: "Pricing",
        url: "/pricing",
        icon: Tag,
      },
      {
        title: "Transactions",
        url: "/transactions",
        icon: ArrowLeftRight,
      },
    ],
  },
  {
    groupLabel: "HELP & SUPPORT",
    items: [
      {
        title: "Help and support",
        url: "/support",
        icon: Headphones,
      },
      {
        title: "Legal",
        url: "/legal",
        icon: Shield,
      },
      {
        title: "FAQ",
        url: "/faq",
        icon: HelpCircle,
      },
    ],
  },
];

export const profileData = {
  name: "ABDOU",
  role: "Admin",
  initial: "D",
};
