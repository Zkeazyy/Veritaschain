#!/bin/bash

# 🧪 Script de test rapide VeritasChain
# Usage: ./test.sh

set -e

echo "🧪 Tests rapides VeritasChain..."

# Vérifier que le serveur est démarré
echo "🔍 Vérification du serveur local..."
if curl -s http://localhost:3000 > /dev/null; then
    echo "✅ Serveur local accessible"
else
    echo "❌ Serveur local non accessible. Démarrez avec: npm run dev"
    exit 1
fi

# Test de la page d'accueil
echo "🏠 Test page d'accueil..."
if curl -s http://localhost:3000 | grep -q "VeritasChain"; then
    echo "✅ Page d'accueil OK"
else
    echo "❌ Page d'accueil KO"
fi

# Test de la page docs
echo "📖 Test page documentation..."
if curl -s http://localhost:3000/docs | grep -q "Comment ça marche"; then
    echo "✅ Page documentation OK"
else
    echo "❌ Page documentation KO"
fi

# Test de la page anchor
echo "⚓ Test page anchor..."
if curl -s http://localhost:3000/anchor | grep -q "Ancrer un Document"; then
    echo "✅ Page anchor OK"
else
    echo "❌ Page anchor KO"
fi

# Test de la page verify
echo "🔍 Test page verify..."
if curl -s http://localhost:3000/verify | grep -q "Vérifier un Document"; then
    echo "✅ Page verify OK"
else
    echo "❌ Page verify KO"
fi

# Test API health PDF
echo "📄 Test API health PDF..."
if curl -s -o /dev/null -w "%{http_code}" http://localhost:3000/api/health/pdf | grep -q "200"; then
    echo "✅ API health PDF OK"
else
    echo "❌ API health PDF KO"
fi

echo ""
echo "🎯 Tests terminés !"
echo ""
echo "📋 Pour tester complètement :"
echo "1. Ouvrez http://localhost:3000"
echo "2. Configurez MetaMask avec Sepolia"
echo "3. Obtenez des ETH de test"
echo "4. Testez l'ancrage et la vérification"
