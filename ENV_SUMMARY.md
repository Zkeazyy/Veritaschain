# 📊 Résumé des Variables d'Environnement VeritasChain

## 🎯 Variables Identifiées (32 au total)

### 📋 Tableau Complet

| # | Name | Used in | Required | Type | Description |
|---|------|---------|----------|------|-------------|
| 1 | **DATABASE_URL** | Server | ✅ | Private | URL PostgreSQL Supabase |
| 2 | **DIRECT_URL** | Server | ✅ | Private | URL directe PostgreSQL Supabase |
| 3 | **TZ** | Server | ❌ | Private | Timezone (défaut: UTC) |
| 4 | **NODE_ENV** | Server/Client | ❌ | Private | Environnement (development/production) |
| 5 | **NEXT_PUBLIC_SITE_URL** | Client | ✅ | Public | URL du site (local/production) |
| 6 | **NEXT_PUBLIC_RPC_URL** | Client/Server | ✅ | Public | URL RPC Ethereum (Infura/Alchemy) |
| 7 | **RPC_URL** | Server | ❌ | Private | URL RPC serveur (fallback) |
| 8 | **NEXT_PUBLIC_CONTRACT_ADDRESS** | Client/Server | ✅ | Public | Adresse contrat VeritasChain |
| 9 | **CONTRACT_ADDRESS** | Server | ❌ | Private | Adresse contrat serveur (fallback) |
| 10 | **NEXT_PUBLIC_CHAIN_ID** | Client/Server | ✅ | Public | ID de la chaîne (11155111 = Sepolia) |
| 11 | **CHAIN_ID** | Server | ❌ | Private | ID chaîne serveur (fallback) |
| 12 | **NEXT_PUBLIC_ETHERSCAN_BASE_URL** | Client | ✅ | Public | URL explorer blockchain |
| 13 | **PRIVATE_KEY** | Server | ❌ | Private | Clé privée pour transactions serveur |
| 14 | **NEXT_PUBLIC_VTS_CONTRACT_ADDRESS** | Client | ❌ | Public | Adresse token VTS (optionnel) |
| 15 | **NEXT_PUBLIC_NETWORK** | Client | ❌ | Public | Nom réseau (sepolia/base/polygon) |
| 16 | **NEXT_PUBLIC_APP_NAME** | Client | ❌ | Public | Nom application (défaut: VeritasChain) |
| 17 | **NEXT_PUBLIC_FEATURE_RH** | Client | ❌ | Public | Activer module RH (true/false) |
| 18 | **NEXT_PUBLIC_FEATURE_ACCOUNTING** | Client | ❌ | Public | Activer module Comptabilité |
| 19 | **NEXT_PUBLIC_FEATURE_LEGAL** | Client | ❌ | Public | Activer module Juridique |
| 20 | **NEXT_PUBLIC_FEATURE_BTP** | Client | ❌ | Public | Activer module BTP |
| 21 | **NEXT_PUBLIC_FEATURE_PDF** | Client | ❌ | Public | Activer génération PDF |
| 22 | **NEXT_PUBLIC_FEATURE_BLOCKCHAIN** | Client | ❌ | Public | Activer ancrage blockchain |
| 23 | **NEXT_PUBLIC_FEATURE_QR** | Client | ❌ | Public | Activer génération QR |
| 24 | **NEXT_PUBLIC_FEATURE_EXPERIMENTAL** | Client | ❌ | Public | Activer fonctionnalités expérimentales |
| 25 | **NEXT_PUBLIC_FEATURE_CORE** | Client | ❌ | Public | Activer fonctionnalités core |
| 26 | **SEPOLIA_RPC_URL** | Hardhat | ❌ | Private | URL RPC Sepolia pour déploiement |
| 27 | **BASE_RPC_URL** | Hardhat | ❌ | Private | URL RPC Base pour déploiement |
| 28 | **BASE_SEPOLIA_RPC_URL** | Hardhat | ❌ | Private | URL RPC Base Sepolia |
| 29 | **POLYGON_RPC_URL** | Hardhat | ❌ | Private | URL RPC Polygon |
| 30 | **ETHERSCAN_API_KEY** | Hardhat | ❌ | Private | Clé API Etherscan |
| 31 | **BASESCAN_API_KEY** | Hardhat | ❌ | Private | Clé API Basescan |
| 32 | **POLYGONSCAN_API_KEY** | Hardhat | ❌ | Private | Clé API Polygonscan |
| 33 | **REPORT_GAS** | Hardhat | ❌ | Private | Activer rapport gas |
| 34 | **VTS_CONTRACT_ADDRESS** | Hardhat | ❌ | Private | Adresse VTS pour scripts |

## 📊 Statistiques

- **Total** : 34 variables
- **Obligatoires** : 6 variables
- **Optionnelles** : 28 variables
- **Publiques** (`NEXT_PUBLIC_*`) : 20 variables
- **Privées** : 14 variables
- **Client** : 20 variables
- **Serveur** : 14 variables
- **Hardhat** : 9 variables

## 🎯 Variables Critiques

### ✅ Obligatoires (6)
1. `DATABASE_URL` - Base de données Supabase
2. `DIRECT_URL` - Base de données directe
3. `NEXT_PUBLIC_SITE_URL` - URL du site
4. `NEXT_PUBLIC_RPC_URL` - URL RPC blockchain
5. `NEXT_PUBLIC_CONTRACT_ADDRESS` - Adresse contrat
6. `NEXT_PUBLIC_CHAIN_ID` - ID de la chaîne
7. `NEXT_PUBLIC_ETHERSCAN_BASE_URL` - URL explorer

### 🔧 Configuration Réseau

#### Sepolia (Testnet Ethereum)
```bash
NEXT_PUBLIC_RPC_URL="https://sepolia.infura.io/v3/[YOUR_PROJECT_ID]"
NEXT_PUBLIC_CONTRACT_ADDRESS="0x7b7C41cf5bc986F406c7067De6e69f200c27D63f"
NEXT_PUBLIC_CHAIN_ID="11155111"
NEXT_PUBLIC_ETHERSCAN_BASE_URL="https://sepolia.etherscan.io"
```

#### Base (Mainnet)
```bash
NEXT_PUBLIC_RPC_URL="https://base-mainnet.g.alchemy.com/v2/[YOUR_API_KEY]"
NEXT_PUBLIC_CONTRACT_ADDRESS="0x[CONTRACT_ADDRESS_BASE]"
NEXT_PUBLIC_CHAIN_ID="8453"
NEXT_PUBLIC_ETHERSCAN_BASE_URL="https://basescan.org"
```

## 🔍 Fichiers Analysés

- `lib/config.ts` - Configuration principale
- `lib/token/config.ts` - Configuration VTS
- `lib/feature-flags.ts` - Feature flags
- `lib/wagmi-config.ts` - Configuration wagmi
- `app/api/anchor/route.ts` - API ancrage
- `app/api/verify/route.ts` - API vérification
- `app/api/certificates/route.ts` - API certificats
- `vts-token/hardhat.config.ts` - Configuration Hardhat
- `vts-token/scripts/*.ts` - Scripts de déploiement
- `vercel.json` - Configuration Vercel
- `env.local.example` - Exemple de configuration

## 🚨 Points d'Attention

1. **Pas de duplication** : `NEXT_PUBLIC_RPC_URL` et `RPC_URL` sont des fallbacks
2. **Sécurité** : Variables `NEXT_PUBLIC_*` sont publiques
3. **Fallbacks** : Variables sans préfixe servent de fallback
4. **Feature Flags** : Toutes optionnelles, activent/désactivent des modules
5. **Hardhat** : Variables séparées pour le déploiement
