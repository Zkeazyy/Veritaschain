import 'dotenv/config';
import fetch from 'node-fetch';
import { PrismaClient } from '@prisma/client';

function mask(v?: string) {
  if (!v) return 'undefined';
  if (v.startsWith('postgresql://')) return 'postgresql://****' + v.slice(-20);
  if (v.startsWith('http')) return v.replace(/(v3\/)[^/]+/, '$1********');
  if (v.startsWith('0x')) return v.slice(0, 8) + '…' + v.slice(-6);
  return '****';
}

const DB = process.env.DATABASE_URL;
const RPC = process.env.RPC_URL || process.env.NEXT_PUBLIC_RPC_URL;
const REG = process.env.NEXT_PUBLIC_CONTRACT_REGISTRY || process.env.NEXT_PUBLIC_CONTRACT_ADDRESS || process.env.CONTRACT_ADDRESS;
const CHN = process.env.CHAIN_ID || process.env.NEXT_PUBLIC_CHAIN_ID || "11155111";

console.log('\n==============================');
console.log('🔐 ZERO-TOUCH VERIFY');
console.log('==============================\n');

console.log('🔍 ENV détecté (masqué) :');
console.log('  DATABASE_URL =', mask(DB));
console.log('  RPC_URL      =', mask(RPC));
console.log('  REGISTRY     =', mask(REG));
console.log('  CHAIN_ID     =', CHN);
console.log('');

if (!DB) {
  console.error('❌ DATABASE_URL manquante dans .env.local');
  process.exit(1);
}
if (!RPC) {
  console.error('❌ RPC_URL ou NEXT_PUBLIC_RPC_URL manquante');
  process.exit(1);
}
if (!REG) {
  console.error('❌ Adresse de contrat (REGISTRY/ADDRESS) manquante');
  process.exit(1);
}

async function testRpc() {
  console.log('🌐 Test RPC → eth_chainId');
  const r = await fetch(RPC!, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ jsonrpc: '2.0', id: 1, method: 'eth_chainId', params: [] })
  });
  const j: any = await r.json().catch(() => ({}));
  if (!r.ok || !j?.result) throw new Error('RPC invalide: ' + JSON.stringify(j));
  const chainId = parseInt(j.result, 16);
  console.log('  ✅ chainId RPC =', chainId, chainId === 11155111 ? '(Sepolia ✓)' : '(⚠️ Pas Sepolia)');
}

async function testCodeAt(addr: string) {
  console.log('\n🔎 Test getCode @', addr);
  const r = await fetch(RPC!, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ jsonrpc: '2.0', id: 2, method: 'eth_getCode', params: [addr, 'latest'] })
  });
  const j: any = await r.json().catch(() => ({}));
  if (!r.ok || !j?.result) throw new Error('eth_getCode échec: ' + JSON.stringify(j));
  if (j.result === '0x') throw new Error('Aucun bytecode à cette adresse (contrat non déployé ?) ');
  console.log('  ✅ Bytecode présent (longueur:', j.result.length, ')');
  console.log('  ✅ Contrat déployé et accessible');
}

async function testDb() {
  console.log('\n🗄️  Test DB (Prisma connect)');
  const prisma = new PrismaClient();
  try {
    await prisma.$queryRaw`SELECT 1`;
    console.log('  ✅ Connexion DB OK');
    
    // Compter les tables
    const docCount = await prisma.document.count().catch(() => -1);
    const certCount = await prisma.certificate.count().catch(() => -1);
    const userCount = await prisma.user.count().catch(() => -1);
    
    if (docCount === -1 || certCount === -1 || userCount === -1) {
      console.log('  ⚠️  Certaines tables manquantes (migration nécessaire)');
    } else {
      console.log('  ✅ Tables OK - Documents:', docCount, '| Certificates:', certCount, '| Users:', userCount);
    }
  } finally {
    await prisma.$disconnect();
  }
}

(async () => {
  try {
    await testDb();
    await testRpc();
    await testCodeAt(REG!);
    
    console.log('\n==============================');
    console.log('✅ ZERO VERIFY OK');
    console.log('==============================');
    console.log('');
    console.log('📋 Résumé:');
    console.log('  ✅ Base de données Supabase accessible');
    console.log('  ✅ RPC Sepolia fonctionnel');
    console.log('  ✅ Contrat déployé et accessible');
    console.log('');
    console.log('🚀 Prochaine étape:');
    console.log('   npm run zero:go');
    console.log('   (Applique migrations + ouvre Prisma Studio)');
    console.log('');
    console.log('==============================\n');
  } catch (e: any) {
    console.error('\n==============================');
    console.error('💥 ZERO VERIFY ÉCHOUÉ');
    console.error('==============================');
    console.error('');
    console.error('Erreur:', e?.message || e);
    console.error('');
    console.error('💡 Vérifications à faire:');
    console.error('  1. DATABASE_URL est correct dans .env.local');
    console.error('  2. RPC_URL Infura/Alchemy est valide');
    console.error('  3. Le contrat est bien déployé sur Sepolia');
    console.error('  4. Vous avez accès à Internet');
    console.error('');
    console.error('==============================\n');
    process.exit(1);
  }
})();
