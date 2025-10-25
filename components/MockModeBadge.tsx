// components/MockModeBadge.tsx
// Badge discret pour indiquer le mode simulation

'use client';

import * as React from "react";
import { cn } from "@/lib/utils";

export function MockModeBadge() {
  // Ce composant sera affiché si X-Mode: mock dans les headers
  return (
    <div className="fixed top-4 right-4 z-50">
      <div className="bg-amber-100 dark:bg-amber-900 text-amber-800 dark:text-amber-200 px-3 py-1 rounded-full text-xs font-medium flex items-center space-x-2 shadow-md border border-amber-200 dark:border-amber-800">
        <span className="animate-pulse">●</span>
        <span>Mode Simulation</span>
      </div>
    </div>
  );
}
