#!/bin/bash

# 🚀 Script de déploiement automatisé VeritasChain
# Usage: ./deploy.sh

set -e

echo "🚀 Déploiement VeritasChain sur Vercel..."

# Vérifier que nous sommes dans le bon répertoire
if [ ! -f "package.json" ]; then
    echo "❌ Erreur: package.json non trouvé. Assurez-vous d'être dans le dossier web/"
    exit 1
fi

# Vérifier que Vercel CLI est installé
if ! command -v vercel &> /dev/null; then
    echo "📦 Installation de Vercel CLI..."
    npm install -g vercel
fi

# Vérifier les variables d'environnement
echo "🔍 Vérification des variables d'environnement..."

if [ -z "$NEXT_PUBLIC_RPC_URL" ]; then
    echo "⚠️  Attention: NEXT_PUBLIC_RPC_URL non définie"
    echo "   Configurez-la dans Vercel après le déploiement"
fi

if [ -z "$PRIVATE_KEY" ]; then
    echo "⚠️  Attention: PRIVATE_KEY non définie"
    echo "   Configurez-la dans Vercel après le déploiement"
fi

# Build local pour vérifier
echo "🔨 Build local..."
npm run build

if [ $? -eq 0 ]; then
    echo "✅ Build réussi"
else
    echo "❌ Build échoué"
    exit 1
fi

# Déploiement sur Vercel
echo "🚀 Déploiement sur Vercel..."
vercel --prod

echo "✅ Déploiement terminé !"
echo ""
echo "📋 Prochaines étapes :"
echo "1. Configurez les variables d'environnement dans Vercel"
echo "2. Testez votre application déployée"
echo "3. Configurez MetaMask avec le réseau Sepolia"
echo "4. Obtenez des ETH de test sur sepoliafaucet.com"
echo ""
echo "📖 Consultez DEPLOYMENT.md pour plus de détails"
