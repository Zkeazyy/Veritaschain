'use client';

import { useState } from 'react';
import { Card, Button, Input, Alert, LoadingSpinner } from '@/components/ui';
import { sha256HexBrowser } from '@/lib/hash';
import { useWeb3Wallet, anchorDocumentWithWallet, AddressHex } from '@/lib/web3';

interface BTPDocumentData {
  documentType: 'plan' | 'permit' | 'certificate' | 'inspection' | 'other';
  projectName: string;
  projectAddress: string;
  contractorName: string;
  contractorLicense: string;
  issueDate: string;
  validityDate?: string;
  documentContent: string;
  technicalSpecs: string;
  attachments: string[];
}

interface BTPDocumentResult {
  txHash: string;
  author: string;
  timestamp: number;
  documentHash: string;
}

export default function BTPDocumentsPage() {
  const [documentData, setDocumentData] = useState<BTPDocumentData>({
    documentType: 'plan',
    projectName: '',
    projectAddress: '',
    contractorName: '',
    contractorLicense: '',
    issueDate: '',
    validityDate: '',
    documentContent: '',
    technicalSpecs: '',
    attachments: [],
  });
  
  const [isAnchoring, setIsAnchoring] = useState(false);
  const [result, setResult] = useState<BTPDocumentResult | null>(null);
  const [toastSuccess, setToastSuccess] = useState('');
  const [toastError, setToastError] = useState('');

  // Hook Web3
  const { isConnected, address, connectWallet, error: walletError } = useWeb3Wallet();

  const handleInputChange = (field: keyof BTPDocumentData, value: any) => {
    setDocumentData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const generateDocumentHash = async (): Promise<string> => {
    // Créer un objet structuré pour le hash
    const documentForHash = {
      documentType: documentData.documentType,
      projectName: documentData.projectName,
      projectAddress: documentData.projectAddress,
      contractorName: documentData.contractorName,
      contractorLicense: documentData.contractorLicense,
      issueDate: documentData.issueDate,
      validityDate: documentData.validityDate,
      documentContent: documentData.documentContent,
      technicalSpecs: documentData.technicalSpecs,
      attachments: documentData.attachments,
      timestamp: new Date().toISOString(),
    };

    // Convertir en JSON et calculer le hash
    const jsonString = JSON.stringify(documentForHash, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const file = new File([blob], 'btp-document.json', { type: 'application/json' });
    return await sha256HexBrowser(file);
  };

  const onAnchorDocument = async () => {
    if (!isConnected) {
      setToastError('Veuillez connecter votre wallet MetaMask');
      return;
    }

    if (!documentData.projectName || !documentData.contractorName || !documentData.issueDate) {
      setToastError('Veuillez remplir tous les champs obligatoires');
      return;
    }

    try {
      setIsAnchoring(true);
      setToastError('');
      setToastSuccess('');

      console.log('[BTP] Génération du hash du document BTP...');
      const documentHash = await generateDocumentHash();
      console.log('[BTP] Hash généré:', documentHash);

      const fileName = `btp-${documentData.documentType}-${documentData.issueDate}.json`;
      
      console.log('[BTP] Ancrage du document sur la blockchain...');
      const anchorResult = await anchorDocumentWithWallet(documentHash, fileName, address!);
      
      console.log('[BTP] Ancrage réussi:', anchorResult);
      
      setResult({
        txHash: anchorResult.txHash,
        author: anchorResult.author,
        timestamp: anchorResult.timestamp,
        documentHash,
      });

      setToastSuccess(`Document BTP ancré avec succès ! Transaction: ${anchorResult.txHash.slice(0, 10)}...`);
      
    } catch (error) {
      console.error('[BTP] Erreur lors de l\'ancrage:', error);
      setToastError(error instanceof Error ? error.message : 'Erreur lors de l\'ancrage du document BTP');
    } finally {
      setIsAnchoring(false);
    }
  };

  const getDocumentTypeLabel = (type: string) => {
    const labels = {
      plan: 'Plan Architectural',
      permit: 'Permis de Construire',
      certificate: 'Certificat Technique',
      inspection: 'Rapport d\'Inspection',
      other: 'Autre Document'
    };
    return labels[type as keyof typeof labels] || type;
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-3">
            🏗️ Module BTP & Construction
          </h1>
          <p className="text-gray-600">
            Ancrage sécurisé des plans, permis et documents de construction sur la blockchain VeritasChain
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
            <h2 className="text-2xl font-semibold mb-6">Informations du Document</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Type de Document *
                </label>
                <select
                  value={documentData.documentType}
                  onChange={(e) => handleInputChange('documentType', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="plan">Plan Architectural</option>
                  <option value="permit">Permis de Construire</option>
                  <option value="certificate">Certificat Technique</option>
                  <option value="inspection">Rapport d'Inspection</option>
                  <option value="other">Autre Document</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nom du Projet *
                </label>
                <Input
                  value={documentData.projectName}
                  onChange={(e) => handleInputChange('projectName', e.target.value)}
                  placeholder="Résidence Les Jardins"
                  className="w-full"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Adresse du Projet *
                </label>
                <Input
                  value={documentData.projectAddress}
                  onChange={(e) => handleInputChange('projectAddress', e.target.value)}
                  placeholder="123 Avenue des Champs, 75008 Paris"
                  className="w-full"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nom de l'Entrepreneur *
                </label>
                <Input
                  value={documentData.contractorName}
                  onChange={(e) => handleInputChange('contractorName', e.target.value)}
                  placeholder="BTP Construction SARL"
                  className="w-full"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Numéro de Licence
                </label>
                <Input
                  value={documentData.contractorLicense}
                  onChange={(e) => handleInputChange('contractorLicense', e.target.value)}
                  placeholder="BTP-123456"
                  className="w-full"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Date d'Émission *
                  </label>
                  <Input
                    type="date"
                    value={documentData.issueDate}
                    onChange={(e) => handleInputChange('issueDate', e.target.value)}
                    className="w-full"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Date de Validité
                  </label>
                  <Input
                    type="date"
                    value={documentData.validityDate || ''}
                    onChange={(e) => handleInputChange('validityDate', e.target.value)}
                    className="w-full"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description du Document
                </label>
                <textarea
                  value={documentData.documentContent}
                  onChange={(e) => handleInputChange('documentContent', e.target.value)}
                  placeholder="Description du document et de son contenu..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows={3}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Spécifications Techniques
                </label>
                <textarea
                  value={documentData.technicalSpecs}
                  onChange={(e) => handleInputChange('technicalSpecs', e.target.value)}
                  placeholder="Détails techniques, matériaux utilisés, normes respectées..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows={4}
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
                  Connectez votre wallet MetaMask pour ancrer le document
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
                  onClick={onAnchorDocument}
                  disabled={isAnchoring}
                  className="w-full"
                >
                  {isAnchoring ? (
                    <>
                      <LoadingSpinner className="mr-2" />
                      Ancrage en cours...
                    </>
                  ) : (
                    '🔒 Ancrer le Document BTP'
                  )}
                </Button>

                {result && (
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <h3 className="font-semibold text-blue-900 mb-2">✅ Ancrage Réussi</h3>
                    <div className="space-y-2 text-sm">
                      <p><strong>Type:</strong> {getDocumentTypeLabel(documentData.documentType)}</p>
                      <p><strong>Projet:</strong> {documentData.projectName}</p>
                      <p><strong>Hash:</strong> <code className="text-xs">{result.documentHash}</code></p>
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
          <h3 className="text-lg font-semibold mb-4">ℹ️ À propos du Module BTP</h3>
          <div className="text-sm text-gray-600 space-y-2">
            <p>• <strong>Conformité:</strong> Respect des normes de construction et réglementations</p>
            <p>• <strong>Traçabilité:</strong> Suivi complet des modifications et validations</p>
            <p>• <strong>Sécurité:</strong> Protection contre la falsification des plans et permis</p>
            <p>• <strong>Collaboration:</strong> Partage sécurisé entre architectes, entrepreneurs et contrôleurs</p>
          </div>
        </Card>
      </div>
    </div>
  );
}
