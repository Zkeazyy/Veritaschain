import { execSync } from 'node:child_process';
import 'dotenv/config';

function sh(cmd: string) {
  console.log('→', cmd);
  try {
    execSync(cmd, { stdio: 'inherit' });
  } catch (error) {
    console.error('❌ Erreur lors de l\'exécution de:', cmd);
    throw error;
  }
}

(async () => {
  console.log('');
  console.log('==============================');
  console.log('🚀 VERITASCHAIN - SUPABASE WIRE');
  console.log('==============================');
  console.log('');

  const dsn = process.env.DATABASE_URL || '';
  
  if (!dsn || !dsn.startsWith('postgresql://')) {
    console.error('❌ DATABASE_URL invalide ou manquante.');
    console.error('');
    console.error('📝 Action requise:');
    console.error('1. Créez un fichier .env.local à la racine du projet web/');
    console.error('2. Ajoutez votre DSN Supabase:');
    console.error('   DATABASE_URL="postgresql://postgres:PASSWORD@db.xxxxx.supabase.co:5432/postgres?sslmode=require"');
    console.error('');
    console.error('💡 Pour obtenir votre DSN:');
    console.error('   → Allez sur supabase.com');
    console.error('   → Sélectionnez votre projet');
    console.error('   → Settings → Database → Connection String');
    console.error('');
    process.exit(1);
  }

  if (!dsn.includes('sslmode=')) {
    console.warn('⚠️  Conseillé: ajouter ?sslmode=require à votre DATABASE_URL');
    console.warn('');
  }

  console.log('✅ Connexion Supabase détectée');
  console.log('📊 DSN:', dsn.split('@')[1]?.split('/')[0] || 'masqué');
  console.log('');

  console.log('📦 Génération du client Prisma...');
  sh('npm run db:generate');
  console.log('');

  console.log('🚀 Déploiement des migrations...');
  try {
    sh('npm run migrate:deploy');
  } catch {
    console.log('');
    console.log('⚠️  Aucune migration à déployer ou première initialisation');
    console.log('💡 Pour créer votre première migration:');
    console.log('   npm run migrate:dev -- --name init');
    console.log('');
  }

  console.log('🧪 Vérification des tables...');
  console.log('');
  sh('npm run db:verify');

  console.log('');
  console.log('==============================');
  console.log('✅ SWITCH VERS SUPABASE TERMINÉ');
  console.log('==============================');
  console.log('');
  console.log('📋 Prochaines actions:');
  console.log('');
  console.log('1️⃣  Test local:');
  console.log('   npm run dev');
  console.log('   → Ouvrez http://localhost:3000');
  console.log('');
  console.log('2️⃣  Configuration Vercel:');
  console.log('   → Project Settings → Environment Variables');
  console.log('   → Ajoutez: DATABASE_URL = (le même DSN Supabase)');
  console.log('   → Ajoutez: NEXT_PUBLIC_RPC_URL, NEXT_PUBLIC_CONTRACT_ADDRESS, etc.');
  console.log('');
  console.log('3️⃣  Redéploiement:');
  console.log('   vercel --prod');
  console.log('');
  console.log('4️⃣  Vérification:');
  console.log('   → Testez /anchor (upload → anchor)');
  console.log('   → Testez /verify');
  console.log('   → Vérifiez les données dans Supabase Dashboard');
  console.log('');
  console.log('💡 Pour ouvrir Prisma Studio:');
  console.log('   npm run db:studio');
  console.log('');
  console.log('==============================');
  console.log('');
})();
