// lib/pdf/certificate.ts
// Générateur de certificats PDF avec pdf-lib

import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import { CertificateData, CertificateConfig, CertificateResult, CertificateMetadata, DEFAULT_CERTIFICATE_CONFIG, SUPPORTED_NETWORKS } from './types';
import { generateVerificationQR, buildVerifyUrl } from '../qr';
import fs from 'fs';
import path from 'path';

/**
 * Génère un ID de certificat unique
 */
function generateCertificateId(hash: string): string {
  const now = new Date();
  const dateStr = now.toISOString().slice(0, 10).replace(/-/g, '');
  
  // Utiliser les premiers caractères du hash pour l'unicité
  const hashSuffix = hash.slice(2, 7).toUpperCase();
  
  return `VERI-${dateStr}-${hashSuffix}`;
}

/**
 * Valide les données du certificat
 */
function validateCertificateData(data: CertificateData): { isValid: boolean; errors: string[] } {
  const errors: string[] = [];
  
  // Validation du hash
  if (!data.hash || !/^0x[0-9a-fA-F]{64}$/.test(data.hash)) {
    errors.push('Hash invalide: doit commencer par 0x et contenir exactement 64 caractères hexadécimaux');
  }
  
  // Validation du txHash
  if (!data.txHash || !/^0x[0-9a-fA-F]{64}$/.test(data.txHash)) {
    errors.push('Transaction hash invalide: doit commencer par 0x et contenir exactement 64 caractères hexadécimaux');
  }
  
  // Validation de l'adresse du contrat
  if (!data.contractAddress || !/^0x[0-9a-fA-F]{40}$/.test(data.contractAddress)) {
    errors.push('Adresse du contrat invalide: doit commencer par 0x et contenir exactement 40 caractères hexadécimaux');
  }
  
  // Validation de l'adresse émettrice (optionnelle)
  if (data.issuerAddress && !/^0x[0-9a-fA-F]{40}$/.test(data.issuerAddress)) {
    errors.push('Adresse émettrice invalide: doit commencer par 0x et contenir exactement 40 caractères hexadécimaux');
  }
  
  return {
    isValid: errors.length === 0,
    errors,
  };
}

/**
 * Formate une date ISO en format lisible
 */
function formatDate(isoDate: string): string {
  const date = new Date(isoDate);
  return date.toISOString().replace('T', ' ').slice(0, 19) + ' UTC';
}

/**
 * Styles constants pour le design system
 */
const STYLES = {
  // Espacements
  margins: { top: 36, right: 36, bottom: 36, left: 36 },
  
  // Tailles de police
  fontSizes: {
    title: 24,
    section: 16,
    label: 11,
    value: 10,
    legal: 8,
  },
  
  // Interlignes
  lineHeight: 14,
  
  // Espacements verticaux
  spacing: {
    xs: 10,
    sm: 15,
    md: 20,
    lg: 30,
    xl: 40,
  },
} as const;

/**
 * Tronque un texte long avec gestion des retours à la ligne
 */
function wrapText(text: string, maxChars: number): string[] {
  if (text.length <= maxChars) {
    return [text];
  }
  
  const lines: string[] = [];
  for (let i = 0; i < text.length; i += maxChars) {
    lines.push(text.slice(i, i + maxChars));
  }
  
  return lines;
}

/**
 * Wrappe un hash long (0x + 64 chars)
 */
function wrapHash(hash: string): string[] {
  // Format: 0x + 64 caractères
  if (hash.length === 66) {
    return [
      hash.slice(0, 34),
      hash.slice(34, 66),
    ];
  }
  return wrapText(hash, 34);
}

/**
 * Wrappe un txHash long (0x + 64 chars)
 */
function wrapTxHash(txHash: string): string[] {
  // Format: 0x + 64 caractères
  if (txHash.length === 66) {
    return [
      txHash.slice(0, 34),
      txHash.slice(34, 66),
    ];
  }
  return wrapText(txHash, 34);
}

/**
 * Génère un certificat PDF complet
 */
export async function generateCertificate(
  data: CertificateData,
  config: CertificateConfig = DEFAULT_CERTIFICATE_CONFIG
): Promise<CertificateResult> {
  console.log('[PDF] Début de génération du certificat');
  
  // Validation des données
  const validation = validateCertificateData(data);
  if (!validation.isValid) {
    throw new Error(`Données invalides: ${validation.errors.join(', ')}`);
  }
  
  // Génération des métadonnées
  const certificateId = generateCertificateId(data.hash);
  const generatedAt = new Date().toISOString();
  const verifyUrl = buildVerifyUrl(
    data.verifyBaseUrl || 'https://seritaschain.vercel.app',
    data.hash
  );
  
  const metadata: CertificateMetadata = {
    id: certificateId,
    generatedAt,
    version: '1.0.0',
    verifyUrl,
  };
  
  console.log('[PDF] Métadonnées générées:', { id: certificateId, verifyUrl });
  
  // Génération du QR code
  const qrResult = await generateVerificationQR(verifyUrl);
  
  // Création du document PDF
  const pdfDoc = await PDFDocument.create();
  
  // Ajout d'une page A4
  const page = pdfDoc.addPage([595.28, 841.89]); // A4 en points
  const { width, height } = page.getSize();
  
  // Chargement des polices
  const helvetica = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const helveticaBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
  const courier = await pdfDoc.embedFont(StandardFonts.Courier);
  
  // Couleurs
  const primaryColor = rgb(0.04, 0.37, 1.0); // #0A5FFF
  const secondaryColor = rgb(0.29, 0.33, 0.41); // #4A5568
  const textColor = rgb(0.1, 0.13, 0.17); // #1A202C
  
  // Chargement du logo si disponible
  let logoImage: any = null;
  try {
    const logoPath = path.join(process.cwd(), 'public', 'logo.png');
    if (fs.existsSync(logoPath)) {
      const logoBytes = fs.readFileSync(logoPath);
      logoImage = await pdfDoc.embedPng(logoBytes);
    }
  } catch (error) {
    console.log('[PDF] Logo non disponible:', error);
  }
  
  let yPosition = height - config.margins.top;
  
  // En-tête avec logo
  const appName = data.appName || 'VeritasChain';
  
  // Logo à gauche (si disponible)
  if (logoImage) {
    const logoWidth = 40;
    const logoHeight = 40;
    page.drawImage(logoImage, {
      x: config.margins.left,
      y: yPosition,
      width: logoWidth,
      height: logoHeight,
    });
  }
  
  page.drawText(appName, {
    x: config.margins.left + (logoImage ? 50 : 0),
    y: yPosition + 15,
    size: 16,
    font: helveticaBold,
    color: primaryColor,
  });
  
  page.drawText('Certificat d\'Ancrage Blockchain', {
    x: width - config.margins.right - 200,
    y: yPosition + 15,
    size: 14,
    font: helveticaBold,
    color: textColor,
  });
  
  yPosition -= 30;
  
  // Ligne de séparation
  page.drawLine({
    start: { x: config.margins.left, y: yPosition },
    end: { x: width - config.margins.right, y: yPosition },
    thickness: 1,
    color: secondaryColor,
  });
  
  yPosition -= 40;
  
  // Titre principal
  page.drawText('CERTIFICAT D\'ANCRAGE BLOCKCHAIN', {
    x: config.margins.left,
    y: yPosition,
    size: 24,
    font: helveticaBold,
    color: primaryColor,
  });
  
  yPosition -= 60;
  
  // Encart résumé
  const summaryY = yPosition;
  const summaryHeight = 120;
  
  // Fond de l'encart
  page.drawRectangle({
    x: config.margins.left,
    y: summaryY - summaryHeight,
    width: width - config.margins.left - config.margins.right,
    height: summaryHeight,
    borderColor: primaryColor,
    borderWidth: 2,
  });
  
  // Contenu de l'encart
  let summaryYPos = summaryY - 20;
  
  page.drawText(`ID Certificat: ${certificateId}`, {
    x: config.margins.left + 10,
    y: summaryYPos,
    size: 12,
    font: helveticaBold,
    color: textColor,
  });
  
  summaryYPos -= 20;
  
  // Hash du document (avec gestion du retour à la ligne)
  const hashLines = wrapHash(data.hash);
  page.drawText('Hash Document:', {
    x: config.margins.left + 10,
    y: summaryYPos,
    size: 10,
    font: helvetica,
    color: textColor,
  });

  summaryYPos -= 15;
  hashLines.forEach((line, index) => {
    page.drawText(line, {
      x: config.margins.left + 10,
      y: summaryYPos - (index * 12),
      size: 9,
      font: courier,
      color: textColor,
    });
  });

  summaryYPos -= (hashLines.length * 12) + 10;
  
  const issuedAt = data.issuedAt || generatedAt;
  page.drawText(`Date (UTC): ${formatDate(issuedAt)}`, {
    x: config.margins.left + 10,
    y: summaryYPos,
    size: 10,
    font: helvetica,
    color: textColor,
  });
  
  yPosition = summaryY - summaryHeight - 30;
  
  // Détails d'ancrage
  page.drawText('DÉTAILS D\'ANCRAGE', {
    x: config.margins.left,
    y: yPosition,
    size: 16,
    font: helveticaBold,
    color: primaryColor,
  });
  
  yPosition -= 30;
  
  const details = [
    ['Réseau:', data.network],
    ['Contrat:', data.contractAddress],
    ['Transaction:', data.txHash],
    ['Émetteur:', data.issuerAddress || '—'],
    ['Bénéficiaire:', data.issuedTo || '—'],
  ];
  
  details.forEach(([label, value]) => {
    page.drawText(label, {
      x: config.margins.left,
      y: yPosition,
      size: 11,
      font: helveticaBold,
      color: textColor,
    });
    
    const valueLines = wrapText(value, 60);
    valueLines.forEach((line, index) => {
      page.drawText(line, {
        x: config.margins.left + 80,
        y: yPosition - (index * 12),
        size: 10,
        font: courier,
        color: textColor,
      });
    });
    
    yPosition -= Math.max(15, valueLines.length * 12 + 5);
  });
  
  yPosition -= 20;
  
  // QR Code et Vérification
  page.drawText('VÉRIFICATION', {
    x: config.margins.left,
    y: yPosition,
    size: 16,
    font: helveticaBold,
    color: primaryColor,
  });
  
  yPosition -= 30;
  
  // QR Code (placeholder pour l'instant)
  page.drawRectangle({
    x: config.margins.left,
    y: yPosition - 160,
    width: 160,
    height: 160,
    borderColor: secondaryColor,
    borderWidth: 1,
  });
  
  page.drawText('QR Code', {
    x: config.margins.left + 60,
    y: yPosition - 80,
    size: 12,
    font: helvetica,
    color: secondaryColor,
  });
  
  // URL de vérification
  page.drawText('Vérifier l\'authenticité:', {
    x: config.margins.left + 180,
    y: yPosition - 20,
    size: 11,
    font: helveticaBold,
    color: textColor,
  });
  
  const urlLines = wrapText(verifyUrl, 50);
  urlLines.forEach((line, index) => {
    page.drawText(line, {
      x: config.margins.left + 180,
      y: yPosition - 40 - (index * 12),
      size: 9,
      font: courier,
      color: primaryColor,
    });
  });
  
  yPosition -= 200;
  
  // Signature visuelle
  page.drawText('Signé électroniquement par VeritasChain', {
    x: config.margins.left,
    y: yPosition,
    size: 12,
    font: helveticaBold,
    color: textColor,
  });
  
  yPosition -= 50;
  
  // Mentions légales
  const legalText = 'Ce certificat atteste l\'enregistrement immuable du hash du document sur la blockchain. Le certificat ne contient pas le document, uniquement son empreinte cryptographique (SHA-256).';
  
  const legalLines = wrapText(legalText, 80);
  legalLines.forEach((line, index) => {
    page.drawText(line, {
      x: config.margins.left,
      y: yPosition - (index * 10),
      size: 8,
      font: helvetica,
      color: secondaryColor,
    });
  });
  
  // Génération du PDF
  const pdfBytes = await pdfDoc.save();
  
  console.log('[PDF] Certificat généré avec succès, taille:', pdfBytes.length, 'bytes');
  
  return {
    pdfBuffer: Buffer.from(pdfBytes),
    metadata,
    filename: `VeritasCertificate_${certificateId}.pdf`,
  };
}
