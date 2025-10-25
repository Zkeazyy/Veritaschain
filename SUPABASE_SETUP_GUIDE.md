# 🚀 VERITASCHAIN - GUIDE DE CONFIGURATION SUPABASE

## 📋 **ÉTAPES POUR CONFIGURER SUPABASE**

### **1. Créer un projet Supabase (5 minutes)**

1. Allez sur [supabase.com/dashboard](https://supabase.com/dashboard)
2. Cliquez sur "New Project"
3. Choisissez votre organisation
4. Nom du projet : `veritaschain`
5. Mot de passe : `VotreMotDePasseSecurise123!`
6. Région : `Europe West (Ireland)` ou `US East (N. Virginia)`
7. Cliquez sur "Create new project"

### **2. Récupérer les informations de connexion**

1. Une fois le projet créé, allez dans **Settings** → **Database**
2. Dans la section **Connection string**, copiez l'URL
3. Elle ressemble à : `postgresql://postgres:[YOUR-PASSWORD]@db.xxxxx.supabase.co:5432/postgres`

### **3. Configurer les variables d'environnement**

Créez un fichier `.env.production` avec :

```bash
# Supabase Database
DATABASE_URL="postgresql://postgres:VotreMotDePasseSecurise123!@db.xxxxx.supabase.co:5432/postgres?sslmode=require"
DIRECT_URL="postgresql://postgres:VotreMotDePasseSecurise123!@db.xxxxx.supabase.co:5432/postgres?sslmode=require"

# Autres variables (gardez les mêmes)
TZ="UTC"
NEXT_PUBLIC_RPC_URL=https://sepolia.infura.io/v3/VOTRE_PROJECT_ID
RPC_URL=https://sepolia.infura.io/v3/VOTRE_PROJECT_ID
NEXT_PUBLIC_CONTRACT_ADDRESS=0x7b7C41cf5bc986F406c7067De6e69f200c27D63f
CONTRACT_ADDRESS=0x7b7C41cf5bc986F406c7067De6e69f200c27D63f
NEXT_PUBLIC_CHAIN_ID=11155111
CHAIN_ID=11155111
NEXT_PUBLIC_SITE_URL=https://veritaschain.vercel.app
NEXT_PUBLIC_ETHERSCAN_BASE_URL=https://sepolia.etherscan.io
```

### **4. Déployer les migrations**

```bash
# Générer le client Prisma
npm run db:generate

# Appliquer les migrations à Supabase
DATABASE_URL="votre_url_supabase" npm run migrate:deploy

# Vérifier que tout fonctionne
DATABASE_URL="votre_url_supabase" npm run db:verify
```

### **5. Configurer Vercel**

1. Allez sur [vercel.com/account/tokens](https://vercel.com/account/tokens)
2. Créez un token : `VeritasChain`
3. Copiez le token : `vercel_xxx...`
4. Allez sur votre projet Vercel → Settings → General
5. Copiez le **Project ID** : `prj_xxx...`

Ajoutez dans `.env.production` :
```bash
VERCEL_TOKEN="vercel_xxx..."
VERCEL_PROJECT_ID="prj_xxx..."
```

### **6. Déployer automatiquement**

```bash
# Pousser toutes les variables vers Vercel et redéployer
npm run vercel:wire
```

## ✅ **VÉRIFICATION**

Après déploiement, testez :
- https://votre-projet.vercel.app/anchor
- https://votre-projet.vercel.app/verify
- https://votre-projet.vercel.app/api/health/pdf

## 🔧 **COMMANDES UTILES**

```bash
# Base de données locale (SQLite)
npm run dev

# Base de données production (Supabase)
DATABASE_URL="votre_url_supabase" npm run db:verify
DATABASE_URL="votre_url_supabase" npm run db:studio

# Déploiement
npm run vercel:wire
```

## 📞 **SUPPORT**

Si vous avez des problèmes :
1. Vérifiez que Supabase est bien configuré
2. Vérifiez que les variables d'environnement sont correctes
3. Vérifiez que Vercel a accès aux variables
4. Consultez les logs Vercel en cas d'erreur
