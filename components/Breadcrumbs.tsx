// components/Breadcrumbs.tsx
// Composant Breadcrumbs pour navigation améliorée

'use client';

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

const routeNames: Record<string, string> = {
  '/': 'Accueil',
  '/anchor': 'Ancrer',
  '/verify': 'Vérifier',
  '/docs': 'Documentation',
  '/rh': 'Ressources Humaines',
  '/accounting': 'Comptabilité',
  '/legal': 'Juridique',
  '/btp': 'BTP',
  '/btp/plans': 'Plans',
  '/btp/permits': 'Permis',
};

export function Breadcrumbs() {
  const pathname = usePathname();
  
  // Segmenter le pathname
  const segments = pathname.split('/').filter(Boolean);
  const breadcrumbs = segments.map((segment, index) => {
    const path = '/' + segments.slice(0, index + 1).join('/');
    const name = routeNames[path] || segment.charAt(0).toUpperCase() + segment.slice(1);
    return { path, name };
  });

  return (
    <nav className="flex items-center space-x-2 text-sm text-muted-foreground mb-6" aria-label="Breadcrumbs">
      <Link 
        href="/" 
        className="hover:text-foreground transition-colors flex items-center"
      >
        <Home className="h-4 w-4" />
      </Link>
      
      {breadcrumbs.map((crumb, index) => (
        <div key={crumb.path} className="flex items-center space-x-2">
          <ChevronRight className="h-4 w-4" />
          {index === breadcrumbs.length - 1 ? (
            <span className="text-foreground font-medium">{crumb.name}</span>
          ) : (
            <Link
              href={crumb.path}
              className="hover:text-foreground transition-colors"
            >
              {crumb.name}
            </Link>
          )}
        </div>
      ))}
    </nav>
  );
}
