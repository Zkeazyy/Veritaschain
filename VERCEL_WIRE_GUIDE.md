# 🚀 VERCEL WIRE - GUIDE COMPLET

## 📋 **OBJECTIF**

Pousser automatiquement toutes vos variables d'environnement vers Vercel et déclencher un redéploiement.

---

## ✅ **PRÉREQUIS**

### **1. Token Vercel (2 minutes)**

1. Allez sur [vercel.com/account/tokens](https://vercel.com/account/tokens)
2. Cliquez sur **"Create Token"**
3. Nom : `VeritasChain`
4. Scope : **Full Access** (ou Custom avec permissions sur votre projet)
5. Expirat : Choisissez une durée (ou "No Expiration")
6. **Copiez le token** (commence par `vercel_...`)

### **2. Project ID Vercel (1 minute)**

1. Allez sur [vercel.com/dashboard](https://vercel.com/dashboard)
2. Sélectionnez votre projet **VeritasChain**
3. **Settings** → **General**
4. Copiez le **Project ID** (commence par `prj_...`)

### **3. Team ID (optionnel)**

Si votre projet appartient à une Team :
1. Settings → **General**
2. Copiez le **Team ID** (commence par `team_...`)

### **4. Deploy Hook (optionnel mais recommandé)**

1. Settings → **Git** → **Deploy Hooks**
2. Créez un nouveau hook :
   - **Name** : Auto Deploy
   - **Branch** : main (ou votre branche)
3. **Copiez l'URL** (commence par `https://api.vercel.com/v1/integrations/deploy/...`)

---

## 🔧 **CONFIGURATION**

### **Ajoutez ces lignes dans `web/.env.local` :**

```bash
# ==============================
# VERCEL CONFIGURATION
# ==============================

# Token Vercel (obligatoire)
VERCEL_TOKEN="vercel_xxx..."

# Project ID (obligatoire)
VERCEL_PROJECT_ID="prj_xxx..."

# Team ID (optionnel, si projet dans une Team)
VERCEL_TEAM_ID="team_xxx..."

# Deploy Hook URL (optionnel mais recommandé)
DEPLOY_HOOK_URL="https://api.vercel.com/v1/integrations/deploy/prj_xxx/xxx"

# ==============================
# VARIABLES À POUSSER VERS VERCEL
# ==============================

# Supabase (déjà configuré)
DATABASE_URL="postgresql://postgres:BOAdelA15082018%21%2F@db.augdtdjjwacaqqwbphic.supabase.co:5432/postgres?sslmode=require"

# Blockchain (à configurer)
NEXT_PUBLIC_RPC_URL=https://sepolia.infura.io/v3/VOTRE_PROJECT_ID_INFURA
RPC_URL=https://sepolia.infura.io/v3/VOTRE_PROJECT_ID_INFURA

# Contract
NEXT_PUBLIC_CONTRACT_ADDRESS=0x7b7C41cf5bc986F406c7067De6e69f200c27D63f
CONTRACT_ADDRESS=0x7b7C41cf5bc986F406c7067De6e69f200c27D63f

# Chain
NEXT_PUBLIC_CHAIN_ID=11155111
CHAIN_ID=11155111

# Site (remplacez par votre vraie URL Vercel)
NEXT_PUBLIC_SITE_URL=https://votre-projet.vercel.app

# Etherscan
NEXT_PUBLIC_ETHERSCAN_BASE_URL=https://sepolia.etherscan.io

# Private Key (optionnel)
# PRIVATE_KEY=0xVOTRE_CLE_PRIVEE
```

---

## 🚀 **UTILISATION**

### **Commande unique :**

```bash
cd web
npm run vercel:wire
```

**Ce script va automatiquement :**
1. ✅ Vérifier que `VERCEL_TOKEN` et `VERCEL_PROJECT_ID` sont définis
2. ✅ Pousser toutes les variables d'environnement vers Vercel
3. ✅ Déclencher un redéploiement automatique
4. ✅ Afficher le résumé de l'opération

---

## 📊 **VARIABLES POUSSÉES AUTOMATIQUEMENT**

Le script pousse ces variables (si définies) :
- `DATABASE_URL` → Base Supabase
- `NEXT_PUBLIC_RPC_URL` → Infura/Alchemy
- `RPC_URL` → Infura/Alchemy (serveur)
- `NEXT_PUBLIC_CONTRACT_ADDRESS` → Adresse du contrat
- `CONTRACT_ADDRESS` → Adresse du contrat (serveur)
- `NEXT_PUBLIC_CHAIN_ID` → 11155111 (Sepolia)
- `CHAIN_ID` → 11155111 (serveur)
- `NEXT_PUBLIC_SITE_URL` → URL de production
- `NEXT_PUBLIC_ETHERSCAN_BASE_URL` → Etherscan Sepolia
- `PRIVATE_KEY` → Clé privée (si définie)

---

## 🔍 **VÉRIFICATION**

### **1. Vérifier les variables sur Vercel**

1. Allez sur Vercel → Votre projet
2. **Settings** → **Environment Variables**
3. Vérifiez que toutes les variables sont présentes

### **2. Vérifier le déploiement**

1. **Deployments** → Dernier déploiement
2. Statut doit être **"Building"** ou **"Ready"**
3. Attendez 2-5 minutes

### **3. Tester l'application déployée**

```bash
# Ouvrez votre URL Vercel
https://votre-projet.vercel.app

# Testez
→ /anchor (ancrer un document)
→ /verify (vérifier)
→ Vérifiez Supabase Dashboard → Table Editor
```

---

## 🔧 **DÉPANNAGE**

### **Erreur : "VERCEL_TOKEN manquant"**

1. Vérifiez que le token est dans `.env.local`
2. Format : `VERCEL_TOKEN="vercel_xxx..."`
3. Pas d'espaces, pas de quotes doubles dans le token

### **Erreur : "401 Unauthorized"**

1. Le token n'est pas valide
2. Créez un nouveau token sur Vercel
3. Vérifiez les permissions du token

### **Erreur : "Project not found"**

1. Vérifiez le `VERCEL_PROJECT_ID`
2. Format : `prj_xxx...`
3. Copiez-le depuis Vercel → Project → Settings → General

### **Erreur : "already exists"**

La variable existe déjà sur Vercel. C'est normal !
- Le script continue
- Pour mettre à jour, supprimez la variable sur Vercel et relancez

---

## 📖 **WORKFLOW COMPLET**

### **Configuration initiale (une seule fois) :**

```bash
# 1. Récupérer les credentials Vercel
# 2. Ajouter dans .env.local :
#    VERCEL_TOKEN, VERCEL_PROJECT_ID, (VERCEL_TEAM_ID), (DEPLOY_HOOK_URL)
# 3. Lancer la configuration
npm run vercel:wire
```

### **Mises à jour futures :**

```bash
# Quand vous modifiez une variable dans .env.local
npm run vercel:wire
# → Pousse automatiquement vers Vercel et redéploie
```

---

## 🎯 **CHECKLIST**

- [ ] Token Vercel récupéré
- [ ] Project ID copié
- [ ] Variables ajoutées dans `.env.local`
- [ ] `npm run vercel:wire` exécuté avec succès
- [ ] Déploiement en cours sur Vercel
- [ ] Variables vérifiées dans Vercel Settings
- [ ] Application testée en production

---

## 💡 **CONSEILS**

### **Sécurité**
- Ne commitez **JAMAIS** `.env.local` dans Git
- Gardez votre `VERCEL_TOKEN` secret
- Utilisez un token avec les permissions minimales

### **Performance**
- Utilisez `DEPLOY_HOOK_URL` pour des redéploiements plus rapides
- Créez plusieurs hooks pour différentes branches

### **Organisation**
- Créez un token par projet
- Documentez les tokens dans un gestionnaire de mots de passe
- Renouvelez les tokens régulièrement

---

## 🔗 **LIENS UTILES**

- [Vercel Tokens](https://vercel.com/account/tokens)
- [Vercel API Documentation](https://vercel.com/docs/rest-api)
- [Deploy Hooks](https://vercel.com/docs/concepts/git/deploy-hooks)
- [Environment Variables](https://vercel.com/docs/concepts/projects/environment-variables)

---

**🎉 Une fois configuré, `npm run vercel:wire` déploie tout automatiquement !**
