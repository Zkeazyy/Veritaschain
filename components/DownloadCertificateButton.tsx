'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Alert } from '@/components/ui/alert';
import { LoadingSpinner } from '@/components/ui/loader';
import { Download, FileText, CheckCircle, AlertCircle } from 'lucide-react';

export interface DownloadCertificateButtonProps {
  hash: string;
  txHash: string;
  network: string;
  contractAddress: string;
  issuerAddress?: string;
  issuedTo?: string;
  issuedAt?: string;
  appName?: string;
  verifyBaseUrl?: string;
  className?: string;
  variant?: 'default' | 'outline' | 'secondary' | 'ghost';
  size?: 'default' | 'sm' | 'lg';
  disabled?: boolean;
}

export default function DownloadCertificateButton({
  hash,
  txHash,
  network,
  contractAddress,
  issuerAddress,
  issuedTo,
  issuedAt,
  appName = 'VeritasChain',
  verifyBaseUrl,
  className,
  variant = 'default',
  size = 'default',
  disabled = false,
}: DownloadCertificateButtonProps) {
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadStatus, setDownloadStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const handleDownload = async () => {
    if (!hash || !txHash || !network || !contractAddress) {
      setErrorMessage('Données manquantes pour générer le certificat');
      setDownloadStatus('error');
      return;
    }

    try {
      setIsDownloading(true);
      setDownloadStatus('idle');
      setErrorMessage('');

      console.log('[DownloadCertificate] Début du téléchargement:', {
        hash: hash.slice(0, 10) + '...',
        txHash: txHash.slice(0, 10) + '...',
        network,
        contractAddress: contractAddress.slice(0, 10) + '...',
      });

      // Construction du payload
      const payload = {
        hash: hash.trim(),
        txHash: txHash.trim(),
        network: network.trim(),
        contractAddress: contractAddress.trim(),
        issuerAddress: issuerAddress?.trim(),
        issuedTo: issuedTo?.trim(),
        issuedAt: issuedAt || new Date().toISOString(),
        appName,
        verifyBaseUrl: verifyBaseUrl || window.location.origin,
      };

      console.log('[DownloadCertificate] Payload construit:', {
        ...payload,
        hash: payload.hash.slice(0, 10) + '...',
        txHash: payload.txHash.slice(0, 10) + '...',
        contractAddress: payload.contractAddress.slice(0, 10) + '...',
      });

      // Appel API
      const response = await fetch('/api/certificates', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      console.log('[DownloadCertificate] Réponse reçue:', {
        status: response.status,
        statusText: response.statusText,
        contentType: response.headers.get('content-type'),
        contentDisposition: response.headers.get('content-disposition'),
        certificateId: response.headers.get('x-certificate-id'),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `Erreur ${response.status}: ${response.statusText}`);
      }

      // Vérification du type de contenu
      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/pdf')) {
        throw new Error('Réponse invalide: le serveur n\'a pas retourné un PDF');
      }

      // Récupération du nom de fichier
      const contentDisposition = response.headers.get('content-disposition');
      let filename = 'VeritasCertificate.pdf';
      
      if (contentDisposition) {
        const filenameMatch = contentDisposition.match(/filename="([^"]+)"/);
        if (filenameMatch) {
          filename = filenameMatch[1];
        }
      }

      console.log('[DownloadCertificate] Nom de fichier:', filename);

      // Conversion en blob et téléchargement
      const blob = await response.blob();
      
      // Création du lien de téléchargement
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = filename;
      
      // Déclenchement du téléchargement
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      // Nettoyage
      window.URL.revokeObjectURL(url);

      console.log('[DownloadCertificate] Téléchargement réussi:', filename);
      setDownloadStatus('success');

    } catch (error) {
      console.error('[DownloadCertificate] Erreur:', error);
      setErrorMessage(error instanceof Error ? error.message : 'Erreur lors du téléchargement du certificat');
      setDownloadStatus('error');
    } finally {
      setIsDownloading(false);
    }
  };

  const getButtonContent = () => {
    if (isDownloading) {
      return (
        <>
          <LoadingSpinner className="mr-2 h-4 w-4" />
          Génération...
        </>
      );
    }

    if (downloadStatus === 'success') {
      return (
        <>
          <CheckCircle className="mr-2 h-4 w-4" />
          Téléchargé
        </>
      );
    }

    return (
      <>
        <Download className="mr-2 h-4 w-4" />
        Télécharger le Certificat
      </>
    );
  };

  const getButtonVariant = () => {
    if (downloadStatus === 'success') {
      return 'outline';
    }
    return variant;
  };

  return (
    <div className="space-y-2">
      <Button
        onClick={handleDownload}
        disabled={disabled || isDownloading}
        variant={getButtonVariant()}
        size={size}
        className={className}
      >
        {getButtonContent()}
      </Button>

      {downloadStatus === 'error' && errorMessage && (
        <Alert variant="destructive" className="text-sm">
          <AlertCircle className="h-4 w-4" />
          <span>{errorMessage}</span>
        </Alert>
      )}

      {downloadStatus === 'success' && (
        <Alert variant="success" className="text-sm">
          <CheckCircle className="h-4 w-4" />
          <span>Certificat téléchargé avec succès !</span>
        </Alert>
      )}

      {/* Informations de debug en développement */}
      {process.env.NODE_ENV === 'development' && (
        <div className="text-xs text-gray-500 space-y-1">
          <div><strong>Hash:</strong> {hash.slice(0, 10)}...</div>
          <div><strong>Network:</strong> {network}</div>
          <div><strong>Contract:</strong> {contractAddress.slice(0, 10)}...</div>
          {issuerAddress && <div><strong>Issuer:</strong> {issuerAddress.slice(0, 10)}...</div>}
          {issuedTo && <div><strong>Issued To:</strong> {issuedTo}</div>}
        </div>
      )}
    </div>
  );
}

// Composant simplifié pour les cas d'usage courants
export function SimpleDownloadCertificateButton({
  hash,
  txHash,
  network = 'sepolia',
  contractAddress,
  issuerAddress,
  issuedTo,
  className,
}: Pick<DownloadCertificateButtonProps, 'hash' | 'txHash' | 'network' | 'contractAddress' | 'issuerAddress' | 'issuedTo' | 'className'>) {
  return (
    <DownloadCertificateButton
      hash={hash}
      txHash={txHash}
      network={network}
      contractAddress={contractAddress}
      issuerAddress={issuerAddress}
      issuedTo={issuedTo}
      className={className}
      variant="outline"
      size="sm"
    />
  );
}
