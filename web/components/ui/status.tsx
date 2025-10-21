import * as React from "react";
import { CheckCircle, AlertCircle, Clock, Loader2 } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { cn } from "@/lib/utils";

type StatusVariant = "idle" | "pending" | "success" | "error";

interface StatusProps {
  variant: StatusVariant;
  message?: string;
  className?: string;
}

const statusConfig = {
  idle: {
    icon: null,
    variant: "default" as const,
    defaultMessage: "Prêt",
  },
  pending: {
    icon: Loader2,
    variant: "default" as const,
    defaultMessage: "Traitement en cours...",
  },
  success: {
    icon: CheckCircle,
    variant: "success" as const,
    defaultMessage: "Succès",
  },
  error: {
    icon: AlertCircle,
    variant: "error" as const,
    defaultMessage: "Erreur",
  },
};

export function Status({ variant, message, className }: StatusProps) {
  const config = statusConfig[variant];
  const Icon = config.icon;
  const displayMessage = message || config.defaultMessage;

  return (
    <Alert variant={config.variant} className={cn("", className)}>
      {Icon && (
        <Icon 
          className={cn(
            "h-4 w-4",
            variant === "pending" && "animate-spin"
          )} 
        />
      )}
      <AlertDescription>{displayMessage}</AlertDescription>
    </Alert>
  );
}

// Composant spécialisé pour les états d'ancrage
export function AnchorStatus({ 
  variant, 
  message, 
  txHash, 
  onDownloadCert 
}: {
  variant: StatusVariant;
  message?: string;
  txHash?: string;
  onDownloadCert?: () => void;
}) {
  const config = statusConfig[variant];
  const Icon = config.icon;

  return (
    <Alert variant={config.variant} className="mb-4">
      {Icon && (
        <Icon 
          className={cn(
            "h-4 w-4",
            variant === "pending" && "animate-spin"
          )} 
        />
      )}
      <AlertDescription className="space-y-2">
        <div>{message || config.defaultMessage}</div>
        {variant === "success" && txHash && (
          <div className="text-xs font-mono bg-muted p-2 rounded">
            TX: {txHash.slice(0, 10)}...{txHash.slice(-8)}
          </div>
        )}
        {variant === "success" && onDownloadCert && (
          <button
            onClick={onDownloadCert}
            className="text-xs underline hover:no-underline"
          >
            Télécharger le certificat PDF
          </button>
        )}
      </AlertDescription>
    </Alert>
  );
}
