# VeritasChain - Proof of Document Anchoring

![VeritasChain Logo](https://img.shields.io/badge/VeritasChain-Proof%20of%20Document%20Anchoring-blue)
![Next.js](https://img.shields.io/badge/Next.js-15.5.6-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)
![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-4.0-38B2AC)
![Ethereum](https://img.shields.io/badge/Ethereum-Sepolia-627EEA)

## 🎯 Vue d'ensemble

VeritasChain est une **dApp (application décentralisée)** qui permet d'ancrer des documents sur la blockchain Ethereum pour créer des preuves d'existence immuables et vérifiables. Seul le hash SHA-256 du document est stocké sur la blockchain, garantissant la confidentialité totale.

## ✨ Fonctionnalités

### 🔐 Sécurité et Confidentialité
- **Hash local** : Calcul SHA-256 côté client avec WebCrypto
- **Aucun stockage** : Le fichier original ne quitte jamais votre ordinateur
- **Blockchain immuable** : Preuve d'existence permanente sur Ethereum
- **Vérification publique** : Toute personne peut vérifier l'authenticité

### 🚀 Fonctionnalités principales
- **Ancrage de documents** : PDF, DOCX, PNG supportés
- **Vérification instantanée** : Upload ou hash direct
- **Certificats PDF** : Génération automatique avec QR code
- **Interface moderne** : Design professionnel avec Tailwind CSS + shadcn/ui
- **Thème sombre/clair** : Support complet des préférences utilisateur
- **Responsive** : Optimisé mobile-first

### 🌐 Blockchain
- **Réseau** : Ethereum Sepolia (testnet)
- **Contrat** : `0x7b7C41cf5bc986F406c7067De6e69f200c27D63f`
- **Wallet** : MetaMask intégration
- **Frais** : ETH de test requis (gratuit)

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    VERITASCHAIN ARCHITECTURE                │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌─────────────────┐    ┌─────────────────┐               │
│  │   FRONTEND      │    │   BACKEND       │               │
│  │   (Next.js)     │    │   (API Routes)  │               │
│  │                 │    │                 │               │
│  │ ┌─────────────┐ │    │ ┌─────────────┐ │               │
│  │ │   /anchor   │ │◄──►│ │ /api/anchor │ │               │
│  │ │   /verify   │ │◄──►│ │ /api/verify │ │               │
│  │ │   /docs     │ │    │ │ /api/pdf    │ │               │
│  │ └─────────────┘ │    │ └─────────────┘ │               │
│  └─────────────────┘    └─────────────────┘               │
│           │                       │                        │
│           │                       │                        │
│           ▼                       ▼                        │
│  ┌─────────────────┐    ┌─────────────────┐               │
│  │   META MASK     │    │   ETHEREUM      │               │
│  │   (Wallet)      │    │   SEPOLIA       │               │
│  │                 │    │                 │               │
│  │ • Signature     │    │ • Smart Contract│               │
│  │ • Transactions  │    │ • Immutable     │               │
│  │ • Account       │    │ • Verification  │               │
│  └─────────────────┘    └─────────────────┘               │
└─────────────────────────────────────────────────────────────┘
```

## 🚀 Installation et Démarrage

### Prérequis
- Node.js 18+ 
- npm ou yarn
- MetaMask installé
- ETH de test Sepolia

### 1. Cloner le projet
```bash
git clone <repository-url>
cd veritaschain/web
```

### 2. Installer les dépendances
```bash
npm install
```

### 3. Configuration des variables d'environnement
Créez un fichier `.env.local` :
```bash
# Site
NEXT_PUBLIC_SITE_URL=http://localhost:3000

# Blockchain (remplacez par vos vraies valeurs)
NEXT_PUBLIC_RPC_URL=https://sepolia.infura.io/v3/VOTRE_PROJECT_ID
RPC_URL=https://sepolia.infura.io/v3/VOTRE_PROJECT_ID
PRIVATE_KEY=0xVOTRE_CLE_PRIVEE_METAMASK

# Instructions :
# 1. Créez un compte sur https://infura.io
# 2. Créez un projet et sélectionnez "Sepolia"
# 3. Copiez l'URL RPC dans NEXT_PUBLIC_RPC_URL et RPC_URL
# 4. Exportez votre clé privée MetaMask (Settings > Security > Export Private Key)
# 5. Collez-la dans PRIVATE_KEY (sans les espaces)
```

### 4. Démarrer l'application
```bash
npm run dev
```

L'application sera disponible sur `http://localhost:3000`

## 📖 Guide d'utilisation

### 1. Ancrer un document
1. Allez sur `/anchor`
2. Sélectionnez votre fichier (PDF, DOCX, PNG)
3. Le hash SHA-256 est calculé automatiquement
4. Connectez MetaMask au réseau Sepolia
5. Cliquez sur "Ancrer sur la Blockchain"
6. Signez la transaction dans MetaMask
7. Téléchargez le certificat PDF

### 2. Vérifier un document
1. Allez sur `/verify`
2. **Option A** : Uploadez le fichier original
3. **Option B** : Collez le hash directement
4. Cliquez sur "Vérifier"
5. Consultez le résultat : ✅ Ancré ou ❌ Non trouvé

### 3. Comprendre le système
- Visitez `/docs` pour une explication complète
- Découvrez le principe du SHA-256
- Apprenez comment fonctionne l'ancrage blockchain
- Comprenez la confidentialité garantie

## 🛠️ Structure du projet

```
web/
├── app/                    # Pages Next.js App Router
│   ├── anchor/            # Page d'ancrage
│   ├── verify/            # Page de vérification
│   ├── docs/              # Documentation
│   ├── api/               # API Routes
│   │   ├── anchor/        # API d'ancrage
│   │   ├── verify/        # API de vérification
│   │   ├── pdf/           # Génération PDF
│   │   └── health/        # Tests de santé
│   └── layout.tsx         # Layout global
├── components/            # Composants React
│   ├── ui/                # Composants UI (shadcn/ui)
│   ├── layout/            # NavBar, Footer
│   └── ...                # Autres composants
├── lib/                   # Utilitaires et logique métier
│   ├── blockchain.ts      # Interactions blockchain
│   ├── hash.ts           # Calculs SHA-256
│   ├── pdf.ts            # Génération PDF
│   ├── web3.ts           # Intégration MetaMask
│   └── config.ts         # Configuration centralisée
├── styles/               # Styles globaux
└── tests/               # Tests unitaires
```

## 🔧 Technologies utilisées

### Frontend
- **Next.js 15.5.6** - Framework React avec App Router
- **TypeScript** - Typage statique
- **Tailwind CSS 4.0** - Framework CSS utilitaire
- **shadcn/ui** - Composants UI modernes
- **next-themes** - Support thème sombre/clair
- **sonner** - Notifications toast

### Blockchain
- **viem** - Client Ethereum TypeScript
- **MetaMask** - Wallet integration
- **Ethereum Sepolia** - Réseau de test

### Backend
- **Next.js API Routes** - API serverless
- **Zod** - Validation de schémas
- **PDFKit** - Génération PDF
- **QRCode** - Génération QR codes

### Outils
- **Vitest** - Tests unitaires
- **ESLint** - Linting
- **PostCSS** - Traitement CSS

## 🧪 Tests

```bash
# Tests unitaires
npm run test

# Tests spécifiques
npm test api.anchor.test.ts
npm test api.verify.test.ts

# Test de santé PDF
curl http://localhost:3000/api/health/pdf
```

## 🚀 Déploiement

### Vercel (Recommandé)
1. Connectez votre repo GitHub à Vercel
2. Configurez les variables d'environnement
3. Déployez automatiquement

### Docker
```bash
# Build
docker build -t veritaschain .

# Run
docker run -p 3000:3000 veritaschain
```

## 🔒 Sécurité

- ✅ **Hash local** : Aucun fichier envoyé au serveur
- ✅ **Validation Zod** : Tous les inputs validés
- ✅ **Rate limiting** : Protection contre les abus
- ✅ **Variables d'environnement** : Clés privées sécurisées
- ✅ **HTTPS** : Communication chiffrée en production

## 🤝 Contribution

1. Fork le projet
2. Créez une branche feature (`git checkout -b feature/AmazingFeature`)
3. Committez vos changements (`git commit -m 'Add some AmazingFeature'`)
4. Push vers la branche (`git push origin feature/AmazingFeature`)
5. Ouvrez une Pull Request

## 📄 Licence

Ce projet est sous licence MIT. Voir le fichier `LICENSE` pour plus de détails.

## 🆘 Support

- **Documentation** : `/docs` dans l'application
- **Issues** : GitHub Issues
- **Contact** : [Votre email]

## 🗺️ Roadmap

### Phase 1 : Stabilisation (1-2 semaines)
- [ ] Tests de bout en bout complets
- [ ] Déploiement production
- [ ] Documentation API

### Phase 2 : Améliorations UX (2-3 semaines)
- [ ] Batch upload
- [ ] Historique des ancrages
- [ ] Notifications push
- [ ] Animations avancées

### Phase 3 : Fonctionnalités métier (3-4 semaines)
- [ ] Authentification MetaMask
- [ ] Dashboard utilisateur
- [ ] Templates de certificats
- [ ] API publique

### Phase 4 : Scaling (4-6 semaines)
- [ ] Base de données PostgreSQL
- [ ] Cache Redis
- [ ] Monitoring complet
- [ ] Audit de sécurité

### Phase 5 : Évolution (6+ semaines)
- [ ] Support multi-chaînes (Polygon, Arbitrum)
- [ ] NFTs des certificats
- [ ] Marketplace
- [ ] Solution white-label

---

**VeritasChain** - *Proof of Document Anchoring on Ethereum* 🚀