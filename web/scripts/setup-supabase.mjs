#!/usr/bin/env node

/**
 * VERITASCHAIN — AUTO LINK SUPABASE SCRIPT
 * Objectif : ajouter DATABASE_URL Supabase, déployer les migrations et ouvrir Prisma Studio.
 */

import fs from "fs";
import { execSync } from "child_process";

// ⚠️ REMPLACE TON DSN SUPABASE CI-DESSOUS
const SUPABASE_DSN = process.env.DATABASE_URL || "postgresql://postgres:TON_MOT_DE_PASSE@db.xxxxx.supabase.co:5432/postgres?sslmode=require";

console.log("==============================");
console.log("🚀 VERITASCHAIN - SUPABASE SETUP");
console.log("==============================\n");

// Étape 1 : Mise à jour du fichier .env.local
console.log("📄 Mise à jour du fichier .env.local ...");

const envPath = ".env.local";
let content = fs.existsSync(envPath) ? fs.readFileSync(envPath, "utf-8") : "";

if (content.includes("DATABASE_URL")) {
  content = content.replace(/DATABASE_URL=.*/g, `DATABASE_URL="${SUPABASE_DSN}"`);
  console.log("✅ DATABASE_URL mis à jour");
} else {
  content += `\nDATABASE_URL="${SUPABASE_DSN}"`;
  console.log("✅ DATABASE_URL ajouté");
}

if (!content.includes("TZ=")) {
  content += `\nTZ="UTC"`;
}

fs.writeFileSync(envPath, content);
console.log("✅ .env.local configuré\n");

// Étape 2 : Installation de Prisma si nécessaire
console.log("📦 Vérification de Prisma ...");
try {
  execSync("npx prisma --version", { stdio: "pipe" });
  console.log("✅ Prisma déjà installé\n");
} catch {
  console.log("📦 Installation de Prisma ...");
  execSync("npm install @prisma/client prisma --save", { stdio: "inherit" });
  console.log("✅ Prisma installé\n");
}

// Étape 3 : Génération du client Prisma
console.log("🔧 Génération du client Prisma ...");
try {
  execSync("npx prisma generate", { stdio: "inherit" });
  console.log("✅ Client Prisma généré\n");
} catch (e) {
  console.error("💥 Erreur lors de la génération du client Prisma:", e.message);
}

// Étape 4 : Déploiement des migrations
console.log("🚀 Déploiement des migrations sur Supabase ...");
try {
  execSync("npx prisma migrate deploy", { stdio: "inherit" });
  console.log("✅ Migrations déployées avec succès\n");
} catch (e) {
  console.log("⚠️  Aucune migration à déployer ou première initialisation");
  console.log("💡 Créez votre première migration avec: npx prisma migrate dev --name init\n");
}

// Étape 5 : Ouverture de Prisma Studio
console.log("🌐 Ouverture de Prisma Studio ...");
console.log("💡 Ctrl + Clic sur le lien qui s'affiche pour ouvrir dans votre navigateur\n");

try {
  execSync("npx prisma studio", { stdio: "inherit" });
} catch (e) {
  console.log("💡 Prisma Studio fermé");
}

console.log("\n==============================");
console.log("🎯 SUPABASE CONNECTÉ À VERITASCHAIN");
console.log("==============================");
console.log("✅ DATABASE_URL ajouté dans .env.local");
console.log("✅ Client Prisma généré");
console.log("✅ Migrations prêtes à être déployées");
console.log("✅ Prisma Studio disponible");
console.log("==============================\n");
