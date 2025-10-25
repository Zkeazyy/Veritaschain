'use client';

import { useState } from 'react';
import { Card, Button, Input, Alert, LoadingSpinner } from '@/components/ui';
import { sha256HexBrowser } from '@/lib/hash';
import { useWeb3Wallet, anchorDocumentWithWallet, AddressHex } from '@/lib/web3';
import { isFeatureEnabled } from '@/lib/feature-flags';

interface PayslipData {
  employeeName: string;
  employeeId: string;
  period: string;
  grossSalary: number;
  netSalary: number;
  socialContributions: number;
  incomeTax: number;
}

interface PayslipResult {
  txHash: string;
  author: string;
  timestamp: number;
  payslipHash: string;
}

export default function RHPayslipsPage() {
  const isEnabled = isFeatureEnabled('rh');
  
  const [payslipData, setPayslipData] = useState<PayslipData>({
    employeeName: '',
    employeeId: '',
    period: '',
    grossSalary: 0,
    netSalary: 0,
    socialContributions: 0,
    incomeTax: 0,
  });
  
  const [isAnchoring, setIsAnchoring] = useState(false);
  const [result, setResult] = useState<PayslipResult | null>(null);
  const [toastSuccess, setToastSuccess] = useState('');
  const [toastError, setToastError] = useState('');

  // Hook Web3
  const { isConnected, address, connectWallet, error: walletError } = useWeb3Wallet();

  // Vérifier si le module RH est activé
  if (!isEnabled) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <Card className="max-w-md w-full space-y-8 text-center p-8">
          <h1 className="text-3xl font-bold text-gray-900">Module RH désactivé</h1>
          <p className="text-gray-600">
            Ce module est actuellement désactivé. Veuillez contacter l'administrateur.
          </p>
        </Card>
      </div>
    );
  }

  const handleInputChange = (field: keyof PayslipData, value: string | number) => {
    setPayslipData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const generatePayslipHash = async (): Promise<string> => {
    // Créer un objet structuré pour le hash
    const payslipForHash = {
      employeeName: payslipData.employeeName,
      employeeId: payslipData.employeeId,
      period: payslipData.period,
      grossSalary: payslipData.grossSalary,
      netSalary: payslipData.netSalary,
      socialContributions: payslipData.socialContributions,
      incomeTax: payslipData.incomeTax,
      timestamp: new Date().toISOString(),
    };

    // Convertir en JSON et calculer le hash
    const jsonString = JSON.stringify(payslipForHash, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const file = new File([blob], 'payslip.json', { type: 'application/json' });
    return await sha256HexBrowser(file);
  };

  const onAnchorPayslip = async () => {
    if (!isConnected) {
      setToastError('Veuillez connecter votre wallet MetaMask');
      return;
    }

    if (!payslipData.employeeName || !payslipData.employeeId || !payslipData.period) {
      setToastError('Veuillez remplir tous les champs obligatoires');
      return;
    }

    try {
      setIsAnchoring(true);
      setToastError('');
      setToastSuccess('');

      console.log('[RH] Génération du hash du bulletin de paie...');
      const payslipHash = await generatePayslipHash();
      console.log('[RH] Hash généré:', payslipHash);

      const fileName = `payslip-${payslipData.employeeId}-${payslipData.period}.json`;
      
      console.log('[RH] Ancrage du bulletin de paie sur la blockchain...');
      const anchorResult = await anchorDocumentWithWallet(payslipHash, fileName, address!);
      
      console.log('[RH] Ancrage réussi:', anchorResult);
      
      setResult({
        txHash: anchorResult.txHash,
        author: anchorResult.author,
        timestamp: anchorResult.timestamp,
        payslipHash,
      });

      setToastSuccess(`Bulletin de paie ancré avec succès ! Transaction: ${anchorResult.txHash.slice(0, 10)}...`);
      
    } catch (error) {
      console.error('[RH] Erreur lors de l\'ancrage:', error);
      setToastError(error instanceof Error ? error.message : 'Erreur lors de l\'ancrage du bulletin de paie');
    } finally {
      setIsAnchoring(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-3">
            👥 Module RH - Bulletins de Paie
          </h1>
          <p className="text-gray-600">
            Ancrage sécurisé des bulletins de paie sur la blockchain VeritasChain
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
            <h2 className="text-2xl font-semibold mb-6">Informations du Bulletin de Paie</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nom de l'employé *
                </label>
                <Input
                  value={payslipData.employeeName}
                  onChange={(e) => handleInputChange('employeeName', e.target.value)}
                  placeholder="Jean Dupont"
                  className="w-full"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  ID Employé *
                </label>
                <Input
                  value={payslipData.employeeId}
                  onChange={(e) => handleInputChange('employeeId', e.target.value)}
                  placeholder="EMP001"
                  className="w-full"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Période *
                </label>
                <Input
                  value={payslipData.period}
                  onChange={(e) => handleInputChange('period', e.target.value)}
                  placeholder="2025-01"
                  className="w-full"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Salaire Brut (€)
                  </label>
                  <Input
                    type="number"
                    value={payslipData.grossSalary}
                    onChange={(e) => handleInputChange('grossSalary', parseFloat(e.target.value) || 0)}
                    placeholder="3000"
                    className="w-full"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Salaire Net (€)
                  </label>
                  <Input
                    type="number"
                    value={payslipData.netSalary}
                    onChange={(e) => handleInputChange('netSalary', parseFloat(e.target.value) || 0)}
                    placeholder="2400"
                    className="w-full"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Charges Sociales (€)
                  </label>
                  <Input
                    type="number"
                    value={payslipData.socialContributions}
                    onChange={(e) => handleInputChange('socialContributions', parseFloat(e.target.value) || 0)}
                    placeholder="450"
                    className="w-full"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Impôt sur le Revenu (€)
                  </label>
                  <Input
                    type="number"
                    value={payslipData.incomeTax}
                    onChange={(e) => handleInputChange('incomeTax', parseFloat(e.target.value) || 0)}
                    placeholder="150"
                    className="w-full"
                  />
                </div>
              </div>
            </div>
          </Card>

          {/* Résultats et actions */}
          <Card className="p-6">
            <h2 className="text-2xl font-semibold mb-6">Ancrage Blockchain</h2>
            
            {!isConnected ? (
              <div className="text-center">
                <p className="text-gray-600 mb-4">
                  Connectez votre wallet MetaMask pour ancrer le bulletin de paie
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
                  onClick={onAnchorPayslip}
                  disabled={isAnchoring}
                  className="w-full"
                >
                  {isAnchoring ? (
                    <>
                      <LoadingSpinner className="mr-2" />
                      Ancrage en cours...
                    </>
                  ) : (
                    '🔒 Ancrer le Bulletin de Paie'
                  )}
                </Button>

                {result && (
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <h3 className="font-semibold text-blue-900 mb-2">✅ Ancrage Réussi</h3>
                    <div className="space-y-2 text-sm">
                      <p><strong>Hash:</strong> <code className="text-xs">{result.payslipHash}</code></p>
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
          <h3 className="text-lg font-semibold mb-4">ℹ️ À propos du Module RH</h3>
          <div className="text-sm text-gray-600 space-y-2">
            <p>• <strong>Sécurité:</strong> Chaque bulletin de paie est hashé et ancré sur la blockchain Ethereum</p>
            <p>• <strong>Traçabilité:</strong> Historique complet des modifications et vérifications</p>
            <p>• <strong>Conformité:</strong> Respect des réglementations RGPD et droit du travail</p>
            <p>• <strong>Intégrité:</strong> Impossible de modifier un bulletin une fois ancré</p>
          </div>
        </Card>
      </div>
    </div>
  );
}
