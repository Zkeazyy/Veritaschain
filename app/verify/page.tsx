'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Card, Button, Input, Alert, LoadingSpinner } from '@/components/ui';
import DownloadCertificateButton from '@/components/DownloadCertificateButton';

type VerifyOk = {
  exists: true;
  author: string;
  timestamp: number;
  etherscanContractUrl: string;
  etherscanTxUrl?: string;
};

type VerifyKo = { exists: false };

function VerifyContent() {
  const searchParams = useSearchParams();
  const [hash, setHash] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [result, setResult] = useState<VerifyOk | VerifyKo | null>(null);
  const [copied, setCopied] = useState(false);

  // Charger le hash depuis l'URL au montage du composant
  useEffect(() => {
    const hashFromUrl = searchParams.get('hash');
    if (hashFromUrl && isValidHash(hashFromUrl)) {
      setHash(hashFromUrl);
      // Vérifier automatiquement si un hash valide est dans l'URL
      setTimeout(() => onVerify(), 100);
    }
  }, [searchParams]);

  const isValidHash = (value: string) => /^0x[0-9a-fA-F]{64}$/.test(value);

  const formatDate = (ts: number) =>
    new Date(ts * 1000).toLocaleString('fr-FR', {
      timeZone: 'UTC',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });

  const onVerify = async () => {
    setError('');
    setResult(null);
    setCopied(false);

    if (!isValidHash(hash)) {
      setError('Hash invalide. Format attendu: 0x suivi de 64 caractères hexadécimaux.');
      return;
    }

    try {
      setLoading(true);
      console.log('[Verify] Vérification du hash:', hash);
      
      const res = await fetch('/api/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ hash }),
      });
      
      const data = await res.json();
      console.log('[Verify] Réponse API:', data);
      
      if (!res.ok) {
        if (res.status === 503) {
          throw new Error('Réseau indisponible, réessayez dans quelques instants');
        }
        throw new Error(data.error || 'Erreur lors de la vérification');
      }
      
      setResult(data as VerifyOk | VerifyKo);
      
      // Log du résultat pour debug
      if (data.exists) {
        console.log('[Verify] ✅ Hash trouvé:', data);
      } else {
        console.log('[Verify] ❌ Hash non trouvé');
      }
      
    } catch (e) {
      console.error('[Verify] Erreur:', e);
      setError(e instanceof Error ? e.message : 'Erreur lors de la vérification');
    } finally {
      setLoading(false);
    }
  };

  const onCopy = async () => {
    try {
      await navigator.clipboard.writeText(hash);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // ignore
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-3">Vérifier un hash</h1>
          <p className="text-gray-600">Collez un hash SHA-256 (0x + 64 hex) pour vérifier son ancrage.</p>
        </div>

        {error && (
          <Alert variant="destructive" className="mb-6">{error}</Alert>
        )}

        <Card>
          <div className="space-y-4">
            <Input
              label="Hash (0x + 64 hex)"
              value={hash}
              onChange={(e) => setHash(e.target.value)}
              placeholder="0x..."
              error={hash && !isValidHash(hash) ? 'Format de hash invalide' : undefined}
            />

            <Button onClick={onVerify} disabled={!isValidHash(hash) || loading} className="w-full">
              {loading ? (
                <span className="inline-flex items-center"><LoadingSpinner size="sm" className="mr-2"/>Vérification...</span>
              ) : (
                'Vérifier'
              )}
            </Button>
          </div>
        </Card>

        {result && (
          <Card className="mt-6">
            {result.exists ? (
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <span className="inline-block w-2.5 h-2.5 rounded-full bg-green-500" />
                  <span className="text-green-700 font-medium">Ancré</span>
                </div>
                <div className="text-sm text-gray-700 space-y-1">
                  <div><span className="text-gray-500">Auteur:</span> <span className="font-mono">{result.author}</span></div>
                  <div><span className="text-gray-500">Horodatage:</span> {formatDate(result.timestamp)}</div>
                  <div>
                    <span className="text-gray-500">Contrat:</span>{' '}
                    <a href={result.etherscanContractUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800">
                      Voir sur Etherscan
                    </a>
                  </div>
                  <div className="break-all font-mono text-xs p-2 bg-gray-50 border rounded">
                    {hash}
                  </div>
                  <div className="flex gap-2">
                    <Button variant="secondary" onClick={onCopy}>{copied ? 'Copié !' : 'Copier le hash'}</Button>
                    <DownloadCertificateButton
                      hash={hash}
                      txHash={result.etherscanTxUrl ? result.etherscanTxUrl.split('/tx/')[1] || '' : ''}
                      network="sepolia"
                      contractAddress="0x7b7C41cf5bc986F406c7067De6e69f200c27D63f"
                      issuerAddress={result.author}
                      variant="outline"
                      size="sm"
                    />
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <span className="inline-block w-2.5 h-2.5 rounded-full bg-red-500" />
                <span className="text-red-700 font-medium">Non ancré</span>
              </div>
            )}
          </Card>
        )}

        <div className="mt-6 text-center">
          <a href="/" className="text-sm text-gray-600 hover:text-gray-800">← Retour à l'ancrage</a>
        </div>
      </div>
    </div>
  );
}

export default function VerifyPage() {
  return (
    <Suspense fallback={<div>Chargement...</div>}>
      <VerifyContent />
    </Suspense>
  );
}
