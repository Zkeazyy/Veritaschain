# 🎉 VERITASCHAIN - CONFIGURATION SUPABASE AUTOMATISÉE

## ✅ **SUPER PROMPT - TOUT EN UN**

Un seul script pour tout configurer automatiquement !

---

## 🚀 **UTILISATION RAPIDE (3 ÉTAPES)**

### **1. Récupérer votre DSN Supabase**

🔗 [supabase.com](https://supabase.com) → Votre projet → Settings → Database → Connection String (URI)

**Format requis :**
```
postgresql://postgres.xxxxx:password@aws-0-eu-central-1.pooler.supabase.com:6543/postgres?sslmode=require
```

⚠️ **Important :** Ajoutez `?sslmode=require` à la fin !

### **2. Définir la variable d'environnement**

**Windows (PowerShell) :**
```powershell
$env:SUPABASE_DSN="postgresql://postgres.xxxxx:password@...?sslmode=require"
```

**macOS/Linux (Bash) :**
```bash
export SUPABASE_DSN="postgresql://postgres.xxxxx:password@...?sslmode=require"
```

### **3. Lancer le super script**

```bash
cd web
npm run supabase:super
```

**✨ C'est tout !** Le script fait tout automatiquement :
- ✅ Configure `.env.local`
- ✅ Vérifie le schéma Prisma
- ✅ Installe les dépendances
- ✅ Génère le client Prisma
- ✅ Déploie les migrations
- ✅ Ouvre Prisma Studio

---

## 📦 **CE QUI A ÉTÉ CRÉÉ**

### **Scripts automatisés**
- `scripts/supabase-super.ts` - **Configuration automatique complète**
- `scripts/supabase-wire.ts` - Configuration semi-automatique
- `scripts/db-verify.ts` - Vérification des tables

### **Commandes npm**
```bash
npm run supabase:super   # 🚀 Configuration automatique (recommandé)
npm run supabase:wire    # Configuration semi-automatique
npm run db:verify        # Vérifier les tables
npm run db:studio        # Ouvrir Prisma Studio
npm run migrate:dev      # Créer une migration
npm run migrate:deploy   # Déployer les migrations
npm run db:generate      # Générer le client Prisma
```

### **Guides de documentation**
- `SUPABASE_SUPER_PROMPT.md` - Guide du super script
- `SUPABASE_COMPLETE_GUIDE.md` - Guide complet détaillé
- `SUPABASE_SETUP.md` - Guide de setup rapide
- `DEPLOYMENT_FINAL.md` - Guide de déploiement Vercel

---

## 🔧 **UTILISATION MANUELLE (SI BESOIN)**

Si vous préférez configurer manuellement :

### **1. Créer `.env.local`**
```bash
DATABASE_URL="postgresql://postgres.xxxxx:password@...?sslmode=require"
TZ="UTC"
```

### **2. Installer les dépendances**
```bash
npm install
```

### **3. Générer le client Prisma**
```bash
npm run db:generate
```

### **4. Créer la première migration**
```bash
npm run migrate:dev -- --name init
```

### **5. Vérifier les tables**
```bash
npm run db:verify
```

---

## 📊 **STRUCTURE DE LA BASE SUPABASE**

### **Tables créées automatiquement**

#### **`documents`**
- Stocke les documents ancrés sur la blockchain
- Champs : `id`, `hash`, `fileName`, `txHash`, `author`, `timestamp`

#### **`certificates`**
- Stocke les certificats PDF générés
- Champs : `id`, `documentId`, `pdfUrl`, `qrCode`

#### **`users`**
- Utilisateurs futurs (authentification)
- Champs : `id`, `email`, `ethereumAddress`

---

## 🚀 **DÉPLOIEMENT VERCEL**

Une fois configuré localement :

### **1. Ajouter les variables Vercel**

Vercel → Settings → Environment Variables :

```bash
DATABASE_URL=postgresql://postgres.xxxxx:password@...?sslmode=require
NEXT_PUBLIC_RPC_URL=https://sepolia.infura.io/v3/VOTRE_PROJECT_ID
NEXT_PUBLIC_CONTRACT_ADDRESS=0x7b7C41cf5bc986F406c7067De6e69f200c27D63f
NEXT_PUBLIC_CHAIN_ID=11155111
NEXT_PUBLIC_SITE_URL=https://votre-projet.vercel.app
```

### **2. Déployer**

```bash
vercel --prod
```

### **3. Tester**

1. Ouvrez votre URL Vercel
2. Allez sur `/anchor`
3. Ancrez un document
4. Vérifiez dans Supabase Dashboard → Table Editor → `documents`

---

## 🔍 **VÉRIFICATION ET DEBUGGING**

### **Tester la connexion**
```bash
npm run db:verify
```

### **Voir les données**
```bash
npm run db:studio
# Ouvre http://localhost:5555
```

### **Vérifier le statut des migrations**
```bash
npx prisma migrate status
```

### **Voir les logs Prisma**
Le client est configuré avec logs en développement.

---

## 💡 **CONSEILS ET ASTUCES**

### **Performance**
- Utilisez la **Pooled Connection** (port 6543) pour de meilleures performances
- Activez **Connection Pooling** dans Supabase

### **Sécurité**
- Ne commitez JAMAIS `.env.local` dans Git
- Utilisez des variables d'environnement Vercel
- Activez **Row Level Security** dans Supabase si nécessaire

### **Backup**
- Activez les **backups automatiques** dans Supabase
- Exportez régulièrement vos données

---

## 🆘 **DÉPANNAGE**

### **"DATABASE_URL invalide"**
✅ Vérifiez que l'URL commence par `postgresql://`
✅ Ajoutez `?sslmode=require` à la fin

### **"Table does not exist"**
✅ Créez les tables : `npm run migrate:dev -- --name init`

### **"Connection refused"**
✅ Vérifiez que votre projet Supabase est actif
✅ Testez la connexion depuis Supabase Dashboard

### **"tsx not found"**
✅ Installez : `npm install`

---

## 📖 **RESSOURCES**

- [Documentation Supabase](https://supabase.com/docs)
- [Documentation Prisma](https://prisma.io/docs)
- [Documentation Next.js](https://nextjs.org/docs)
- [VeritasChain GitHub](https://github.com/votre-repo)

---

## 🎯 **PROCHAINES ÉTAPES**

1. ✅ Lancez `npm run supabase:super`
2. ✅ Vérifiez avec `npm run db:verify`
3. ✅ Testez avec `npm run db:studio`
4. ✅ Développez localement : `npm run dev`
5. ✅ Déployez sur Vercel : `vercel --prod`

---

**🎉 Votre VeritasChain est maintenant connecté à Supabase PostgreSQL !**

**💬 Besoin d'aide ?** Consultez les guides complets dans le dossier `web/`.

**⭐ Bon développement !**
