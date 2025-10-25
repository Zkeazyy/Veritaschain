import PDFDocument from 'pdfkit';
import QRCode from 'qrcode';
import fs from 'fs';
import path from 'path';
import { config } from './config';

// Types
export interface CertificateData {
  fileName: string;
  hash: string;
  txHash?: string; // Optionnel
  contract?: string;
  author?: string;
  timestamp?: number | string; // Support timestamp Unix ou ISO string
}

// Palette de couleurs
const COLORS = {
  primary: '#0A5FFF',
  dark: '#0D1B2A',
  gray: '#4A5568',
  lightGray: '#f8fafc',
  border: '#e2e8f0',
};

// Fonction utilitaire pour générer l'URL de vérification
export function getVerifyUrl(hashHex: string): string {
  const normalizedHash = normalizeHash(hashHex);
  return `${config.siteBaseUrl}/verify?hash=${encodeURIComponent(normalizedHash)}`;
}

// Fonction utilitaire pour normaliser le hash (minuscules)
function normalizeHash(hashHex: string): string {
  if (!isValidHash(hashHex)) {
    throw new Error(`Hash invalide: doit commencer par 0x et contenir exactement 64 caractères hexadécimaux. Reçu: ${hashHex}`);
  }
  return hashHex.toLowerCase();
}

// Fonction utilitaire pour valider le hash
function isValidHash(hashHex: string): boolean {
  return /^0x[0-9a-fA-F]{64}$/.test(hashHex);
}

// Fonction utilitaire pour valider le txHash (optionnel)
function isValidTxHash(txHash?: string): boolean {
  if (!txHash) return false;
  return /^0x[0-9a-fA-F]{64}$/.test(txHash);
}

// Fonction utilitaire pour formater le timestamp
function formatTimestamp(timestamp?: number | string): string {
  if (!timestamp) {
    return new Date().toISOString();
  }
  
  if (typeof timestamp === 'number') {
    // Timestamp Unix (secondes)
    return new Date(timestamp * 1000).toISOString();
  }
  
  // Déjà une string ISO
  return timestamp;
}

// Fonction utilitaire pour tronquer le txHash (pour l'affichage)
function formatTxHash(txHash: string): string {
  if (!isValidTxHash(txHash)) return txHash;
  return `${txHash.slice(0, 10)}...${txHash.slice(-8)}`;
}

export async function generateCertificate(data: CertificateData): Promise<Buffer> {
  const { fileName, hash, txHash, contract, author, timestamp } = data;
  
  // Validation et normalisation des données
  const normalizedHash = normalizeHash(hash);
  const validTxHash = txHash && isValidTxHash(txHash) ? txHash.toLowerCase() : undefined;
  const formattedTimestamp = formatTimestamp(timestamp);
  const verifyUrl = getVerifyUrl(normalizedHash);
  
  // Log pour auto-contrôle
  console.log(`[PDF] URL de vérification générée: ${verifyUrl}`);
  console.log(`[PDF] Hash normalisé: ${normalizedHash}`);
  
  // Génération du QR code
  const qrCodeBuffer = await QRCode.toBuffer(verifyUrl, {
    width: 150,
    margin: 2,
    color: { dark: '#000000', light: '#FFFFFF' },
  });
  
  // Création du PDF A4 (595 x 842) avec configuration robuste
  const doc = new PDFDocument({
    size: 'A4',
    margin: 50,
    autoFirstPage: true,
    info: {
      Title: 'Certificat VeritasChain',
      Author: 'VeritasChain',
      Subject: "Certificat d'Ancrage Blockchain",
      Creator: 'VeritasChain v1.0',
      Producer: 'VeritasChain PDF Generator',
    },
  });
  
  // Buffer pour stocker le PDF
  const chunks: Buffer[] = [];
  doc.on('data', (chunk) => chunks.push(chunk));
  
  const pdfPromise = new Promise<Buffer>((resolve, reject) => {
    doc.on('end', () => resolve(Buffer.concat(chunks)));
    doc.on('error', reject);
  });
  
  // === MISE EN PAGE STABLE ===
  
  // Bandeau haut
  const headerHeight = 80;
  doc.rect(0, 0, 595, headerHeight).fill(COLORS.lightGray);
  
  // Logo optionnel
  try {
    const logoPath = path.join(process.cwd(), 'public', 'logo.png');
    if (fs.existsSync(logoPath)) {
      doc.image(logoPath, 50, 15, { width: 48, height: 48 });
    }
  } catch {
    // Ignorer si le logo n'existe pas
  }
  
  // Titre principal
  doc
    .fill(COLORS.dark)
    .fontSize(22)
    .text('Certificat d\'Ancrage Blockchain — VeritasChain', 50, 20, { align: 'center' });
  
  // Réseau
  doc.fontSize(12).fill(COLORS.gray).text('Network: Sepolia', 50, 50, { align: 'center' });
  
  // Encadré principal avec bordure fine
  const infoY = 120;
  const infoWidth = 495;
  const infoHeight = 300;
  
  doc.lineWidth(1).rect(50, infoY, infoWidth, infoHeight).stroke(COLORS.border);
  
  doc.fontSize(16).fill(COLORS.dark).text('Informations du Document', 70, infoY + 18);
  doc.moveTo(70, infoY + 42).lineTo(530, infoY + 42).stroke(COLORS.border);
  
  // Informations avec espacement cohérent
  const lineHeight = 28;
  const startY = infoY + 60;
  
  const label = (t: string, x: number, y: number) =>
    doc.fontSize(12).fill(COLORS.dark).text(t, x, y);
  
  const value = (t: string, x: number, y: number, width = 350) =>
    doc.fontSize(11).fill(COLORS.gray).text(t, x, y, { width });
  
  // Contenu obligatoire
  label('Fichier :', 70, startY);
  value(fileName, 150, startY);
  
  label('Hash (SHA-256) :', 70, startY + lineHeight);
  value(normalizedHash, 150, startY + lineHeight);
  
  // Transaction (si fournie)
  if (validTxHash) {
    label('Transaction :', 70, startY + lineHeight * 2);
    value(validTxHash, 150, startY + lineHeight * 2);
  }
  
  // Timestamp (ISO8601)
  label('Timestamp :', 70, startY + lineHeight * (validTxHash ? 3 : 2));
  value(formattedTimestamp, 150, startY + lineHeight * (validTxHash ? 3 : 2));
  
  // Informations supplémentaires (si fournies)
  let currentLine = validTxHash ? 4 : 3;
  
  if (contract) {
    label('Contrat :', 70, startY + lineHeight * currentLine);
    doc.fill(COLORS.primary).fontSize(10).text(contract, 150, startY + lineHeight * currentLine, { width: 350 });
    currentLine++;
  }
  
  if (author) {
    label('Auteur :', 70, startY + lineHeight * currentLine);
    value(author, 150, startY + lineHeight * currentLine);
    currentLine++;
  }
  
  // QR Code avec cadre
  const qrX = 400;
  const qrY = infoY + 76;
  
  doc.fontSize(12).fill(COLORS.dark).text('Vérification publique :', qrX, qrY);
  doc.fontSize(10).fill(COLORS.gray).text('Page de vérification VeritasChain', qrX, qrY + 16);
  
  // Cadre autour du QR code
  doc.rect(qrX, qrY + 36, 120, 120).stroke(COLORS.border);
  doc.image(qrCodeBuffer, qrX, qrY + 36, { width: 120, height: 120 });
  
  // URL de vérification en clair sous le QR
  doc.fontSize(9).fill(COLORS.gray).text(`Verify: ${verifyUrl}`, qrX, qrY + 160, { width: 120 });
  
  // Section "How to verify" (3 étapes)
  const verifyY = infoY + infoHeight + 20;
  const verifyHeight = 80;
  
  doc.fontSize(14).fill(COLORS.dark).text('Comment vérifier ce certificat :', 50, verifyY);
  
  const stepY = verifyY + 25;
  const stepHeight = 15;
  
  doc.fontSize(10).fill(COLORS.gray)
    .text('1. Ouvrez l\'URL ou scannez le QR code ci-dessus', 50, stepY)
    .text('2. Téléversez le même fichier ou collez le hash', 50, stepY + stepHeight)
    .text('3. Vérifiez que le statut est "Document ancré"', 50, stepY + stepHeight * 2);
  
  // Note explicative
  const noteY = verifyY + verifyHeight + 10;
  doc
    .fontSize(10)
    .fill(COLORS.gray)
    .text(
      'Ce certificat atteste que le hash du fichier ci-dessus a été ancré sur la blockchain Ethereum (réseau de test Sepolia). ' +
        'Toute personne peut vérifier la correspondance en recalculant localement le SHA-256 du fichier original.',
      50,
      noteY,
      { width: 495, align: 'justify' }
    );
  
  // Pied de page
  const pageHeight = doc.page.height;
  doc
    .fontSize(9)
    .fill(COLORS.gray)
    .text('Vérification publique : Page VeritasChain (QR code).', 50, pageHeight - 40, { align: 'left' });
  
  // Finaliser le PDF
  doc.end();
  
  return pdfPromise;
}

export function generateFileName(fileName: string): string {
  const tsNow = Date.now();
  const fileNameSafe = fileName.replace(/\s+/g, '_').replace(/[^a-zA-Z0-9._-]/g, '_');
  return `certificate_${tsNow}_${fileNameSafe}_pro.pdf`;
}