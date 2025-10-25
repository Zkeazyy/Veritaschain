# ==============================
# VERITASCHAIN - ENVIRONMENT VARIABLES
# ==============================

# ==============================
# BASE DE DONNÉES (OBLIGATOIRE)
# ==============================
DATABASE_URL="postgresql://postgres:[PASSWORD]@db.xxxxx.supabase.co:5432/postgres?sslmode=require"
DIRECT_URL="postgresql://postgres:[PASSWORD]@db.xxxxx.supabase.co:5432/postgres?sslmode=require"

# ==============================
# CONFIGURATION GÉNÉRALE
# ==============================
TZ="UTC"
NODE_ENV="development"

# ==============================
# BLOCKCHAIN SEPOLIA (OBLIGATOIRE)
# ==============================
NEXT_PUBLIC_RPC_URL="https://sepolia.infura.io/v3/[YOUR_PROJECT_ID]"
NEXT_PUBLIC_CONTRACT_ADDRESS="0x7b7C41cf5bc986F406c7067De6e69f200c27D63f"
NEXT_PUBLIC_CHAIN_ID="11155111"
NEXT_PUBLIC_ETHERSCAN_BASE_URL="https://sepolia.etherscan.io"

# ==============================
# BLOCKCHAIN BASE (ALTERNATIVE)
# ==============================
# NEXT_PUBLIC_RPC_URL="https://base-mainnet.g.alchemy.com/v2/[YOUR_API_KEY]"
# NEXT_PUBLIC_CONTRACT_ADDRESS="0x[CONTRACT_ADDRESS_BASE]"
# NEXT_PUBLIC_CHAIN_ID="8453"
# NEXT_PUBLIC_ETHERSCAN_BASE_URL="https://basescan.org"

# ==============================
# SITE (OBLIGATOIRE)
# ==============================
NEXT_PUBLIC_SITE_URL="http://localhost:3000"
# NEXT_PUBLIC_SITE_URL="https://votre-projet.vercel.app"

# ==============================
# FALLBACKS SERVEUR (OPTIONNEL)
# ==============================
RPC_URL="https://sepolia.infura.io/v3/[YOUR_PROJECT_ID]"
CONTRACT_ADDRESS="0x7b7C41cf5bc986F406c7067De6e69f200c27D63f"
CHAIN_ID="11155111"

# ==============================
# TOKEN VTS (OPTIONNEL)
# ==============================
NEXT_PUBLIC_VTS_CONTRACT_ADDRESS="0x[ADRESSE_VTS]"
NEXT_PUBLIC_NETWORK="sepolia"
NEXT_PUBLIC_APP_NAME="VeritasChain"

# ==============================
# FEATURE FLAGS (OPTIONNEL)
# ==============================
NEXT_PUBLIC_FEATURE_RH="true"
NEXT_PUBLIC_FEATURE_ACCOUNTING="true"
NEXT_PUBLIC_FEATURE_LEGAL="true"
NEXT_PUBLIC_FEATURE_BTP="true"
NEXT_PUBLIC_FEATURE_PDF="true"
NEXT_PUBLIC_FEATURE_BLOCKCHAIN="true"
NEXT_PUBLIC_FEATURE_QR="true"
NEXT_PUBLIC_FEATURE_EXPERIMENTAL="false"
NEXT_PUBLIC_FEATURE_CORE="true"

# ==============================
# TRANSACTIONS SERVEUR (OPTIONNEL)
# ==============================
PRIVATE_KEY="0x[VOTRE_CLE_PRIVEE]"

# ==============================
# DÉPLOIEMENT HARDHAT (OPTIONNEL)
# ==============================
SEPOLIA_RPC_URL="https://sepolia.infura.io/v3/[YOUR_PROJECT_ID]"
BASE_RPC_URL="https://base-mainnet.g.alchemy.com/v2/[YOUR_API_KEY]"
BASE_SEPOLIA_RPC_URL="https://base-sepolia.g.alchemy.com/v2/[YOUR_API_KEY]"
POLYGON_RPC_URL="https://polygon-mainnet.g.alchemy.com/v2/[YOUR_API_KEY]"

# Clés API Explorers
ETHERSCAN_API_KEY="[YOUR_ETHERSCAN_API_KEY]"
BASESCAN_API_KEY="[YOUR_BASESCAN_API_KEY]"
POLYGONSCAN_API_KEY="[YOUR_POLYGONSCAN_API_KEY]"

# Configuration Hardhat
REPORT_GAS="true"
VTS_CONTRACT_ADDRESS="0x[ADRESSE_VTS]"

# ==============================
# INSTRUCTIONS DE CONFIGURATION
# ==============================
# 1. Créez un projet sur supabase.com
# 2. Allez dans Settings → Database → Connection String
# 3. Copiez l'URL et remplacez DATABASE_URL ci-dessus
# 4. Remplacez [YOUR_PROJECT_ID] par votre vraie clé Infura/Alchemy
# 5. (Optionnel) Ajoutez votre PRIVATE_KEY MetaMask
# 6. (Optionnel) Configurez les Feature Flags selon vos besoins
# ==============================
