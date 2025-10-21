import * as React from "react";
import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t bg-background">
      <div className="container py-8">
        <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <div className="text-sm text-muted-foreground text-center md:text-left">
            <p>© VeritasChain — Proof of Document Anchoring</p>
            <p className="text-xs mt-1">Network: Sepolia</p>
          </div>
          
          <div className="flex items-center space-x-6 text-sm">
            <Link 
              href="#" 
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              Mentions
            </Link>
            <Link 
              href="#" 
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              Contact
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
