# ⚡ CONFIGURATION RAPIDE POUR VOTRE SUPABASE

## 🔐 **VOTRE DSN SUPABASE**

Votre DSN de base (à compléter) :
```
postgresql://postgres:[YOUR_PASSWORD]@db.augdtdjjwacaqqwbphic.supabase.co:5432/postgres?sslmode=require
```

⚠️ **Remplacez `[YOUR_PASSWORD]` par votre vrai mot de passe Supabase !**

---

## 🚀 **MÉTHODE 1 : Configuration automatique (RECOMMANDÉ)**

### **Étape 1 : Définir la variable d'environnement**

**Windows PowerShell :**
```powershell
$env:SUPABASE_DSN="postgresql://postgres:VOTRE_MOT_DE_PASSE@db.augdtdjjwacaqqwbphic.supabase.co:5432/postgres?sslmode=require"
```

**Remplacez `VOTRE_MOT_DE_PASSE` par votre vrai mot de passe !**

### **Étape 2 : Lancer le super script**
```powershell
cd C:\Users\sabme\Downloads\veritaschain\web
npm run supabase:super
```

---

## 🔧 **MÉTHODE 2 : Configuration manuelle**

### **Étape 1 : Créer le fichier .env.local**

Créez le fichier `web/.env.local` avec ce contenu :

```bash
# Supabase Database (PostgreSQL)
DATABASE_URL="postgresql://postgres:VOTRE_MOT_DE_PASSE@db.augdtdjjwacaqqwbphic.supabase.co:5432/postgres?sslmode=require"

# Timezone
TZ="UTC"

# Blockchain Configuration
NEXT_PUBLIC_RPC_URL=https://sepolia.infura.io/v3/VOTRE_PROJECT_ID_INFURA
RPC_URL=https://sepolia.infura.io/v3/VOTRE_PROJECT_ID_INFURA

# Contract Address (Sepolia)
NEXT_PUBLIC_CONTRACT_ADDRESS=0x7b7C41cf5bc986F406c7067De6e69f200c27D63f
CONTRACT_ADDRESS=0x7b7C41cf5bc986F406c7067De6e69f200c27D63f

# Chain ID
NEXT_PUBLIC_CHAIN_ID=11155111
CHAIN_ID=11155111

# Site URL
NEXT_PUBLIC_SITE_URL=http://localhost:3000

# Etherscan
NEXT_PUBLIC_ETHERSCAN_BASE_URL=https://sepolia.etherscan.io
```

### **Étape 2 : Générer le client Prisma**
```bash
npm run db:generate
```

### **Étape 3 : Créer les tables**
```bash
npm run migrate:dev -- --name init
```

### **Étape 4 : Vérifier**
```bash
npm run db:verify
```

---

## 📝 **EXEMPLE COMPLET**

Si votre mot de passe Supabase est `MySecurePass123!`, voici la commande complète :

```powershell
# 1. Définir la variable
$env:SUPABASE_DSN="postgresql://postgres:MySecurePass123!@db.augdtdjjwacaqqwbphic.supabase.co:5432/postgres?sslmode=require"

# 2. Aller dans le dossier
cd C:\Users\sabme\Downloads\veritaschain\web

# 3. Lancer le super script
npm run supabase:super
```

---

## ✅ **VÉRIFICATION**

Après la configuration, testez avec :

```bash
npm run db:verify
```

Résultat attendu :
```
🔎 VÉRIFICATION DES TABLES PRISMA
📊 Base de données: ✅ PostgreSQL (Supabase)
🔗 Host: db.augdtdjjwacaqqwbphic.supabase.co

  • Document        : ✅ OK (0 lignes)
  • Certificate     : ✅ OK (0 lignes)
  • User            : ✅ OK (0 lignes)

✅ TOUTES LES TABLES SONT OK
```

---

## 🎯 **PROCHAINES ÉTAPES**

1. ✅ Remplacez `[YOUR_PASSWORD]` par votre vrai mot de passe
2. ✅ Lancez `npm run supabase:super`
3. ✅ Vérifiez avec `npm run db:verify`
4. ✅ Testez avec `npm run dev`

---

## 🔐 **SÉCURITÉ**

⚠️ **IMPORTANT** :
- Ne partagez JAMAIS votre mot de passe
- Ne commitez JAMAIS `.env.local` dans Git
- Utilisez des variables d'environnement Vercel pour la production

---

**🎉 Votre DSN est correct ! Il suffit de remplacer le mot de passe et lancer le script !**
