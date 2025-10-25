// app/api/certificates/route.ts
// API pour générer et télécharger des certificats PDF

import { NextRequest, NextResponse } from 'next/server';
import { generateCertificate } from '@/lib/pdf/certificate';
import { CertificateData } from '@/lib/pdf/types';

/**
 * POST /api/certificates
 * Génère un certificat PDF pour un document ancré sur la blockchain
 */
export async function POST(request: NextRequest) {
  try {
    console.log('[API Certificates] Requête reçue');
    
    // Parse du body JSON
    const body = await request.json();
    console.log('[API Certificates] Données reçues:', {
      hash: body.hash ? `${body.hash.slice(0, 10)}...` : 'non fourni',
      txHash: body.txHash ? `${body.txHash.slice(0, 10)}...` : 'non fourni',
      network: body.network || 'non fourni',
      contractAddress: body.contractAddress ? `${body.contractAddress.slice(0, 10)}...` : 'non fourni',
    });
    
    // Validation des champs obligatoires
    const requiredFields = ['hash', 'txHash', 'network', 'contractAddress'];
    const missingFields = requiredFields.filter(field => !body[field]);
    
    if (missingFields.length > 0) {
      console.log('[API Certificates] Champs manquants:', missingFields);
      return NextResponse.json(
        { 
          error: 'Champs obligatoires manquants',
          missingFields,
          required: requiredFields,
        },
        { status: 400 }
      );
    }
    
    // Construction des données du certificat
    const certificateData: CertificateData = {
      hash: body.hash.trim(),
      txHash: body.txHash.trim(),
      network: body.network.trim(),
      contractAddress: body.contractAddress.trim(),
      issuerAddress: body.issuerAddress?.trim(),
      issuedTo: body.issuedTo?.trim(),
      issuedAt: body.issuedAt || new Date().toISOString(),
      appName: body.appName || 'VeritasChain',
      verifyBaseUrl: body.verifyBaseUrl || getBaseUrl(request),
    };
    
    console.log('[API Certificates] Génération du certificat...');
    
    // Génération du certificat PDF
    const result = await generateCertificate(certificateData);
    
    console.log('[API Certificates] Certificat généré:', {
      id: result.metadata.id,
      filename: result.filename,
      size: result.pdfBuffer.length,
    });
    
    // Retour du PDF
    return new NextResponse(new Uint8Array(result.pdfBuffer), {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="${result.filename}"`,
        'Content-Length': result.pdfBuffer.length.toString(),
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'X-Certificate-ID': result.metadata.id,
        'X-Generated-At': result.metadata.generatedAt,
      },
    });
    
  } catch (error) {
    console.error('[API Certificates] Erreur:', error);
    
    // Ne pas exposer les détails de l'erreur en production
    const errorMessage = error instanceof Error ? error.message : 'Erreur lors de la génération du certificat';
    
    return NextResponse.json(
      { 
        error: 'Erreur lors de la génération du certificat',
        details: process.env.NODE_ENV === 'development' ? errorMessage : 'Erreur interne',
      },
      { status: 500 }
    );
  }
}

/**
 * GET /api/certificates
 * Informations sur l'API (pour documentation)
 */
export async function GET() {
  return NextResponse.json({
    name: 'Certificates API',
    version: '1.0.0',
    description: 'API pour générer des certificats PDF d\'ancrage blockchain',
    endpoints: {
      POST: {
        description: 'Génère un certificat PDF',
        body: {
          hash: 'string (required) - Hash SHA-256 du document',
          txHash: 'string (required) - Hash de la transaction blockchain',
          network: 'string (required) - Réseau blockchain (sepolia, mainnet, etc.)',
          contractAddress: 'string (required) - Adresse du contrat',
          issuerAddress: 'string (optional) - Adresse de l\'émetteur',
          issuedTo: 'string (optional) - Nom du bénéficiaire',
          issuedAt: 'string (optional) - Date d\'émission ISO',
          appName: 'string (optional) - Nom de l\'application',
          verifyBaseUrl: 'string (optional) - URL de base pour vérification',
        },
        response: 'application/pdf - Fichier PDF téléchargeable',
      },
    },
    examples: {
      curl: 'curl -X POST /api/certificates -H "Content-Type: application/json" -d \'{"hash":"0x...","txHash":"0x...","network":"sepolia","contractAddress":"0x..."}\'',
    },
  });
}

/**
 * Extrait l'URL de base depuis la requête
 */
function getBaseUrl(request: NextRequest): string {
  const host = request.headers.get('host');
  const protocol = request.headers.get('x-forwarded-proto') || 'https';
  
  if (host) {
    return `${protocol}://${host}`;
  }
  
  // Fallback vers l'URL publique
  return process.env.NEXT_PUBLIC_SITE_URL || 'https://seritaschain.vercel.app';
}
