# 🚀 Guide de Déploiement VTS Token

## 📋 Prérequis

### 1. Wallet avec des fonds
- **Sepolia** : ETH de test (gratuit via faucets)
- **Base** : ETH sur Base (~0.01 ETH suffisant)
- **Polygon** : MATIC sur Polygon (~0.01 MATIC suffisant)

### 2. URLs RPC
- **Infura** : https://infura.io (gratuit)
- **Alchemy** : https://alchemy.com (gratuit)
- **QuickNode** : https://quicknode.com (gratuit)

### 3. Clés API pour vérification
- **Etherscan** : https://etherscan.io/apis
- **Basescan** : https://basescan.org/apis
- **Polygonscan** : https://polygonscan.com/apis

## 🔧 Configuration

### 1. Créer le fichier .env
```bash
# Clé privée de votre wallet (SANS 0x si elle n'en a pas)
PRIVATE_KEY=0x<votre_clé_privée>

# URLs RPC
SEPOLIA_RPC_URL=https://sepolia.infura.io/v3/YOUR_PROJECT_ID
BASE_RPC_URL=https://base-mainnet.g.alchemy.com/v2/YOUR_API_KEY
POLYGON_RPC_URL=https://polygon-mainnet.g.alchemy.com/v2/YOUR_API_KEY

# Clés API pour vérification
ETHERSCAN_API_KEY=YOUR_ETHERSCAN_API_KEY
BASESCAN_API_KEY=YOUR_BASESCAN_API_KEY
POLYGONSCAN_API_KEY=YOUR_POLYGONSCAN_API_KEY
```

### 2. Vérifier la configuration
```bash
npx hardhat run scripts/deploy-demo.ts
```

## 🚀 Déploiement

### Option 1 : Sepolia (Testnet) - RECOMMANDÉ POUR COMMENCER
```bash
# Déploiement
npx hardhat run scripts/deploy.ts --network sepolia

# Notez l'adresse du contrat affichée, puis vérifiez
npx hardhat verify --network sepolia <ADRESSE_CONTRAT>
```

### Option 2 : Base (Mainnet)
```bash
# Déploiement
npx hardhat run scripts/deploy.ts --network base

# Vérification
npx hardhat verify --network base <ADRESSE_CONTRAT>
```

### Option 3 : Polygon (Mainnet)
```bash
# Déploiement
npx hardhat run scripts/deploy.ts --network polygon

# Vérification
npx hardhat verify --network polygon <ADRESSE_CONTRAT>
```

## 📊 Exemple de sortie de déploiement

```
🚀 Déploiement du Veritas Token (VTS)...
📝 Déploiement avec le compte: 0x1234...5678
💰 Solde du compte: 0.1 ETH
📦 Déploiement du contrat VTS...
✅ VTS Token déployé avec succès!
📍 Adresse du contrat: 0xABCD...EFGH

📊 Informations du Token:
   Nom: Veritas Token
   Symbole: VTS
   Décimales: 18
   Supply total: 1000000.0 VTS
   Balance déployeur: 1000000.0 VTS

🌐 Réseau: sepolia (Chain ID: 11155111)
🔍 Explorer: https://sepolia.etherscan.io/address/0xABCD...EFGH

🔐 Pour vérifier le contrat:
npx hardhat verify --network sepolia 0xABCD...EFGH
```

## 🔗 Intégration dans VeritasChain

### 1. Mettre à jour .env.local
```bash
# Ajoutez l'adresse du contrat déployé
NEXT_PUBLIC_VTS_CONTRACT_ADDRESS=0xABCD...EFGH
NEXT_PUBLIC_NETWORK=sepolia  # ou base/polygon
```

### 2. Redémarrer l'application
```bash
npm run dev
```

### 3. Tester l'intégration
- Visitez `/vts-test` pour tester les composants
- Connectez MetaMask sur le bon réseau
- Vérifiez l'affichage du solde VTS

## 🧪 Tests post-déploiement

### 1. Vérifier le contrat sur l'explorer
- Visitez l'URL de l'explorer affichée
- Vérifiez que le contrat est vérifié
- Consultez les détails du token

### 2. Tester les fonctions ERC-20
```bash
# Vérifier le solde du déployeur
npx hardhat vts-balance --address <ADRESSE_DEPLOYEUR> --contract <ADRESSE_CONTRAT>

# Vérifier les métadonnées
npx hardhat run scripts/verify-metadata.ts --network sepolia
```

### 3. Tester dans VeritasChain
- Connectez MetaMask sur le bon réseau
- Visitez `/vts-test`
- Vérifiez l'affichage du solde
- Testez les réductions sur les prix

## 🐛 Dépannage

### Erreur "Insufficient funds"
- Vérifiez que votre wallet a suffisamment de fonds
- Pour Sepolia, utilisez un faucet pour obtenir des ETH de test

### Erreur "Invalid private key"
- Vérifiez que votre clé privée commence par `0x`
- Assurez-vous qu'elle fait 64 caractères hexadécimaux

### Erreur de vérification
- Attendez quelques minutes après le déploiement
- Vérifiez que l'API key est correcte
- Assurez-vous que le contrat est bien déployé

### Module VTS ne fonctionne pas
- Vérifiez `NEXT_PUBLIC_VTS_CONTRACT_ADDRESS` dans .env.local
- Redémarrez le serveur de développement
- Vérifiez que vous êtes sur le bon réseau

## 📈 Coûts de déploiement

| Réseau | Coût approximatif | Temps de confirmation |
|--------|-------------------|----------------------|
| **Sepolia** | Gratuit | ~15 secondes |
| **Base** | ~0.001-0.01 USD | ~2 secondes |
| **Polygon** | ~0.001-0.005 USD | ~2 secondes |

## 🔒 Sécurité

### ⚠️ **IMPORTANT** ⚠️
- **NE JAMAIS** commiter votre clé privée
- **NE JAMAIS** partager votre fichier `.env`
- **TOUJOURS** tester sur un testnet avant le mainnet
- **VÉRIFIER** les adresses de contrat avant utilisation

### Bonnes pratiques
1. **Utilisez un wallet dédié** pour le déploiement
2. **Testez d'abord sur Sepolia**
3. **Vérifiez les contrats** après déploiement
4. **Gardez des sauvegardes** des adresses de contrat

## 📞 Support

Pour toute question ou problème :
1. Vérifiez ce guide
2. Consultez les logs de la console
3. Testez sur `/vts-test`
4. Contactez l'équipe de développement

---

**✅ Une fois déployé, votre token VTS sera intégré dans VeritasChain !**
