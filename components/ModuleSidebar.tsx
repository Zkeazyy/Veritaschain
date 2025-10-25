// components/ModuleSidebar.tsx
// Sidebar contextuelle pour modules métiers avec liens secondaires

'use client';

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  Users,
  FileText,
  Scale,
  Building2,
  FileCheck,
  Calculator,
  Receipt,
  BookOpen,
  Hammer,
  MapPin,
} from "lucide-react";

interface SidebarLink {
  href: string;
  label: string;
  icon: React.ReactNode;
}

const moduleSidebars: Record<string, SidebarLink[]> = {
  '/rh': [
    { href: '/rh', label: 'Vue d\'ensemble', icon: <Users className="h-4 w-4" /> },
    { href: '/rh/employes', label: 'Employés', icon: <Users className="h-4 w-4" /> },
    { href: '/rh/payslips', label: 'Fiches de paie', icon: <FileText className="h-4 w-4" /> },
    { href: '/rh/contracts', label: 'Contrats', icon: <FileCheck className="h-4 w-4" /> },
  ],
  '/accounting': [
    { href: '/accounting', label: 'Vue d\'ensemble', icon: <Calculator className="h-4 w-4" /> },
    { href: '/accounting/invoices', label: 'Factures', icon: <Receipt className="h-4 w-4" /> },
    { href: '/accounting/quotes', label: 'Devis', icon: <FileText className="h-4 w-4" /> },
    { href: '/accounting/ledgers', label: 'Journaux', icon: <BookOpen className="h-4 w-4" /> },
  ],
  '/legal': [
    { href: '/legal', label: 'Vue d\'ensemble', icon: <Scale className="h-4 w-4" /> },
    { href: '/legal/contracts', label: 'Contrats', icon: <FileText className="h-4 w-4" /> },
    { href: '/legal/notary', label: 'Actes notariés', icon: <FileCheck className="h-4 w-4" /> },
  ],
  '/btp': [
    { href: '/btp', label: 'Vue d\'ensemble', icon: <Building2 className="h-4 w-4" /> },
    { href: '/btp/plans', label: 'Plans', icon: <MapPin className="h-4 w-4" /> },
    { href: '/btp/permits', label: 'Permis', icon: <Hammer className="h-4 w-4" /> },
  ],
};

export function ModuleSidebar() {
  const pathname = usePathname();
  
  // Déterminer si nous sommes dans un module métier
  const modulePath = ['/rh', '/accounting', '/legal', '/btp'].find(path => 
    pathname.startsWith(path)
  );
  
  if (!modulePath) return null;
  
  const links = moduleSidebars[modulePath] || [];
  
  return (
    <aside className="w-64 border-r bg-muted/30 p-4 hidden lg:block">
      <nav className="space-y-1">
        {links.map((link) => {
          const isActive = pathname === link.href;
          
          return (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "flex items-center space-x-3 px-3 py-2 rounded-md text-sm font-medium transition-colors",
                isActive
                  ? "bg-background text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground hover:bg-background/50"
              )}
            >
              <span className={cn(
                isActive && "text-primary"
              )}>
                {link.icon}
              </span>
              <span>{link.label}</span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
