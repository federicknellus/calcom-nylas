"use client";

import { cn } from "@/lib/utils";
import { CalendarCheck, HomeIcon, Settings, Users2 } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";

export const dashboardLinks = [
  {
    id: 0,
    name: "Eventi",
    href: "/dashboard",
    icon: HomeIcon,
  },
  {
    id: 1,
    name: "Meeting",
    href: "/dashboard/meetings",
    icon: Users2,
  },
  {
    id: 2,
    name: "Disponibiltà",
    href: "/dashboard/availability",
    icon: CalendarCheck,
  },
  {
    id: 3,
    name: "Impostazioni",
    href: "/dashboard/settings",
    icon: Settings,
  },
];

export function DasboardLinks() {
  const pathname = usePathname();
  return (
    <>
      {dashboardLinks.map((link) => (
        <Link
          key={link.id}
          href={link.href}
          className={cn(
            pathname === link.href
              ? "text-primary bg-primary/10"
              : "text-muted-foreground hover:text-foreground",
            "flex items-center gap-3 rounded-lg px-3 py-2  transition-all  hover:text-primary"
          )}
        >
          <link.icon className="h-4 w-4" />
          {link.name}
        </Link>
      ))}
    </>
  );
}
