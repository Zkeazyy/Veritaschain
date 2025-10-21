#!/bin/bash

# 🧪 Script de validation complète VeritasChain
# Usage: ./validate.sh

set -e

echo "🧪 Validation complète VeritasChain..."

# Couleurs pour l'affichage
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Fonction pour afficher les résultats
print_result() {
    if [ $1 -eq 0 ]; then
        echo -e "${GREEN}✅ $2${NC}"
    else
        echo -e "${RED}❌ $2${NC}"
    fi
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

# 1. Vérification de la structure
echo ""
echo "📁 Vérification de la structure..."

# Fichiers essentiels
ESSENTIAL_FILES=(
    "package.json"
    "next.config.ts"
    "vercel.json"
    "env.production.example"
    "app/page.tsx"
    "app/anchor/page.tsx"
    "app/verify/page.tsx"
    "app/docs/page.tsx"
    "lib/contractABI.json"
    "lib/config.ts"
    "lib/hash.ts"
    "lib/pdf.ts"
    "lib/blockchain.ts"
    "components/ui/button.tsx"
    "components/ui/card.tsx"
)

for file in "${ESSENTIAL_FILES[@]}"; do
    if [ -f "$file" ]; then
        print_result 0 "Fichier $file présent"
    else
        print_result 1 "Fichier $file manquant"
    fi
done

# 2. Vérification du build
echo ""
echo "🔨 Test du build de production..."

if npm run build > /dev/null 2>&1; then
    print_result 0 "Build de production réussi"
else
    print_result 1 "Build de production échoué"
    print_warning "Consultez les logs pour plus de détails"
fi

# 3. Vérification des variables d'environnement
echo ""
echo "🔧 Vérification de la configuration..."

# Vérifier que les fichiers de config existent
if [ -f "env.production.example" ]; then
    print_result 0 "Template de variables d'environnement présent"
    
    # Vérifier les variables critiques
    if grep -q "NEXT_PUBLIC_RPC_URL" env.production.example; then
        print_result 0 "NEXT_PUBLIC_RPC_URL défini"
    else
        print_result 1 "NEXT_PUBLIC_RPC_URL manquant"
    fi
    
    if grep -q "CONTRACT_ADDRESS" env.production.example; then
        print_result 0 "CONTRACT_ADDRESS défini"
    else
        print_result 1 "CONTRACT_ADDRESS manquant"
    fi
    
    if grep -q "PRIVATE_KEY" env.production.example; then
        print_result 0 "PRIVATE_KEY défini"
    else
        print_result 1 "PRIVATE_KEY manquant"
    fi
else
    print_result 1 "Template de variables d'environnement manquant"
fi

# 4. Vérification de la configuration Vercel
echo ""
echo "🚀 Vérification de la configuration Vercel..."

if [ -f "vercel.json" ]; then
    print_result 0 "Configuration Vercel présente"
    
    if grep -q "nextjs" vercel.json; then
        print_result 0 "Framework Next.js configuré"
    else
        print_result 1 "Framework Next.js non configuré"
    fi
    
    if grep -q "NEXT_PUBLIC_CONTRACT_ADDRESS" vercel.json; then
        print_result 0 "Variables d'environnement Vercel définies"
    else
        print_result 1 "Variables d'environnement Vercel manquantes"
    fi
else
    print_result 1 "Configuration Vercel manquante"
fi

# 5. Vérification du contrat
echo ""
echo "📄 Vérification du contrat..."

if [ -f "lib/contractABI.json" ]; then
    print_result 0 "ABI du contrat présent"
    
    if grep -q "anchor" lib/contractABI.json; then
        print_result 0 "Fonction anchor présente dans l'ABI"
    else
        print_result 1 "Fonction anchor manquante dans l'ABI"
    fi
    
    if grep -q "verify" lib/contractABI.json; then
        print_result 0 "Fonction verify présente dans l'ABI"
    else
        print_result 1 "Fonction verify manquante dans l'ABI"
    fi
else
    print_result 1 "ABI du contrat manquant"
fi

# 6. Vérification des pages
echo ""
echo "📱 Vérification des pages..."

PAGES=("app/page.tsx" "app/anchor/page.tsx" "app/verify/page.tsx" "app/docs/page.tsx")

for page in "${PAGES[@]}"; do
    if [ -f "$page" ]; then
        print_result 0 "Page $page présente"
    else
        print_result 1 "Page $page manquante"
    fi
done

# 7. Vérification des composants UI
echo ""
echo "🎨 Vérification des composants UI..."

UI_COMPONENTS=("components/ui/button.tsx" "components/ui/card.tsx")

for component in "${UI_COMPONENTS[@]}"; do
    if [ -f "$component" ]; then
        print_result 0 "Composant $component présent"
    else
        print_result 1 "Composant $component manquant"
    fi
done

# 8. Vérification des utilitaires
echo ""
echo "🔧 Vérification des utilitaires..."

UTILS=("lib/hash.ts" "lib/pdf.ts" "lib/blockchain.ts" "lib/config.ts")

for util in "${UTILS[@]}"; do
    if [ -f "$util" ]; then
        print_result 0 "Utilitaire $util présent"
    else
        print_result 1 "Utilitaire $util manquant"
    fi
done

# 9. Résumé final
echo ""
echo "📊 RÉSUMÉ DE LA VALIDATION"
echo "=========================="

# Compter les fichiers présents
TOTAL_FILES=$(echo "${ESSENTIAL_FILES[@]}" | wc -w)
PRESENT_FILES=0

for file in "${ESSENTIAL_FILES[@]}"; do
    if [ -f "$file" ]; then
        ((PRESENT_FILES++))
    fi
done

PERCENTAGE=$((PRESENT_FILES * 100 / TOTAL_FILES))

echo ""
print_info "Fichiers présents: $PRESENT_FILES/$TOTAL_FILES ($PERCENTAGE%)"

if [ $PERCENTAGE -ge 90 ]; then
    print_result 0 "Application prête pour le déploiement !"
elif [ $PERCENTAGE -ge 70 ]; then
    print_warning "Application presque prête, quelques fichiers manquants"
else
    print_result 1 "Application non prête, fichiers critiques manquants"
fi

echo ""
echo "🚀 PROCHAINES ÉTAPES:"
echo "1. Configurez Infura (https://infura.io)"
echo "2. Déployez sur Vercel (https://vercel.com)"
echo "3. Configurez MetaMask avec Sepolia"
echo "4. Testez l'ancrage et la vérification"
echo ""
echo "📖 Consultez DEPLOYMENT_FINAL.md pour plus de détails"




