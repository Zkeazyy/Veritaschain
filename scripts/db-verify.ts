import 'dotenv/config';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const checks = [
    { name: 'Document', fn: () => prisma.document.count() },
    { name: 'Certificate', fn: () => prisma.certificate.count() },
    { name: 'User', fn: () => prisma.user.count() },
  ];

  console.log('\n==============================');
  console.log('🔎 VÉRIFICATION DES TABLES PRISMA');
  console.log('==============================\n');
  
  const dbType = process.env.DATABASE_URL?.includes('postgresql') 
    ? '✅ PostgreSQL (Supabase)' 
    : process.env.DATABASE_URL?.includes('sqlite')
    ? '⚠️  SQLite (Local)'
    : '❓ Inconnue';
  
  console.log(`📊 Base de données: ${dbType}`);
  console.log(`🔗 Host: ${process.env.DATABASE_URL?.split('@')[1]?.split('/')[0] || 'N/A'}`);
  console.log('');

  let allOk = true;
  for (const c of checks) {
    try {
      const n = await c.fn();
      console.log(`  • ${c.name.padEnd(15)} : ✅ OK (${n} ligne${n !== 1 ? 's' : ''})`);
    } catch (error) {
      allOk = false;
      const errorMsg = error instanceof Error ? error.message : 'Inconnue';
      if (errorMsg.includes('does not exist') || errorMsg.includes("doesn't exist")) {
        console.log(`  • ${c.name.padEnd(15)} : ❌ Table absente (migration nécessaire)`);
      } else {
        console.log(`  • ${c.name.padEnd(15)} : ❌ Erreur: ${errorMsg.substring(0, 50)}...`);
      }
    }
  }

  console.log('\n==============================');
  if (allOk) {
    console.log('✅ TOUTES LES TABLES SONT OK');
  } else {
    console.log('⚠️  CERTAINES TABLES SONT ABSENTES');
    console.log('💡 Pour créer les tables manquantes:');
    console.log('   npm run migrate:dev -- --name init');
  }
  console.log('==============================\n');
}

main()
  .catch((error) => {
    console.error('\n❌ ERREUR CRITIQUE:', error.message);
    console.error('\n💡 Vérifiez que:');
    console.error('   1. DATABASE_URL est définie dans .env.local');
    console.error('   2. La base de données est accessible');
    console.error('   3. Les migrations ont été appliquées\n');
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
