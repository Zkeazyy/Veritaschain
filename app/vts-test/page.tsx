// app/vts-test/page.tsx
// Page de test pour les composants VTS

'use client';

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { VtsBadge, VtsBalanceCard, PriceWithDiscount, PriceList } from '@/components/vts';
import { VTS_CONFIG } from '@/lib/token/config';

export default function VtsTestPage() {
  const testPrices = [
    {
      id: 'basic',
      name: 'Plan Basique',
      amountCents: 990, // 9.90 EUR
      description: 'Ancrage de documents essentiels',
    },
    {
      id: 'pro',
      name: 'Plan Pro',
      amountCents: 1990, // 19.90 EUR
      description: 'Ancrage illimité + certificats PDF',
    },
    {
      id: 'enterprise',
      name: 'Plan Entreprise',
      amountCents: 4990, // 49.90 EUR
      description: 'Modules spécialisés + API',
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-3">
            🧪 Test des Composants VTS
          </h1>
          <p className="text-gray-600">
            Page de test pour vérifier l'intégration du token VTS
          </p>
        </div>

        {/* Configuration */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Configuration VTS</CardTitle>
            <CardDescription>
              État actuel de la configuration du module VTS
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div>
                <strong>Module activé:</strong>
                <p className="text-muted-foreground">
                  {VTS_CONFIG.contractAddress ? '✅ Oui' : '❌ Non'}
                </p>
              </div>
              <div>
                <strong>Contrat:</strong>
                <p className="text-muted-foreground font-mono text-xs">
                  {VTS_CONFIG.contractAddress || 'Non configuré'}
                </p>
              </div>
              <div>
                <strong>Seuil:</strong>
                <p className="text-muted-foreground">
                  {VTS_CONFIG.discountThreshold} VTS
                </p>
              </div>
              <div>
                <strong>Réduction:</strong>
                <p className="text-muted-foreground">
                  -{VTS_CONFIG.discountPercent}%
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* VTS Badge */}
          <Card>
            <CardHeader>
              <CardTitle>VtsBadge</CardTitle>
              <CardDescription>
                Badge compact affichant l'état VTS
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-medium mb-2">Badge normal:</h4>
                <VtsBadge />
              </div>
              <div>
                <h4 className="font-medium mb-2">Badge sans icône:</h4>
                <VtsBadge showIcon={false} />
              </div>
              <div>
                <h4 className="font-medium mb-2">Badge simple:</h4>
                <VtsBadge showIcon={true} />
              </div>
            </CardContent>
          </Card>

          {/* VTS Balance Card */}
          <Card>
            <CardHeader>
              <CardTitle>VtsBalanceCard</CardTitle>
              <CardDescription>
                Carte complète du solde VTS
              </CardDescription>
            </CardHeader>
            <CardContent>
              <VtsBalanceCard />
            </CardContent>
          </Card>

          {/* Price with Discount */}
          <Card>
            <CardHeader>
              <CardTitle>PriceWithDiscount</CardTitle>
              <CardDescription>
                Affichage des prix avec réduction VTS
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-medium mb-2">Prix simple:</h4>
                <PriceWithDiscount 
                  amountCents={990} 
                  currency="EUR"
                  showVtsHint={true}
                />
              </div>
              <div>
                <h4 className="font-medium mb-2">Prix avec réduction forcée:</h4>
                <PriceWithDiscount 
                  amountCents={1990} 
                  currency="EUR"
                  discountPercent={50}
                  showVtsHint={false}
                />
              </div>
              <div>
                <h4 className="font-medium mb-2">Prix sans hint:</h4>
                <PriceWithDiscount 
                  amountCents={4990} 
                  currency="EUR"
                  showVtsHint={false}
                />
              </div>
            </CardContent>
          </Card>

          {/* Price List */}
          <Card>
            <CardHeader>
              <CardTitle>PriceList</CardTitle>
              <CardDescription>
                Liste des prix avec réductions VTS
              </CardDescription>
            </CardHeader>
            <CardContent>
              <PriceList 
                prices={testPrices}
                currency="EUR"
                showVtsHint={true}
              />
            </CardContent>
          </Card>
        </div>

        {/* Instructions */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Instructions de Test</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h4 className="font-medium">Pour tester avec un wallet connecté :</h4>
                <ol className="list-decimal list-inside space-y-1 text-sm text-muted-foreground">
                  <li>Connectez MetaMask sur le réseau Sepolia</li>
                  <li>Configurez NEXT_PUBLIC_VTS_CONTRACT_ADDRESS dans .env</li>
                  <li>Rechargez la page</li>
                  <li>Vérifiez que les composants affichent le solde VTS</li>
                </ol>
              </div>
              
              <div>
                <h4 className="font-medium">Variables d'environnement requises :</h4>
                <pre className="bg-gray-100 p-3 rounded text-xs overflow-x-auto">
{`NEXT_PUBLIC_VTS_CONTRACT_ADDRESS=0x<adresse_token>
NEXT_PUBLIC_NETWORK=sepolia
NEXT_PUBLIC_RPC_URL=https://sepolia.infura.io/v3/...`}
                </pre>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
