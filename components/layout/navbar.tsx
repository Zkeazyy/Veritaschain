'use client';

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTheme } from "next-themes";
import { Moon, Sun, Wallet } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
// import { VtsBadge } from "@/components/vts"; // Temporairement désactivé pour éviter les erreurs wagmi
import { MODULE_CONFIGS } from "@/lib/feature-flags";

// Composant NavLink avec active state
function NavLink({ href, label }: { href: string; label: string }) {
  const pathname = usePathname();
  const isActive = pathname === href;
  
  return (
    <Link
      href={href}
      aria-current={isActive ? 'page' : undefined}
      className={cn(
        "text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-sm",
        isActive
          ? "text-foreground"
          : "text-muted-foreground hover:text-foreground"
      )}
    >
      {label}
    </Link>
  );
}

export function NavBar() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  const navItems = [
    { href: "/", label: "Accueil" },
    { href: "/pricing", label: "Tarifs" },
    { href: "/anchor", label: "Ancrer" },
    { href: "/verify", label: "Vérifier" },
    { href: "/docs", label: "Docs" },
  ];

  // Filtrer les modules selon les feature flags
  const enabledModules = Object.entries(MODULE_CONFIGS)
    .filter(([key, config]) => config.enabled)
    .map(([key, config]) => ({
      href: config.routes[0], // Première route du module
      label: config.name.split(' ')[0], // Premier mot du nom
      icon: config.icon,
      color: config.color,
    }));

  // Modules spécialisés - FORCÉS pour le debug
  const debugModules = [
    { href: "/rh", label: "RH", icon: "👥" },
    { href: "/accounting", label: "Compta", icon: "💰" },
    { href: "/legal", label: "Juridique", icon: "⚖️" },
    { href: "/btp", label: "BTP", icon: "🏗️" },
  ];

  return (
    <nav className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        {/* Logo */}
        <Link 
          href="/" 
          className="flex items-center space-x-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-sm"
          aria-label="Accueil VeritasChain"
        >
          <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
            <span className="text-primary-foreground font-bold text-sm">V</span>
          </div>
          <span className="font-bold text-xl">VeritasChain</span>
        </Link>

        {/* Navigation */}
        <div className="hidden md:flex items-center space-x-6">
          {navItems.map((item) => (
            <NavLink key={item.href} href={item.href} label={item.label} />
          ))}
          
          {/* Séparateur */}
          <div className="h-4 w-px bg-border"></div>
          
          {/* Debug: Afficher le nombre de modules */}
          <span className="text-xs text-muted-foreground">
            Modules: {debugModules.length}
          </span>
          
          {/* Modules spécialisés - VERSION DEBUG */}
          {debugModules.map((item) => {
            const pathname = usePathname();
            const isActive = pathname.startsWith(item.href);
            
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "text-sm font-medium transition-colors flex items-center space-x-1 px-2 py-1 rounded-md hover:bg-accent",
                  isActive
                    ? "text-foreground bg-accent"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                <span>{item.icon}</span>
                <span>{item.label}</span>
              </Link>
            );
          })}
        </div>

        {/* Actions */}
        <div className="flex items-center space-x-2">
          {/* VTS Badge - Temporairement désactivé */}
          {/* <VtsBadge /> */}
          
          {/* Wallet Button (placeholder) */}
          <Button 
            variant="outline" 
            size="sm" 
            disabled
            aria-label="Connexion wallet (non disponible)"
          >
            <Wallet className="h-4 w-4 mr-2" aria-hidden="true" />
            Wallet
          </Button>

          {/* Theme Toggle */}
          {mounted && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              aria-label={`Basculer vers le thème ${theme === "dark" ? "clair" : "sombre"}`}
            >
              <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" aria-hidden="true" />
              <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" aria-hidden="true" />
              <span className="sr-only">Toggle theme</span>
            </Button>
          )}
        </div>
      </div>
    </nav>
  );
}
