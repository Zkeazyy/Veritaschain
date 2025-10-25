# 🪙 Veritas Token (VTS)

Token ERC-20 officiel de l'écosystème VeritasChain, déployé sur Ethereum, Base et Polygon.

## 📋 Prérequis

- **Node.js** >= 18.0.0 (LTS recommandé)
- **npm** ou **pnpm** ou **yarn**
- **Git**

## 🚀 Installation

1. **Cloner le repository**
   ```bash
   git clone <repository-url>
   cd vts-token
   ```

2. **Installer les dépendances**
   ```bash
   npm install
   ```

3. **Configuration de l'environnement**
   ```bash
   cp env.sample .env
   ```
   
   Remplissez le fichier `.env` avec vos clés :
   - `PRIVATE_KEY` : Votre clé privée (sans 0x)
   - `SEPOLIA_RPC_URL` : URL RPC pour Sepolia
   - `BASE_RPC_URL` : URL RPC pour Base
   - `POLYGON_RPC_URL` : URL RPC pour Polygon
   - `ETHERSCAN_API_KEY` : Clé API Etherscan
   - `BASESCAN_API_KEY` : Clé API Basescan
   - `POLYGONSCAN_API_KEY` : Clé API Polygonscan

## 🧪 Tests

```bash
# Exécuter tous les tests
npm run test

# Tests avec couverture
npx hardhat test --coverage
```

## 🔨 Compilation

```bash
npm run compile
```

## 🚀 Déploiement & Address Logging

### Déploiement sur Sepolia

```bash
npm run deploy:sepolia
# puis
npm run verify:sepolia
```

### Où trouver l'adresse ?

L'adresse du contrat déployé est automatiquement sauvegardée dans `deployments/deployment.json` :

```json
{
  "sepolia": {
    "address": "0x...",
    "txHash": "0x...",
    "blockNumber": 12345678,
    "deployer": "0x...",
    "timestamp": "2025-10-25T12:34:56Z"
  }
}
```

### Copier dans Vercel

Une fois déployé, copiez l'adresse depuis `deployments/deployment.json` et ajoutez-la dans Vercel :

```bash
NEXT_PUBLIC_VTS_CONTRACT_ADDRESS=0x<adresse>
NEXT_PUBLIC_NETWORK=sepolia
```

### Réseaux supportés

- **sepolia** : Testnet Ethereum
- **base** : Mainnet Base  
- **polygon** : Mainnet Polygon

Ajoutez les URLs RPC et clés API dans votre `.env` pour chaque réseau.

## 🚀 Déploiement (Ancien)

## 🔐 Vérification des Contrats

### Méthode 1 : Script personnalisé
```bash
# Sepolia
npx ts-node scripts/verify.ts --network sepolia --address <CONTRACT_ADDRESS>

# Base
npx ts-node scripts/verify.ts --network base --address <CONTRACT_ADDRESS>

# Polygon
npx ts-node scripts/verify.ts --network polygon --address <CONTRACT_ADDRESS>
```

### Méthode 2 : Hardhat directement
```bash
# Sepolia
npm run verify:sepolia <CONTRACT_ADDRESS>

# Base
npm run verify:base <CONTRACT_ADDRESS>

# Polygon
npm run verify:polygon <CONTRACT_ADDRESS>
```

## 🛠️ Tasks Hardhat

### Lister les comptes
```bash
npx hardhat accounts
```

### Vérifier le solde ETH
```bash
npx hardhat balance --address <ADDRESS>
```

### Vérifier le solde VTS
```bash
npx hardhat vts-balance --address <ADDRESS> --contract <CONTRACT_ADDRESS>
```

### Estimation du coût de gas
```bash
npx hardhat run scripts/gas-estimate.ts
```

## 📊 Spécifications du Token

| Propriété | Valeur |
|-----------|--------|
| **Nom** | Veritas Token |
| **Symbole** | VTS |
| **Décimales** | 18 |
| **Supply Total** | 1,000,000 VTS |
| **Type** | ERC-20 |
| **Supply** | Fixe (pas de mint) |

## 🌐 Réseaux Supportés

| Réseau | Type | Chain ID | Explorer |
|--------|------|----------|----------|
| **Sepolia** | Testnet | 11155111 | [Etherscan](https://sepolia.etherscan.io) |
| **Base** | Mainnet | 8453 | [Basescan](https://basescan.org) |
| **Polygon** | Mainnet | 137 | [Polygonscan](https://polygonscan.com) |

## 🔗 Intégration avec VeritasChain

### Variables d'environnement
Ajoutez ces variables à votre `.env` VeritasChain :

```bash
# Token VTS
NEXT_PUBLIC_VTS_CONTRACT_ADDRESS=<CONTRACT_ADDRESS>
NEXT_PUBLIC_VTS_SYMBOL=VTS
NEXT_PUBLIC_VTS_DECIMALS=18

# Réseau (exemple Base)
NEXT_PUBLIC_CHAIN_ID=8453
NEXT_PUBLIC_RPC_URL=https://base-mainnet.g.alchemy.com/v2/YOUR_API_KEY
NEXT_PUBLIC_ETHERSCAN_BASE_URL=https://basescan.org
```

### Ajout dans MetaMask

1. **Ouvrir MetaMask**
2. **Ajouter le réseau** (si nécessaire) :
   - **Base** : [Guide officiel](https://docs.base.org/tools/network-faucets)
   - **Polygon** : [Guide officiel](https://docs.polygon.technology/docs/develop/metamask/config-polygon-on-metamask/)

3. **Ajouter le token VTS** :
   - Cliquer sur "Import tokens"
   - Coller l'adresse du contrat VTS
   - Le symbole et les décimales se remplissent automatiquement

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

## 📈 Coûts de Déploiement (Estimations)

| Réseau | Coût approximatif |
|--------|-------------------|
| **Sepolia** | Gratuit (testnet) |
| **Base** | ~0.001-0.01 USD |
| **Polygon** | ~0.001-0.005 USD |

## 🐛 Dépannage

### Erreur "Insufficient funds"
- Vérifiez que votre compte a suffisamment d'ETH/MATIC
- Utilisez `npx hardhat balance --address <YOUR_ADDRESS>`

### Erreur "Invalid private key"
- Vérifiez que votre clé privée commence par `0x`
- Assurez-vous qu'elle fait 64 caractères hexadécimaux

### Erreur de vérification
- Attendez quelques minutes après le déploiement
- Vérifiez que l'API key est correcte
- Assurez-vous que le contrat est bien déployé

## 📚 Ressources

- [Documentation Hardhat](https://hardhat.org/docs)
- [OpenZeppelin Contracts](https://docs.openzeppelin.com/contracts/)
- [ERC-20 Standard](https://eips.ethereum.org/EIPS/eip-20)
- [Base Documentation](https://docs.base.org/)
- [Polygon Documentation](https://docs.polygon.technology/)

## 🤝 Contribution

1. Fork le projet
2. Créez une branche feature (`git checkout -b feature/AmazingFeature`)
3. Committez vos changements (`git commit -m 'Add some AmazingFeature'`)
4. Push vers la branche (`git push origin feature/AmazingFeature`)
5. Ouvrez une Pull Request

## 📄 Licence

Ce projet est sous licence MIT. Voir le fichier `LICENSE` pour plus de détails.

## 👥 Équipe

Développé par l'équipe VeritasChain.

---

**⚠️ Disclaimer** : Ce token est à des fins éducatives et de développement. Utilisez à vos propres risques.
