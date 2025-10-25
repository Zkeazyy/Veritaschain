# 📋 Variables d'Environnement VeritasChain

## 🎯 Configuration Réseau

**Réseau actuel : Sepolia** (testnet Ethereum)

## 📊 Tableau des Variables d'Environnement

| Name | Used in | Required | Description |
|------|---------|----------|-------------|
| **DATABASE_URL** | Server | ✅ | URL PostgreSQL Supabase |
| **DIRECT_URL** | Server | ✅ | URL directe PostgreSQL Supabase |
| **TZ** | Server | ❌ | Timezone (défaut: UTC) |
| **NODE_ENV** | Server/Client | ❌ | Environnement (development/production) |
| **NEXT_PUBLIC_SITE_URL** | Client | ✅ | URL du site (local/production) |
| **NEXT_PUBLIC_RPC_URL** | Client/Server | ✅ | URL RPC Ethereum (Infura/Alchemy) |
| **RPC_URL** | Server | ❌ | URL RPC serveur (fallback) |
| **NEXT_PUBLIC_CONTRACT_ADDRESS** | Client/Server | ✅ | Adresse contrat VeritasChain |
| **CONTRACT_ADDRESS** | Server | ❌ | Adresse contrat serveur (fallback) |
| **NEXT_PUBLIC_CHAIN_ID** | Client/Server | ✅ | ID de la chaîne (11155111 = Sepolia) |
| **CHAIN_ID** | Server | ❌ | ID chaîne serveur (fallback) |
| **NEXT_PUBLIC_ETHERSCAN_BASE_URL** | Client | ✅ | URL explorer blockchain |
| **PRIVATE_KEY** | Server | ❌ | Clé privée pour transactions serveur |
| **NEXT_PUBLIC_VTS_CONTRACT_ADDRESS** | Client | ❌ | Adresse token VTS (optionnel) |
| **NEXT_PUBLIC_NETWORK** | Client | ❌ | Nom réseau (sepolia/base/polygon) |
| **NEXT_PUBLIC_APP_NAME** | Client | ❌ | Nom application (défaut: VeritasChain) |
| **NEXT_PUBLIC_FEATURE_RH** | Client | ❌ | Activer module RH (true/false) |
| **NEXT_PUBLIC_FEATURE_ACCOUNTING** | Client | ❌ | Activer module Comptabilité |
| **NEXT_PUBLIC_FEATURE_LEGAL** | Client | ❌ | Activer module Juridique |
| **NEXT_PUBLIC_FEATURE_BTP** | Client | ❌ | Activer module BTP |
| **NEXT_PUBLIC_FEATURE_PDF** | Client | ❌ | Activer génération PDF |
| **NEXT_PUBLIC_FEATURE_BLOCKCHAIN** | Client | ❌ | Activer ancrage blockchain |
| **NEXT_PUBLIC_FEATURE_QR** | Client | ❌ | Activer génération QR |
| **NEXT_PUBLIC_FEATURE_EXPERIMENTAL** | Client | ❌ | Activer fonctionnalités expérimentales |
| **NEXT_PUBLIC_FEATURE_CORE** | Client | ❌ | Activer fonctionnalités core |
| **SEPOLIA_RPC_URL** | Hardhat | ❌ | URL RPC Sepolia pour déploiement |
| **BASE_RPC_URL** | Hardhat | ❌ | URL RPC Base pour déploiement |
| **BASE_SEPOLIA_RPC_URL** | Hardhat | ❌ | URL RPC Base Sepolia |
| **POLYGON_RPC_URL** | Hardhat | ❌ | URL RPC Polygon |
| **ETHERSCAN_API_KEY** | Hardhat | ❌ | Clé API Etherscan |
| **BASESCAN_API_KEY** | Hardhat | ❌ | Clé API Basescan |
| **POLYGONSCAN_API_KEY** | Hardhat | ❌ | Clé API Polygonscan |
| **REPORT_GAS** | Hardhat | ❌ | Activer rapport gas |
| **VTS_CONTRACT_ADDRESS** | Hardhat | ❌ | Adresse VTS pour scripts |

## 🔧 Configuration pour Sepolia

### Variables Obligatoires

```bash
# Base de données
DATABASE_URL="postgresql://postgres:[PASSWORD]@db.xxxxx.supabase.co:5432/postgres?sslmode=require"
DIRECT_URL="postgresql://postgres:[PASSWORD]@db.xxxxx.supabase.co:5432/postgres?sslmode=require"

# Blockchain Sepolia
NEXT_PUBLIC_RPC_URL="https://sepolia.infura.io/v3/[YOUR_PROJECT_ID]"
NEXT_PUBLIC_CONTRACT_ADDRESS="0x7b7C41cf5bc986F406c7067De6e69f200c27D63f"
NEXT_PUBLIC_CHAIN_ID="11155111"
NEXT_PUBLIC_ETHERSCAN_BASE_URL="https://sepolia.etherscan.io"

# Site
NEXT_PUBLIC_SITE_URL="http://localhost:3000"  # ou https://votre-projet.vercel.app
```

### Variables Optionnelles

```bash
# Token VTS (optionnel)
NEXT_PUBLIC_VTS_CONTRACT_ADDRESS="0x[ADRESSE_VTS]"
NEXT_PUBLIC_NETWORK="sepolia"
NEXT_PUBLIC_APP_NAME="VeritasChain"

# Feature Flags (optionnel)
NEXT_PUBLIC_FEATURE_RH="true"
NEXT_PUBLIC_FEATURE_ACCOUNTING="true"
NEXT_PUBLIC_FEATURE_LEGAL="true"
NEXT_PUBLIC_FEATURE_BTP="true"

# Transactions serveur (optionnel)
PRIVATE_KEY="0x[VOTRE_CLE_PRIVEE]"

# Fallbacks serveur (optionnel)
RPC_URL="https://sepolia.infura.io/v3/[YOUR_PROJECT_ID]"
CONTRACT_ADDRESS="0x7b7C41cf5bc986F406c7067De6e69f200c27D63f"
CHAIN_ID="11155111"
```

## 🔧 Configuration pour Base

### Variables Obligatoires

```bash
# Base de données
DATABASE_URL="postgresql://postgres:[PASSWORD]@db.xxxxx.supabase.co:5432/postgres?sslmode=require"
DIRECT_URL="postgresql://postgres:[PASSWORD]@db.xxxxx.supabase.co:5432/postgres?sslmode=require"

# Blockchain Base
NEXT_PUBLIC_RPC_URL="https://base-mainnet.g.alchemy.com/v2/[YOUR_API_KEY]"
NEXT_PUBLIC_CONTRACT_ADDRESS="0x[CONTRACT_ADDRESS_BASE]"
NEXT_PUBLIC_CHAIN_ID="8453"
NEXT_PUBLIC_ETHERSCAN_BASE_URL="https://basescan.org"

# Site
NEXT_PUBLIC_SITE_URL="http://localhost:3000"  # ou https://votre-projet.vercel.app
```

### Variables Optionnelles

```bash
# Token VTS (optionnel)
NEXT_PUBLIC_VTS_CONTRACT_ADDRESS="0x[ADRESSE_VTS_BASE]"
NEXT_PUBLIC_NETWORK="base"
NEXT_PUBLIC_APP_NAME="VeritasChain"

# Feature Flags (optionnel)
NEXT_PUBLIC_FEATURE_RH="true"
NEXT_PUBLIC_FEATURE_ACCOUNTING="true"
NEXT_PUBLIC_FEATURE_LEGAL="true"
NEXT_PUBLIC_FEATURE_BTP="true"

# Transactions serveur (optionnel)
PRIVATE_KEY="0x[VOTRE_CLE_PRIVEE]"

# Fallbacks serveur (optionnel)
RPC_URL="https://base-mainnet.g.alchemy.com/v2/[YOUR_API_KEY]"
CONTRACT_ADDRESS="0x[CONTRACT_ADDRESS_BASE]"
CHAIN_ID="8453"
```

## 🚀 Déploiement Hardhat

### Variables pour Déploiement

```bash
# RPC URLs
SEPOLIA_RPC_URL="https://sepolia.infura.io/v3/[YOUR_PROJECT_ID]"
BASE_RPC_URL="https://base-mainnet.g.alchemy.com/v2/[YOUR_API_KEY]"
BASE_SEPOLIA_RPC_URL="https://base-sepolia.g.alchemy.com/v2/[YOUR_API_KEY]"
POLYGON_RPC_URL="https://polygon-mainnet.g.alchemy.com/v2/[YOUR_API_KEY]"

# Clés API Explorers
ETHERSCAN_API_KEY="[YOUR_ETHERSCAN_API_KEY]"
BASESCAN_API_KEY="[YOUR_BASESCAN_API_KEY]"
POLYGONSCAN_API_KEY="[YOUR_POLYGONSCAN_API_KEY]"

# Déploiement
PRIVATE_KEY="0x[VOTRE_CLE_PRIVEE]"
REPORT_GAS="true"
```

## 📝 Notes Importantes

### 🔒 Sécurité
- **Variables `NEXT_PUBLIC_*`** : Publiques, visibles côté client
- **Variables sans préfixe** : Privées, serveur uniquement
- **`PRIVATE_KEY`** : ⚠️ **JAMAIS** dans le code source

### 🔄 Fallbacks
- `RPC_URL` → fallback de `NEXT_PUBLIC_RPC_URL`
- `CONTRACT_ADDRESS` → fallback de `NEXT_PUBLIC_CONTRACT_ADDRESS`
- `CHAIN_ID` → fallback de `NEXT_PUBLIC_CHAIN_ID`

### 🌐 Réseaux Supportés
- **Sepolia** : `11155111` (testnet Ethereum)
- **Base** : `8453` (mainnet Base)
- **Base Sepolia** : `84532` (testnet Base)
- **Polygon** : `137` (mainnet Polygon)

### 🎛️ Feature Flags
Toutes les variables `NEXT_PUBLIC_FEATURE_*` sont optionnelles et activent/désactivent des modules :
- `true` : Module activé
- `false` : Module désactivé
- Non défini : Utilise la valeur par défaut

## 🔍 Vérification

### Commandes de Test
```bash
# Vérifier la base de données
npm run db:verify

# Tester la connectivité réseau
cd vts-token && npm run test:network

# Vérifier la configuration
npm run build
```

### Checklist
- [ ] `DATABASE_URL` configuré avec vraie URL Supabase
- [ ] `NEXT_PUBLIC_RPC_URL` configuré avec vraie URL RPC
- [ ] `NEXT_PUBLIC_CONTRACT_ADDRESS` configuré
- [ ] `NEXT_PUBLIC_CHAIN_ID` correspond au réseau
- [ ] `NEXT_PUBLIC_SITE_URL` configuré
- [ ] `NEXT_PUBLIC_ETHERSCAN_BASE_URL` correspond au réseau
- [ ] Variables `NEXT_PUBLIC_*` ajoutées à Vercel
- [ ] `PRIVATE_KEY` configuré (si transactions serveur)
