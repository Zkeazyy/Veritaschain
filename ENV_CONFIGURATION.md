# ==============================
# VERITASCHAIN - CONFIGURATION ENVIRONNEMENT
# ==============================

# 🚀 CONFIGURATION REQUISE POUR LE DÉPLOIEMENT

## 📋 **Variables d'environnement critiques**

### **Blockchain (OBLIGATOIRE)**
```bash
# RPC URL - Remplacez VOTRE_PROJECT_ID par votre vraie valeur Infura/Alchemy
NEXT_PUBLIC_RPC_URL=https://sepolia.infura.io/v3/VOTRE_PROJECT_ID
RPC_URL=https://sepolia.infura.io/v3/VOTRE_PROJECT_ID

# Contract Address (Sepolia - déjà déployé)
NEXT_PUBLIC_CONTRACT_ADDRESS=0x7b7C41cf5bc986F406c7067De6e69f200c27D63f
CONTRACT_ADDRESS=0x7b7C41cf5bc986F406c7067De6e69f200c27D63f

# Chain ID (Sepolia)
NEXT_PUBLIC_CHAIN_ID=11155111
CHAIN_ID=11155111

# Etherscan
NEXT_PUBLIC_ETHERSCAN_BASE_URL=https://sepolia.etherscan.io
```

### **Base de données (OBLIGATOIRE)**
```bash
# SQLite (développement local)
DATABASE_URL="file:./dev.db"

# PostgreSQL Supabase (production)
# DATABASE_URL="postgresql://postgres:VOTRE_MOT_DE_PASSE@db.xxxxx.supabase.co:5432/postgres?sslmode=require"
# DIRECT_URL="postgresql://postgres:VOTRE_MOT_DE_PASSE@db.xxxxx.supabase.co:5432/postgres?sslmode=require"
```

### **Site (OBLIGATOIRE)**
```bash
# Local
NEXT_PUBLIC_SITE_URL=http://localhost:3000

# Production (remplacez par votre vraie URL Vercel)
# NEXT_PUBLIC_SITE_URL=https://votre-projet.vercel.app
```

### **Sécurité (OPTIONNEL mais recommandé)**
```bash
# Clé privée MetaMask pour transactions serveur
# PRIVATE_KEY=0xVOTRE_CLE_PRIVEE_METAMASK

# Timezone
TZ="UTC"
```

---

## 🔧 **INSTRUCTIONS DE CONFIGURATION**

### **1. Configuration Infura (5 minutes)**
1. Allez sur [infura.io](https://infura.io)
2. Créez un compte et un projet
3. Sélectionnez "Ethereum" → "Sepolia"
4. Copiez l'URL RPC
5. Remplacez `VOTRE_PROJECT_ID` dans les variables ci-dessus

### **2. Configuration Vercel (5 minutes)**
1. Allez sur [vercel.com/dashboard](https://vercel.com/dashboard)
2. Sélectionnez votre projet VeritasChain
3. Allez dans **Settings** → **Environment Variables**
4. Ajoutez toutes les variables `NEXT_PUBLIC_*` et `PRIVATE_KEY`
5. Redéployez le projet

### **3. Configuration Supabase (optionnel pour production)**
1. Allez sur [supabase.com/dashboard](https://supabase.com/dashboard)
2. Créez un nouveau projet
3. Allez dans **Settings** → **Database** → **Connection String**
4. Copiez l'URL et remplacez `DATABASE_URL` et `DIRECT_URL`

---

## ✅ **VALIDATION**

### **Test local :**
```bash
npm run dev
curl http://localhost:3000/api/health/pdf
```

### **Test production :**
```bash
curl https://votre-projet.vercel.app/api/health/pdf
```

---

## ⚠️ **SÉCURITÉ**

- ✅ `PRIVATE_KEY` → **SERVER-ONLY** (jamais exposée côté client)
- ✅ `DATABASE_URL` → **SERVER-ONLY** (jamais exposée côté client)
- ✅ Variables `NEXT_PUBLIC_*` → **PUBLIQUES** (sécurisées à publier)
- ✅ Headers de sécurité configurés dans `next.config.ts`

---

## 🚨 **DÉPANNAGE**

### **Erreur "Configuration serveur incomplète" :**
- Vérifiez que `NEXT_PUBLIC_RPC_URL` est défini
- Vérifiez que `NEXT_PUBLIC_CONTRACT_ADDRESS` est défini
- Vérifiez que `PRIVATE_KEY` est défini (si utilisé)

### **Erreur "Format de hash invalide" :**
- Le hash doit commencer par `0x`
- Le hash doit contenir exactement 64 caractères hexadécimaux
- Exemple valide : `0xba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad`

### **Build Vercel échoue :**
- Vérifiez que toutes les variables `NEXT_PUBLIC_*` sont définies
- Vérifiez que `DATABASE_URL` est défini
- Consultez les logs Vercel pour plus de détails
