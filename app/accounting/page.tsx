'use client';

import { useState } from 'react';
import { Card, Button, Input, Alert, LoadingSpinner } from '@/components/ui';
import { sha256HexBrowser } from '@/lib/hash';
import { useWeb3Wallet, anchorDocumentWithWallet, AddressHex } from '@/lib/web3';
import { isFeatureEnabled } from '@/lib/feature-flags';

interface InvoiceData {
  invoiceNumber: string;
  clientName: string;
  clientAddress: string;
  issueDate: string;
  dueDate: string;
  totalAmount: number;
  vatRate: number;
  vatAmount: number;
  netAmount: number;
  description: string;
}

interface InvoiceResult {
  txHash: string;
  author: string;
  timestamp: number;
  invoiceHash: string;
}

export default function AccountingInvoicesPage() {
  const isEnabled = isFeatureEnabled('accounting');
  
  const [invoiceData, setInvoiceData] = useState<InvoiceData>({
    invoiceNumber: '',
    clientName: '',
    clientAddress: '',
    issueDate: '',
    dueDate: '',
    totalAmount: 0,
    vatRate: 20,
    vatAmount: 0,
    netAmount: 0,
    description: '',
  });
  
  const [isAnchoring, setIsAnchoring] = useState(false);
  const [result, setResult] = useState<InvoiceResult | null>(null);
  const [toastSuccess, setToastSuccess] = useState('');
  const [toastError, setToastError] = useState('');

  // Hook Web3
  const { isConnected, address, connectWallet, error: walletError } = useWeb3Wallet();

  const handleInputChange = (field: keyof InvoiceData, value: string | number) => {
    setInvoiceData(prev => {
      const updated = { ...prev, [field]: value };
      
      // Calcul automatique de la TVA et du montant net
      if (field === 'totalAmount' || field === 'vatRate') {
        const total = typeof updated.totalAmount === 'number' ? updated.totalAmount : 0;
        const vatRate = typeof updated.vatRate === 'number' ? updated.vatRate : 20;
        
        updated.vatAmount = total * (vatRate / 100);
        updated.netAmount = total - updated.vatAmount;
      }
      
      return updated;
    });
  };

  const generateInvoiceHash = async (): Promise<string> => {
    // Créer un objet structuré pour le hash
    const invoiceForHash = {
      invoiceNumber: invoiceData.invoiceNumber,
      clientName: invoiceData.clientName,
      clientAddress: invoiceData.clientAddress,
      issueDate: invoiceData.issueDate,
      dueDate: invoiceData.dueDate,
      totalAmount: invoiceData.totalAmount,
      vatRate: invoiceData.vatRate,
      vatAmount: invoiceData.vatAmount,
      netAmount: invoiceData.netAmount,
      description: invoiceData.description,
      timestamp: new Date().toISOString(),
    };

    // Convertir en JSON et calculer le hash
    const jsonString = JSON.stringify(invoiceForHash, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const file = new File([blob], 'invoice.json', { type: 'application/json' });
    return await sha256HexBrowser(file);
  };

  const onAnchorInvoice = async () => {
    if (!isConnected) {
      setToastError('Veuillez connecter votre wallet MetaMask');
      return;
    }

    if (!invoiceData.invoiceNumber || !invoiceData.clientName || !invoiceData.totalAmount) {
      setToastError('Veuillez remplir tous les champs obligatoires');
      return;
    }

    try {
      setIsAnchoring(true);
      setToastError('');
      setToastSuccess('');

      console.log('[Accounting] Génération du hash de la facture...');
      const invoiceHash = await generateInvoiceHash();
      console.log('[Accounting] Hash généré:', invoiceHash);

      const fileName = `invoice-${invoiceData.invoiceNumber}-${invoiceData.issueDate}.json`;
      
      console.log('[Accounting] Ancrage de la facture sur la blockchain...');
      const anchorResult = await anchorDocumentWithWallet(invoiceHash, fileName, address!);
      
      console.log('[Accounting] Ancrage réussi:', anchorResult);
      
      setResult({
        txHash: anchorResult.txHash,
        author: anchorResult.author,
        timestamp: anchorResult.timestamp,
        invoiceHash,
      });

      setToastSuccess(`Facture ancrée avec succès ! Transaction: ${anchorResult.txHash.slice(0, 10)}...`);
      
    } catch (error) {
      console.error('[Accounting] Erreur lors de l\'ancrage:', error);
      setToastError(error instanceof Error ? error.message : 'Erreur lors de l\'ancrage de la facture');
    } finally {
      setIsAnchoring(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-3">
            💰 Module Comptabilité - Factures
          </h1>
          <p className="text-gray-600">
            Ancrage sécurisé des factures et documents comptables sur la blockchain VeritasChain
          </p>
        </div>

        {walletError && (
          <Alert variant="destructive" className="mb-6">{walletError}</Alert>
        )}

        {toastError && (
          <Alert variant="destructive" className="mb-6">{toastError}</Alert>
        )}

        {toastSuccess && (
          <Alert variant="success" className="mb-6">{toastSuccess}</Alert>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Formulaire de saisie */}
          <Card className="p-6">
            <h2 className="text-2xl font-semibold mb-6">Informations de la Facture</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Numéro de Facture *
                </label>
                <Input
                  value={invoiceData.invoiceNumber}
                  onChange={(e) => handleInputChange('invoiceNumber', e.target.value)}
                  placeholder="FAC-2025-001"
                  className="w-full"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nom du Client *
                </label>
                <Input
                  value={invoiceData.clientName}
                  onChange={(e) => handleInputChange('clientName', e.target.value)}
                  placeholder="Entreprise ABC"
                  className="w-full"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Adresse du Client
                </label>
                <Input
                  value={invoiceData.clientAddress}
                  onChange={(e) => handleInputChange('clientAddress', e.target.value)}
                  placeholder="123 Rue de la Paix, 75001 Paris"
                  className="w-full"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Date d'Émission
                  </label>
                  <Input
                    type="date"
                    value={invoiceData.issueDate}
                    onChange={(e) => handleInputChange('issueDate', e.target.value)}
                    className="w-full"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Date d'Échéance
                  </label>
                  <Input
                    type="date"
                    value={invoiceData.dueDate}
                    onChange={(e) => handleInputChange('dueDate', e.target.value)}
                    className="w-full"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Montant Total (€) *
                </label>
                <Input
                  type="number"
                  step="0.01"
                  value={invoiceData.totalAmount}
                  onChange={(e) => handleInputChange('totalAmount', parseFloat(e.target.value) || 0)}
                  placeholder="1200.00"
                  className="w-full"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Taux de TVA (%)
                </label>
                <Input
                  type="number"
                  value={invoiceData.vatRate}
                  onChange={(e) => handleInputChange('vatRate', parseFloat(e.target.value) || 20)}
                  placeholder="20"
                  className="w-full"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Montant TVA (€)
                  </label>
                  <Input
                    type="number"
                    step="0.01"
                    value={invoiceData.vatAmount}
                    readOnly
                    className="w-full bg-gray-100"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Montant Net (€)
                  </label>
                  <Input
                    type="number"
                    step="0.01"
                    value={invoiceData.netAmount}
                    readOnly
                    className="w-full bg-gray-100"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  value={invoiceData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  placeholder="Description des services ou produits facturés"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows={3}
                />
              </div>
            </div>
          </Card>

          {/* Résultats et actions */}
          <Card className="p-6">
            <h2 className="text-2xl font-semibold mb-6">Ancrage Blockchain</h2>
            
            {!isConnected ? (
              <div className="text-center">
                <p className="text-gray-600 mb-4">
                  Connectez votre wallet MetaMask pour ancrer la facture
                </p>
                <Button onClick={connectWallet} className="w-full">
                  🔗 Connecter MetaMask
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <p className="text-green-800 font-medium">
                    ✅ Wallet connecté: {address?.slice(0, 6)}...{address?.slice(-4)}
                  </p>
                </div>

                <Button 
                  onClick={onAnchorInvoice}
                  disabled={isAnchoring}
                  className="w-full"
                >
                  {isAnchoring ? (
                    <>
                      <LoadingSpinner className="mr-2" />
                      Ancrage en cours...
                    </>
                  ) : (
                    '🔒 Ancrer la Facture'
                  )}
                </Button>

                {result && (
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <h3 className="font-semibold text-blue-900 mb-2">✅ Ancrage Réussi</h3>
                    <div className="space-y-2 text-sm">
                      <p><strong>Hash:</strong> <code className="text-xs">{result.invoiceHash}</code></p>
                      <p><strong>Transaction:</strong> <code className="text-xs">{result.txHash}</code></p>
                      <p><strong>Auteur:</strong> <code className="text-xs">{result.author}</code></p>
                      <p><strong>Date:</strong> {new Date(result.timestamp * 1000).toLocaleString('fr-FR')}</p>
                    </div>
                  </div>
                )}
              </div>
            )}
          </Card>
        </div>

        {/* Informations sur le module */}
        <Card className="mt-8 p-6">
          <h3 className="text-lg font-semibold mb-4">ℹ️ À propos du Module Comptabilité</h3>
          <div className="text-sm text-gray-600 space-y-2">
            <p>• <strong>Conformité:</strong> Respect des normes comptables françaises et européennes</p>
            <p>• <strong>Audit:</strong> Traçabilité complète pour les contrôles fiscaux</p>
            <p>• <strong>Sécurité:</strong> Protection contre la falsification des factures</p>
            <p>• <strong>Intégration:</strong> Compatible avec les logiciels comptables existants</p>
          </div>
        </Card>
      </div>
    </div>
  );
}
