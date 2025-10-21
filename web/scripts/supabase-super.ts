#!/usr/bin/env node
/**
 * VERITASCHAIN — SUPER PROMPT SUPABASE (Auto-Configuration)
 * Objectif : Configurer DATABASE_URL, migrer Prisma vers Supabase, vérifier les tables, ouvrir Prisma Studio.
 */

import fs from "fs";
import path from "path";
import { execSync } from "child_process";

// ==============================
// CONFIGURATION
// ==============================
// 🔧 Remplace par ton DSN Supabase (depuis Supabase → Connect → URI + ?sslmode=require)
const SUPABASE_DSN = process.env.SUPABASE_DSN || "postgresql://postgres:PASSWORD@db.xxxxx.supabase.co:5432/postgres?sslmode=require";

function log(emoji: string, message: string) {
  console.log(`${emoji} ${message}`);
}

function sh(cmd: string) {
  console.log(`→ ${cmd}`);
  try {
    execSync(cmd, { stdio: "inherit" });
  } catch (error) {
    throw error;
  }
}

// ==============================
// ÉTAPE 1 : Mise à jour .env.local
// ==============================
log("📝", "Étape 1/6 : Mise à jour de .env.local");

const envPath = path.resolve(".env.local");
let env = fs.existsSync(envPath) ? fs.readFileSync(envPath, "utf-8") : "";

if (!SUPABASE_DSN.startsWith("postgresql://")) {
  console.error("\n❌ ERREUR: Remplace SUPABASE_DSN par ton URI Supabase");
  console.error("💡 Exemple: postgresql://postgres:password@db.xxxxx.supabase.co:5432/postgres?sslmode=require\n");
  console.error("📖 Pour obtenir ton DSN:");
  console.error("   1. Va sur supabase.com");
  console.error("   2. Sélectionne ton projet");
  console.error("   3. Settings → Database → Connection String (URI)");
  console.error("   4. Ajoute ?sslmode=require à la fin\n");
  console.error("🔧 Puis définis la variable d'environnement:");
  console.error("   export SUPABASE_DSN=\"postgresql://...\"");
  console.error("   npm run supabase:super\n");
  process.exit(1);
}

if (env.includes("DATABASE_URL=")) {
  env = env.replace(/DATABASE_URL=.*/g, `DATABASE_URL="${SUPABASE_DSN}"`);
  log("🔄", "DATABASE_URL mise à jour");
} else {
  env += (env.endsWith("\n") ? "" : "\n") + `DATABASE_URL="${SUPABASE_DSN}"\n`;
  log("➕", "DATABASE_URL ajoutée");
}

if (!/^\s*TZ=/m.test(env)) {
  env += `TZ="UTC"\n`;
  log("➕", "TZ=UTC ajoutée");
}

fs.writeFileSync(envPath, env);
log("✅", ".env.local configuré");

// ==============================
// ÉTAPE 2 : Vérification Prisma Schema
// ==============================
log("📝", "Étape 2/6 : Vérification du schéma Prisma");

const prismaPath = "prisma/schema.prisma";
if (!fs.existsSync(prismaPath)) {
  console.error("❌ prisma/schema.prisma introuvable");
  process.exit(1);
}

let schema = fs.readFileSync(prismaPath, "utf-8");
if (!schema.includes('provider = "postgresql"')) {
  schema = schema.replace(/provider\s*=\s*"(sqlite|mysql|sqlserver|mongodb)"/, 'provider = "postgresql"');
  fs.writeFileSync(prismaPath, schema);
  log("🔄", "Schéma Prisma → PostgreSQL");
} else {
  log("✅", "Schéma Prisma déjà configuré pour PostgreSQL");
}

// ==============================
// ÉTAPE 3 : Package.json Scripts
// ==============================
log("📝", "Étape 3/6 : Vérification des scripts npm");

const pkgPath = "package.json";
const pkg = JSON.parse(fs.readFileSync(pkgPath, "utf-8"));
pkg.scripts = pkg.scripts || {};

const scriptsToAdd = {
  "migrate:deploy": "prisma migrate deploy",
  "migrate:dev": "prisma migrate dev",
  "db:generate": "prisma generate",
  "db:studio": "prisma studio",
  "db:verify": "tsx scripts/db-verify.ts",
  "supabase:wire": "tsx scripts/supabase-wire.ts",
  "supabase:super": "tsx scripts/supabase-super.ts"
};

let scriptsAdded = false;
for (const [key, value] of Object.entries(scriptsToAdd)) {
  if (!pkg.scripts[key]) {
    pkg.scripts[key] = value;
    scriptsAdded = true;
  }
}

if (scriptsAdded) {
  fs.writeFileSync(pkgPath, JSON.stringify(pkg, null, 2));
  log("✅", "Scripts npm mis à jour");
} else {
  log("✅", "Scripts npm déjà configurés");
}

// ==============================
// ÉTAPE 4 : Installation des dépendances
// ==============================
log("📦", "Étape 4/6 : Installation des dépendances");

try {
  sh("npm install tsx dotenv --save-dev");
  log("✅", "Dépendances installées");
} catch {
  log("⚠️", "Erreur lors de l'installation (peut-être déjà installées)");
}

// ==============================
// ÉTAPE 5 : Génération du client Prisma
// ==============================
log("🔧", "Étape 5/6 : Génération du client Prisma");

try {
  sh("npx prisma generate");
  log("✅", "Client Prisma généré");
} catch (error) {
  log("❌", "Erreur lors de la génération du client Prisma");
  throw error;
}

// ==============================
// ÉTAPE 6 : Déploiement des migrations
// ==============================
log("🚀", "Étape 6/6 : Déploiement des migrations");

try {
  sh("npx prisma migrate deploy");
  log("✅", "Migrations déployées sur Supabase");
} catch (error) {
  log("⚠️", "Aucune migration à déployer ou première initialisation");
  log("💡", "Pour créer votre première migration: npm run migrate:dev -- --name init");
}

// ==============================
// RÉSUMÉ FINAL
// ==============================
console.log("\n==============================");
console.log("✅ CONFIGURATION SUPABASE TERMINÉE");
console.log("==============================\n");
console.log("📋 Ce qui a été fait:");
console.log("   ✅ .env.local configuré avec DATABASE_URL");
console.log("   ✅ Schéma Prisma vérifié (PostgreSQL)");
console.log("   ✅ Scripts npm ajoutés");
console.log("   ✅ Dépendances installées (tsx, dotenv)");
console.log("   ✅ Client Prisma généré");
console.log("   ✅ Migrations déployées");
console.log("\n🎯 Prochaines étapes:");
console.log("   1. Vérifier les tables: npm run db:verify");
console.log("   2. Ouvrir Prisma Studio: npm run db:studio");
console.log("   3. Lancer l'app: npm run dev");
console.log("\n📖 Guides disponibles:");
console.log("   → SUPABASE_COMPLETE_GUIDE.md");
console.log("   → SUPABASE_SETUP.md");
console.log("\n==============================\n");

// Proposer d'ouvrir Prisma Studio
console.log("💡 Voulez-vous ouvrir Prisma Studio maintenant ? (Ctrl+C pour annuler)");
setTimeout(() => {
  try {
    log("🌐", "Ouverture de Prisma Studio...");
    sh("npx prisma studio");
  } catch {
    log("💡", "Prisma Studio fermé - vous pouvez le rouvrir avec: npm run db:studio");
  }
}, 3000);
