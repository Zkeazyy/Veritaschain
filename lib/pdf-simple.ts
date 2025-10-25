import PDFDocument from 'pdfkit';
import QRCode from 'qrcode';
import { config } from './config';

// Types
export interface CertificateData {
  fileName: string;
  hash: string;
  txHash?: string;
  contract?: string;
  author?: string;
  timestamp?: number | string;
}

// Fonction utilitaire pour générer l'URL de vérification
export function getVerifyUrl(hashHex: string): string {
  const normalizedHash = normalizeHash(hashHex);
  return `${config.siteBaseUrl}/verify?hash=${encodeURIComponent(normalizedHash)}`;
}

// Fonction utilitaire pour normaliser le hash
export function normalizeHash(hashHex: string): string {
  return hashHex.startsWith('0x') ? hashHex : `0x${hashHex}`;
}

// Fonction utilitaire pour générer le nom de fichier
export function generateFileName(data: CertificateData): string {
  const timestamp = new Date().toISOString().split('T')[0];
  const hashShort = data.hash.slice(2, 10); // Premiers caractères du hash
  return `veritaschain-certificate-${timestamp}-${hashShort}.pdf`;
}

/**
 * Génère un certificat PDF pour un document ancré
 */
export async function generateCertificate(data: CertificateData): Promise<Buffer> {
  console.log('[PDF] Génération du certificat avec les données:', data);

  // Validation des données requises
  if (!data.fileName || !data.hash) {
    throw new Error('fileName et hash sont requis pour générer le certificat');
  }

  // Génération de l'URL de vérification
  const verifyUrl = getVerifyUrl(data.hash);
  console.log('[PDF] URL de vérification générée:', verifyUrl);

  // Normalisation du hash
  const normalizedHash = normalizeHash(data.hash);
  console.log('[PDF] Hash normalisé:', normalizedHash);

  // Génération du QR code
  const qrCodeBuffer = await QRCode.toBuffer(verifyUrl, {
    width: 150,
    margin: 2,
    color: { dark: '#000000', light: '#FFFFFF' },
  });

  // Création du PDF avec configuration simplifiée
  const doc = new PDFDocument({
    size: 'A4',
    margin: 50,
  });

  // Buffer pour stocker le PDF
  const chunks: Buffer[] = [];
  doc.on('data', (chunk) => chunks.push(chunk));

  return new Promise((resolve, reject) => {
    doc.on('end', () => {
      const pdfBuffer = Buffer.concat(chunks);
      console.log('[PDF] Certificat généré avec succès, taille:', pdfBuffer.length, 'bytes');
      resolve(pdfBuffer);
    });

    doc.on('error', (error) => {
      console.error('[PDF] Erreur lors de la génération:', error);
      reject(error);
    });

    try {
      // En-tête du certificat
      doc.fontSize(24)
         .fillColor('#0A5FFF')
         .text('CERTIFICAT VERITASCHAIN', 50, 50, { align: 'center' });

      doc.fontSize(16)
         .fillColor('#4A5568')
         .text('Certificat d\'Ancrage Blockchain', 50, 90, { align: 'center' });

      // Ligne de séparation
      doc.strokeColor('#e2e8f0')
         .lineWidth(2)
         .moveTo(50, 130)
         .lineTo(545, 130)
         .stroke();

      // Informations du document
      doc.fontSize(14)
         .fillColor('#0D1B2A')
         .text('Informations du Document', 50, 160);

      doc.fontSize(12)
         .fillColor('#4A5568')
         .text(`Nom du fichier: ${data.fileName}`, 50, 190)
         .text(`Hash SHA-256: ${normalizedHash}`, 50, 210);

      // Informations blockchain
      if (data.txHash || data.author || data.timestamp) {
        doc.fontSize(14)
           .fillColor('#0D1B2A')
           .text('Informations Blockchain', 50, 250);

        doc.fontSize(12)
           .fillColor('#4A5568');

        let yPos = 280;
        if (data.txHash) {
          doc.text(`Transaction: ${data.txHash}`, 50, yPos);
          yPos += 20;
        }
        if (data.author) {
          doc.text(`Auteur: ${data.author}`, 50, yPos);
          yPos += 20;
        }
        if (data.timestamp) {
          const date = new Date(typeof data.timestamp === 'string' ? data.timestamp : data.timestamp * 1000);
          doc.text(`Date d'ancrage: ${date.toLocaleString('fr-FR')}`, 50, yPos);
          yPos += 20;
        }
        if (data.contract) {
          doc.text(`Contrat: ${data.contract}`, 50, yPos);
        }
      }

      // QR Code
      doc.text('Vérification:', 50, 400);
      doc.image(qrCodeBuffer, 50, 420, { width: 150, height: 150 });
      doc.fontSize(10)
         .fillColor('#4A5568')
         .text('Scannez ce QR code pour vérifier ce certificat', 50, 580);

      // Pied de page
      doc.fontSize(10)
         .fillColor('#4A5568')
         .text('Généré par VeritasChain - Proof of Document Anchoring', 50, 750, { align: 'center' })
         .text(`URL de vérification: ${verifyUrl}`, 50, 770, { align: 'center' });

      // Finalisation du PDF
      doc.end();

    } catch (error) {
      console.error('[PDF] Erreur lors de la création du contenu:', error);
      reject(error);
    }
  });
}
