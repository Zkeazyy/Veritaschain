'use client';

import { useState } from 'react';
import { Card, Button, Input, Alert, LoadingSpinner } from '@/components/ui';
import { sha256HexBrowser } from '@/lib/hash';
import { useWeb3Wallet, anchorDocumentWithWallet, AddressHex } from '@/lib/web3';

interface LegalDocumentData {
  documentType: 'contract' | 'notary_act' | 'legal_opinion' | 'other';
  documentTitle: string;
  parties: string[];
  notaryName?: string;
  notaryRegistration?: string;
  signingDate: string;
  documentContent: string;
  attachments: string[];
}

interface LegalDocumentResult {
  txHash: string;
  author: string;
  timestamp: number;
  documentHash: string;
}

export default function LegalDocumentsPage() {
  const [documentData, setDocumentData] = useState<LegalDocumentData>({
    documentType: 'contract',
    documentTitle: '',
    parties: [''],
    notaryName: '',
    notaryRegistration: '',
    signingDate: '',
    documentContent: '',
    attachments: [],
  });
  
  const [isAnchoring, setIsAnchoring] = useState(false);
  const [result, setResult] = useState<LegalDocumentResult | null>(null);
  const [toastSuccess, setToastSuccess] = useState('');
  const [toastError, setToastError] = useState('');

  // Hook Web3
  const { isConnected, address, connectWallet, error: walletError } = useWeb3Wallet();

  const handleInputChange = (field: keyof LegalDocumentData, value: any) => {
    setDocumentData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const addParty = () => {
    setDocumentData(prev => ({
      ...prev,
      parties: [...prev.parties, '']
    }));
  };

  const removeParty = (index: number) => {
    setDocumentData(prev => ({
      ...prev,
      parties: prev.parties.filter((_, i) => i !== index)
    }));
  };

  const updateParty = (index: number, value: string) => {
    setDocumentData(prev => ({
      ...prev,
      parties: prev.parties.map((party, i) => i === index ? value : party)
    }));
  };

  const generateDocumentHash = async (): Promise<string> => {
    // Créer un objet structuré pour le hash
    const documentForHash = {
      documentType: documentData.documentType,
      documentTitle: documentData.documentTitle,
      parties: documentData.parties.filter(p => p.trim() !== ''),
      notaryName: documentData.notaryName,
      notaryRegistration: documentData.notaryRegistration,
      signingDate: documentData.signingDate,
      documentContent: documentData.documentContent,
      attachments: documentData.attachments,
      timestamp: new Date().toISOString(),
    };

    // Convertir en JSON et calculer le hash
    const jsonString = JSON.stringify(documentForHash, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const file = new File([blob], 'legal-document.json', { type: 'application/json' });
    return await sha256HexBrowser(file);
  };

  const onAnchorDocument = async () => {
    if (!isConnected) {
      setToastError('Veuillez connecter votre wallet MetaMask');
      return;
    }

    if (!documentData.documentTitle || !documentData.signingDate || documentData.parties.every(p => p.trim() === '')) {
      setToastError('Veuillez remplir tous les champs obligatoires');
      return;
    }

    try {
      setIsAnchoring(true);
      setToastError('');
      setToastSuccess('');

      console.log('[Legal] Génération du hash du document juridique...');
      const documentHash = await generateDocumentHash();
      console.log('[Legal] Hash généré:', documentHash);

      const fileName = `legal-${documentData.documentType}-${documentData.signingDate}.json`;
      
      console.log('[Legal] Ancrage du document sur la blockchain...');
      const anchorResult = await anchorDocumentWithWallet(documentHash, fileName, address!);
      
      console.log('[Legal] Ancrage réussi:', anchorResult);
      
      setResult({
        txHash: anchorResult.txHash,
        author: anchorResult.author,
        timestamp: anchorResult.timestamp,
        documentHash,
      });

      setToastSuccess(`Document juridique ancré avec succès ! Transaction: ${anchorResult.txHash.slice(0, 10)}...`);
      
    } catch (error) {
      console.error('[Legal] Erreur lors de l\'ancrage:', error);
      setToastError(error instanceof Error ? error.message : 'Erreur lors de l\'ancrage du document juridique');
    } finally {
      setIsAnchoring(false);
    }
  };

  const getDocumentTypeLabel = (type: string) => {
    const labels = {
      contract: 'Contrat',
      notary_act: 'Acte Notarié',
      legal_opinion: 'Avis Juridique',
      other: 'Autre Document'
    };
    return labels[type as keyof typeof labels] || type;
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-3">
            ⚖️ Module Juridique & Notaires
          </h1>
          <p className="text-gray-600">
            Ancrage sécurisé des documents juridiques et actes notariés sur la blockchain VeritasChain
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
                  <option value="contract">Contrat</option>
                  <option value="notary_act">Acte Notarié</option>
                  <option value="legal_opinion">Avis Juridique</option>
                  <option value="other">Autre Document</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Titre du Document *
                </label>
                <Input
                  value={documentData.documentTitle}
                  onChange={(e) => handleInputChange('documentTitle', e.target.value)}
                  placeholder="Contrat de vente immobilière"
                  className="w-full"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Parties Concernées *
                </label>
                {documentData.parties.map((party, index) => (
                  <div key={index} className="flex gap-2 mb-2">
                    <Input
                      value={party}
                      onChange={(e) => updateParty(index, e.target.value)}
                      placeholder={`Partie ${index + 1}`}
                      className="flex-1"
                    />
                    {documentData.parties.length > 1 && (
                      <Button
                        onClick={() => removeParty(index)}
                        variant="outline"
                        className="px-3"
                      >
                        ✕
                      </Button>
                    )}
                  </div>
                ))}
                <Button onClick={addParty} variant="outline" className="w-full">
                  + Ajouter une Partie
                </Button>
              </div>

              {documentData.documentType === 'notary_act' && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Nom du Notaire
                    </label>
                    <Input
                      value={documentData.notaryName || ''}
                      onChange={(e) => handleInputChange('notaryName', e.target.value)}
                      placeholder="Maître Dupont"
                      className="w-full"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Numéro d'Inscription
                    </label>
                    <Input
                      value={documentData.notaryRegistration || ''}
                      onChange={(e) => handleInputChange('notaryRegistration', e.target.value)}
                      placeholder="123456"
                      className="w-full"
                    />
                  </div>
                </>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Date de Signature *
                </label>
                <Input
                  type="date"
                  value={documentData.signingDate}
                  onChange={(e) => handleInputChange('signingDate', e.target.value)}
                  className="w-full"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Contenu du Document
                </label>
                <textarea
                  value={documentData.documentContent}
                  onChange={(e) => handleInputChange('documentContent', e.target.value)}
                  placeholder="Résumé ou extraits du document..."
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
                    '🔒 Ancrer le Document Juridique'
                  )}
                </Button>

                {result && (
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <h3 className="font-semibold text-blue-900 mb-2">✅ Ancrage Réussi</h3>
                    <div className="space-y-2 text-sm">
                      <p><strong>Type:</strong> {getDocumentTypeLabel(documentData.documentType)}</p>
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
          <h3 className="text-lg font-semibold mb-4">ℹ️ À propos du Module Juridique</h3>
          <div className="text-sm text-gray-600 space-y-2">
            <p>• <strong>Valeur Probante:</strong> Ancrage horodaté pour la preuve juridique</p>
            <p>• <strong>Conformité:</strong> Respect du Code civil et des procédures notariales</p>
            <p>• <strong>Sécurité:</strong> Protection contre la falsification des actes</p>
            <p>• <strong>Archivage:</strong> Conservation pérenne des documents juridiques</p>
          </div>
        </Card>
      </div>
    </div>
  );
}
