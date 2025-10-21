/**
 * Utilitaires de hachage centralisés pour VeritasChain
 * Garantit que tous les calculs SHA-256 passent par cette fonction
 */

import { createHash } from 'crypto';

/**
 * Calcule le hash SHA-256 côté serveur (Node.js)
 * @param buffer - Buffer ou ArrayBuffer à hasher
 * @returns string - Hash au format "0x" + 64 caractères hex minuscules
 */
export function sha256HexServer(buffer: Buffer | ArrayBuffer): string {
  const nodeBuffer = buffer instanceof ArrayBuffer ? Buffer.from(buffer) : buffer;
  const hash = createHash('sha256').update(nodeBuffer).digest('hex');
  return `0x${hash}`;
}

/**
 * Calcule le hash SHA-256 côté client (Browser)
 * @param file - File à hasher
 * @returns Promise<string> - Hash au format "0x" + 64 caractères hex minuscules
 */
export async function sha256HexBrowser(file: File): Promise<string> {
  // Validation du type de fichier
  const ALLOWED_FILE_TYPES = [
    'application/pdf',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'image/png'
  ] as const;

  const isValidMimeType = ALLOWED_FILE_TYPES.includes(file.type as any);
  const isValidExtension = ['.pdf', '.docx', '.png'].some(ext => 
    file.name.toLowerCase().endsWith(ext)
  );
  
  if (!isValidMimeType && !isValidExtension) {
    throw new Error(
      `Type de fichier non autorisé. Formats acceptés : PDF, DOCX, PNG. ` +
      `Type détecté : ${file.type || 'inconnu'}, nom : ${file.name}`
    );
  }

  try {
    // Convertir le fichier en ArrayBuffer
    const arrayBuffer = await file.arrayBuffer();
    
    // Calculer le hash SHA-256 avec WebCrypto
    const hashBuffer = await crypto.subtle.digest('SHA-256', arrayBuffer);
    
    // Convertir en hex minuscules et ajouter le préfixe 0x
    const bytes = new Uint8Array(hashBuffer);
    const hexString = Array.from(bytes)
      .map(byte => byte.toString(16).padStart(2, '0'))
      .join('');
    
    return `0x${hexString}`;
    
  } catch (error) {
    throw new Error(`Erreur lors du calcul du hash : ${error instanceof Error ? error.message : 'Erreur inconnue'}`);
  }
}

/**
 * Fonction de compatibilité pour l'ancien code
 * @deprecated Utilisez sha256HexBrowser côté client
 */
export const sha256Hex = sha256HexBrowser;
