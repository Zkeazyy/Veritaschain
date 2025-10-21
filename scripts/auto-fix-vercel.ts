import fs from "fs";
import path from "path";
import { execSync as run } from "child_process";

console.log("==============================");
console.log("🔍 AUTO FIX VERCEL + PRISMA + SUPABASE");
console.log("==============================\n");

console.log("🔍 Détection de la structure du projet...\n");

const hasWeb = fs.existsSync("../web/package.json");
const hasPrisma = fs.existsSync("prisma/schema.prisma");
const rootPkgPath = "../package.json";
const rootPkg = JSON.parse(fs.readFileSync(rootPkgPath, "utf-8"));
const webPkgPath = "package.json";
const webPkg = JSON.parse(fs.readFileSync(webPkgPath, "utf-8"));

console.log("📦 Web dir :", hasWeb ? "✅ trouvé (/web)" : "❌ absent");
console.log("📜 Prisma schema :", hasPrisma ? "✅ trouvé (/web/prisma/schema.prisma)" : "❌ manquant");
console.log("");

// --- Step 1. Corriger Prisma schema (ajout directUrl)
if (hasPrisma) {
  const schemaPath = "prisma/schema.prisma";
  let schema = fs.readFileSync(schemaPath, "utf-8");
  if (!schema.includes("directUrl")) {
    schema = schema.replace(
      /url\s*=\s*env\("DATABASE_URL"\)/,
      'url       = env("DATABASE_URL")\n  directUrl = env("DIRECT_URL")'
    );
    fs.writeFileSync(schemaPath, schema);
    console.log("✅ Ajout de directUrl dans prisma/schema.prisma");
  } else {
    console.log("🔹 directUrl déjà présent dans prisma/schema.prisma");
  }
} else {
  console.log("⏭️  Pas de schema Prisma à corriger");
}

// --- Step 2. Corriger scripts dans web/package.json
console.log("");
console.log("📝 Mise à jour des scripts web/package.json...");
webPkg.scripts = webPkg.scripts || {};
webPkg.scripts["postinstall"] = "prisma generate";
webPkg.scripts["vercel-build"] = "prisma generate && prisma migrate deploy && next build";
webPkg.scripts["prisma:generate"] = "prisma generate";
fs.writeFileSync(webPkgPath, JSON.stringify(webPkg, null, 2));
console.log("✅ Scripts corrigés dans web/package.json (postinstall + vercel-build)");

// --- Step 3. Corriger scripts dans package.json racine
console.log("");
console.log("📝 Mise à jour du package.json racine...");
rootPkg.scripts = rootPkg.scripts || {};
rootPkg.scripts["vercel-build"] = "cd web && npm ci && npm run vercel-build";
rootPkg.scripts["postinstall"] = "cd web && npm ci || true";
fs.writeFileSync(rootPkgPath, JSON.stringify(rootPkg, null, 2));
console.log("✅ Root package.json configuré pour build depuis /web");

// --- Step 4. Vérifier les fichiers Next.js
console.log("");
console.log("🔍 Vérification des pages Next.js...");
const appDir = "app";
const pagesDir = "pages";
if (!fs.existsSync(appDir) && !fs.existsSync(pagesDir)) {
  console.warn("⚠️  Aucune page Next.js détectée : vérifiez web/app/ ou web/pages/");
} else {
  console.log("✅ Pages Next.js détectées");
}

// --- Step 5. Créer fichier de configuration de build Vercel (vercel.json)
console.log("");
console.log("📝 Création du vercel.json à la racine...");
const vercelConfig = {
  version: 2,
  buildCommand: "npm run vercel-build",
  outputDirectory: "web/.next",
  framework: "nextjs"
};
fs.writeFileSync("../vercel.json", JSON.stringify(vercelConfig, null, 2));
console.log("✅ Fichier vercel.json créé ou mis à jour");

// --- Step 6. Test du build local
console.log("");
console.log("🧪 Test du build local...");
try {
  console.log("→ npm run build");
  run("npm run build", { stdio: "inherit" });
  console.log("✅ Build local réussi !");
} catch (error) {
  console.log("⚠️  Build local échoué (normal si variables d'env manquantes)");
}

// --- Conseils finaux
console.log(`
==============================
💡 CONFIGURATION VERCEL RECOMMANDÉE
==============================

🔧 Dans Vercel → Settings → General :
   • Root Directory → ❌ VIDE (ne PAS mettre 'web')
   • Build Command  → npm run vercel-build
   • Output Directory → web/.next
   • Node.js Version → 20.x

🔐 Environment Variables à ajouter sur Vercel :
   • DATABASE_URL = DSN Supabase pooled (port 6543)
     Exemple: postgresql://postgres:pass@db.xxx.pooler.supabase.com:6543/postgres
   
   • DIRECT_URL = DSN Supabase direct (port 5432)
     Exemple: postgresql://postgres:pass@db.xxx.supabase.com:5432/postgres
   
   • NEXT_PUBLIC_RPC_URL = https://ethereum-sepolia-rpc.publicnode.com
     (ou votre URL Infura/Alchemy)
   
   • NEXT_PUBLIC_CONTRACT_ADDRESS = 0x7b7C41cf5bc986F406c7067De6e69f200c27D63f
   
   • NEXT_PUBLIC_CHAIN_ID = 11155111
   
   • NEXT_PUBLIC_SITE_URL = https://votre-projet.vercel.app
   
   • NEXT_PUBLIC_ETHERSCAN_BASE_URL = https://sepolia.etherscan.io

📋 Prochaines étapes :
   1. Commitez ces changements :
      git add .
      git commit -m "Fix Vercel deployment configuration"
      git push
   
   2. Sur Vercel :
      • Vérifiez Root Directory = VIDE
      • Ajoutez toutes les variables d'environnement
      • Redéployez (Deployments → Redeploy)
   
   3. Attendez 2-3 minutes
   
   4. Testez votre URL Vercel !

==============================
`);

console.log("🎊 AUTO FIX TERMINÉ !\n");
