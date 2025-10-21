'use client';

import { useState } from 'react';
import { Card, Button, Input, Alert, LoadingSpinner } from '@/components/ui';
import { sha256HexBrowser } from '@/lib/hash';
import { useWeb3Wallet, anchorDocumentWithWallet, generateCertificatePDF } from '@/lib/web3';

interface AnchorResult {
  txHash: string;
  author: string;
  timestamp: number;
}

export default function AnchorPage() {
  const [file, setFile] = useState<File | null>(null);
  const [fileName, setFileName] = useState('');
  const [fileSize, setFileSize] = useState<number | null>(null);
  const [hash, setHash] = useState('');
  const [isCalculatingHash, setIsCalculatingHash] = useState(false);
  const [isAnchoring, setIsAnchoring] = useState(false);
  const [isGeneratingCert, setIsGeneratingCert] = useState(false);
  const [anchorResult, setAnchorResult] = useState<AnchorResult | null>(null);
  const [toastSuccess, setToastSuccess] = useState('');
  const [toastError, setToastError] = useState('');

  // Hook Web3
  const { isConnected, address, connectWallet, error: walletError } = useWeb3Wallet();

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${(bytes / Math.pow(k, i)).toFixed(2)} ${sizes[i]}`;
  };

  const onFileChange = async (selectedFile: File) => {
    setFile(selectedFile);
    setFileName(selectedFile.name);
    setFileSize(selectedFile.size);
    setHash('');
    setToastSuccess('');
    setToastError('');
    setAnchorResult(null);
    try {
      setIsCalculatingHash(true);
      const h = await sha256HexBrowser(selectedFile);
      setHash(h);
      setToastSuccess('Hash SHA-256 calculé côté client.');
    } catch (e) {
      setToastError(e instanceof Error ? e.message : "Erreur lors du calcul du hash");
    } finally {
      setIsCalculatingHash(false);
    }
  };

  const onAnchor = async () => {
    if (!hash || !fileName) {
      setToastError("Veuillez sélectionner un fichier valide avant d'ancrer.");
      return;
    }

    if (!isConnected) {
      setToastError('Veuillez d\'abord connecter votre wallet MetaMask');
      return;
    }

    try {
      setIsAnchoring(true);
      setToastError('');
      setToastSuccess('');
      
      const result = await anchorDocumentWithWallet(hash as `0x${string}`, fileName, address!);
      setAnchorResult(result);
      setToastSuccess('Document ancré avec succès sur la blockchain.');
    } catch (e) {
      setToastError(e instanceof Error ? e.message : "Erreur lors de l'ancrage");
    } finally {
      setIsAnchoring(false);
    }
  };

  const onDownloadCertificate = async () => {
    if (!anchorResult || !fileName || !hash) return;
    try {
      setIsGeneratingCert(true);
      setToastError('');
      
      await generateCertificatePDF(
        fileName,
        hash as `0x${string}`,
        anchorResult.txHash as `0x${string}`,
        anchorResult.author as `0x${string}`,
        anchorResult.timestamp
      );
      
      setToastSuccess('Certificat téléchargé avec succès.');
    } catch (e) {
      setToastError(e instanceof Error ? e.message : "Erreur lors de la génération du certificat");
    } finally {
      setIsGeneratingCert(false);
    }
  };

  const reset = () => {
    setFile(null);
    setFileName('');
    setFileSize(null);
    setHash('');
    setAnchorResult(null);
    setToastSuccess('');
    setToastError('');
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Ancrer un document</h1>
          <p className="text-gray-600">Aucune donnée fichier n’est envoyée au serveur, seul le hash l’est.</p>
        </div>

        {toastError && (
          <Alert variant="error" className="mb-6">{toastError}</Alert>
        )}
        {toastSuccess && (
          <Alert variant="success" className="mb-6">{toastSuccess}</Alert>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Card>
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">📄 Sélectionner un fichier</h2>
            <div className="space-y-4">
              <input
                type="file"
                accept=".pdf,.docx,.png"
                onChange={(e) => {
                  const f = e.target.files?.[0];
                  if (f) onFileChange(f);
                }}
                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
              />

              {fileName && (
                <div className="p-3 bg-gray-50 rounded-md text-sm text-gray-700">
                  <div><strong>Nom :</strong> {fileName}</div>
                  {fileSize !== null && (
                    <div><strong>Taille :</strong> {formatBytes(fileSize)}</div>
                  )}
                </div>
              )}

              {isCalculatingHash && (
                <div className="flex items-center space-x-2">
                  <LoadingSpinner size="sm" />
                  <span className="text-sm text-gray-600">Calcul du hash (WebCrypto)...</span>
                </div>
              )}

              {hash && (
                <div className="p-3 bg-green-50 border border-green-200 rounded-md">
                  <p className="text-sm text-green-800"><strong>Hash SHA-256 :</strong></p>
                  <p className="text-xs font-mono text-green-700 break-all mt-1">{hash}</p>
                </div>
              )}
            </div>
          </Card>

          <Card>
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">⛓️ Ancrage Blockchain</h2>
            <div className="space-y-4">
              {/* Connexion MetaMask */}
              {!isConnected ? (
                <div className="space-y-3">
                  <Button onClick={connectWallet} className="w-full">
                    🔗 Connecter MetaMask
                  </Button>
                  {walletError && (
                    <Alert variant="error" className="text-sm">{walletError}</Alert>
                  )}
                </div>
              ) : (
                <div className="p-3 bg-green-50 border border-green-200 rounded-md text-sm">
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-green-800 font-medium">Wallet connecté</span>
                  </div>
                  <div className="text-green-700 font-mono text-xs mt-1">{address}</div>
                </div>
              )}

              <Button 
                onClick={onAnchor} 
                disabled={!hash || !isConnected || isAnchoring || isCalculatingHash} 
                className="w-full"
              >
                {isAnchoring ? (
                  <span className="inline-flex items-center"><LoadingSpinner size="sm" className="mr-2"/>Ancrage en cours...</span>
                ) : (
                  'Ancrer sur la Blockchain'
                )}
              </Button>

              {anchorResult && (
                <div className="p-4 bg-blue-50 border border-blue-200 rounded-md text-sm">
                  <div className="mb-2 font-medium text-blue-900">✅ Document Ancré</div>
                  <div className="text-blue-800 space-y-1">
                    <div><strong>Transaction :</strong> {anchorResult.txHash}</div>
                    <div><strong>Auteur :</strong> {anchorResult.author}</div>
                    <div><strong>Horodatage :</strong> {new Date(anchorResult.timestamp * 1000).toLocaleString('fr-FR')}</div>
                  </div>
                </div>
              )}

              <Button
                onClick={onDownloadCertificate}
                disabled={!anchorResult || isGeneratingCert}
                variant="secondary"
                className="w-full"
              >
                {isGeneratingCert ? (
                  <span className="inline-flex items-center"><LoadingSpinner size="sm" className="mr-2"/>Génération du certificat...</span>
                ) : (
                  'Télécharger le certificat'
                )}
              </Button>

              {(file || anchorResult) && (
                <Button onClick={reset} variant="secondary" className="w-full">Recommencer</Button>
              )}
            </div>
          </Card>
        </div>

        <Card className="mt-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">ℹ️ Confidentialité</h2>
          <p className="text-sm text-gray-600">
            Le hash est calculé localement dans votre navigateur via WebCrypto. Le serveur ne reçoit jamais le fichier,
            uniquement le hash (0x + 64 hex) pour l'ancrage.
          </p>
        </Card>

        <div className="mt-8 text-center">
          <a href="/verify" className="text-sm text-gray-600 hover:text-gray-800">🔍 Aller à la vérification</a>
        </div>
      </div>
    </div>
  );
}


