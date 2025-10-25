// lib/qr.ts
// Helper pour générer des QR codes

import QRCode from 'qrcode';

export interface QRCodeOptions {
  width?: number;
  margin?: number;
  color?: {
    dark: string;
    light: string;
  };
  errorCorrectionLevel?: 'L' | 'M' | 'Q' | 'H';
}

export interface QRCodeResult {
  dataURL: string;
  size: number;
}

/**
 * Génère un QR code en dataURL PNG
 */
export async function generateQRCode(
  text: string,
  options: QRCodeOptions = {}
): Promise<QRCodeResult> {
  const {
    width = 160,
    margin = 2,
    color = { dark: '#000000', light: '#FFFFFF' },
    errorCorrectionLevel = 'M',
  } = options;

  try {
    console.log('[QR] Génération du QR code pour:', text.substring(0, 50) + '...');
    
    const dataURL = await QRCode.toDataURL(text, {
      width,
      margin,
      color,
      errorCorrectionLevel,
      type: 'image/png',
    });

    console.log('[QR] QR code généré avec succès, taille:', width + 'x' + width);
    
    return {
      dataURL,
      size: width,
    };
  } catch (error) {
    console.error('[QR] Erreur lors de la génération du QR code:', error);
    throw new Error(`Impossible de générer le QR code: ${error instanceof Error ? error.message : 'Erreur inconnue'}`);
  }
}

/**
 * Génère un QR code pour une URL de vérification
 */
export async function generateVerificationQR(
  verifyUrl: string,
  options: QRCodeOptions = {}
): Promise<QRCodeResult> {
  return generateQRCode(verifyUrl, {
    width: 160,
    margin: 2,
    color: { dark: '#0A5FFF', light: '#FFFFFF' },
    errorCorrectionLevel: 'M',
    ...options,
  });
}

/**
 * Valide qu'une URL est valide pour un QR code
 */
export function isValidQRUrl(url: string): boolean {
  try {
    const urlObj = new URL(url);
    return urlObj.protocol === 'https:' || urlObj.protocol === 'http:';
  } catch {
    return false;
  }
}

/**
 * Génère une URL de vérification complète
 */
export function buildVerifyUrl(baseUrl: string, hash: string): string {
  // Nettoyer l'URL de base
  const cleanBaseUrl = baseUrl.replace(/\/$/, '');
  
  // Construire l'URL complète
  const verifyUrl = `${cleanBaseUrl}/verify?hash=${encodeURIComponent(hash)}`;
  
  console.log('[QR] URL de vérification construite:', verifyUrl);
  
  return verifyUrl;
}
