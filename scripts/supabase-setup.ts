#!/usr/bin/env tsx

/**
 * Script de configuration Supabase pour VeritasChain
 * Usage: npm run supabase:setup
 */

import { execSync } from 'child_process';
import * as fs from 'fs';
import * as path from 'path';

console.log('🚀 VERITASCHAIN - CONFIGURATION SUPABASE');
console.log('==========================================\n');

// Vérifier si .env.production existe
const envProdPath = path.join(process.cwd(), '.env.production');
const envLocalPath = path.join(process.cwd(), '.env.local');

if (!fs.existsSync(envProdPath)) {
  console.log('❌ Fichier .env.production non trouvé');
  console.log('📝 Créez le fichier .env.production avec vos variables Supabase');
  console.log('📖 Consultez SUPABASE_SETUP_GUIDE.md pour les instructions\n');
  process.exit(1);
}

// Lire les variables d'environnement
const envContent = fs.readFileSync(envProdPath, 'utf8');
const envLines = envContent.split('\n');

let databaseUrl = '';
let directUrl = '';

for (const line of envLines) {
  if (line.startsWith('DATABASE_URL=')) {
    databaseUrl = line.split('=')[1]?.replace(/"/g, '') || '';
  }
  if (line.startsWith('DIRECT_URL=')) {
    directUrl = line.split('=')[1]?.replace(/"/g, '') || '';
  }
}

if (!databaseUrl || !directUrl) {
  console.log('❌ DATABASE_URL ou DIRECT_URL manquants dans .env.production');
  console.log('📝 Vérifiez votre configuration\n');
  process.exit(1);
}

console.log('✅ Configuration trouvée');
console.log(`📊 Database: ${databaseUrl.split('@')[1]?.split(':')[0] || 'Inconnu'}\n`);

try {
  console.log('🔄 Génération du client Prisma...');
  execSync('npm run db:generate', { stdio: 'inherit' });
  console.log('✅ Client Prisma généré\n');

  console.log('🔄 Application des migrations à Supabase...');
  execSync(`DATABASE_URL="${databaseUrl}" npm run migrate:deploy`, { stdio: 'inherit' });
  console.log('✅ Migrations appliquées\n');

  console.log('🔄 Vérification des tables...');
  execSync(`DATABASE_URL="${databaseUrl}" npm run db:verify`, { stdio: 'inherit' });
  console.log('✅ Tables vérifiées\n');

  console.log('🎉 SUPABASE CONFIGURÉ AVEC SUCCÈS !');
  console.log('=====================================');
  console.log('📋 Prochaines étapes :');
  console.log('1. Configurez Vercel avec vos variables');
  console.log('2. Lancez: npm run vercel:wire');
  console.log('3. Testez votre application déployée\n');

} catch (error) {
  console.error('❌ Erreur lors de la configuration:', error);
  console.log('\n💡 Solutions possibles :');
  console.log('- Vérifiez que votre URL Supabase est correcte');
  console.log('- Vérifiez que votre projet Supabase est actif');
  console.log('- Vérifiez que votre mot de passe est correct');
  console.log('- Consultez SUPABASE_SETUP_GUIDE.md\n');
  process.exit(1);
}
