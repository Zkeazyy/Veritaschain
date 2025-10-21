# VeritasChain - Guide de Développement

## Contexte du Projet

VeritasChain est une application Web3 pour l'ancrage de documents sur la blockchain Ethereum (réseau Sepolia). Le projet permet de :

1. **Ancrer des documents** : Calculer le hash SHA-256 d'un fichier et l'enregistrer sur la blockchain
2. **Vérifier des documents** : Vérifier si un hash existe sur la blockchain et récupérer les métadonnées
3. **Générer des certificats** : Créer des PDFs certifiant l'ancrage blockchain

## Architecture Technique

### Smart Contract
- **DocumentRegistry** : Contrat Solidity déployé sur Sepolia
- Fonctions : `anchor(bytes32)`, `verify(bytes32)`, `anchorBatch(bytes32[])`
- Adresse : `0x7b7C41cf5bc986F406c7067De6e69f200c27D63f`

### Frontend (Next.js)
- **Framework** : Next.js 14+ avec App Router
- **Styling** : Tailwind CSS
- **Blockchain** : viem pour l'interaction Ethereum
- **Validation** : Zod pour la validation des données
- **PDF** : pdfkit + qrcode pour les certificats

### Structure des Dossiers

```
web/
├── src/
│   ├── app/                 # Pages Next.js (App Router)
│   │   ├── layout.tsx       # Layout principal
│   │   ├── page.tsx         # Page d'accueil
│   │   ├── anchor/          # Page d'ancrage
│   │   ├── verify/          # Page de vérification
│   │   └── api/             # Routes API
│   │       ├── anchor/      # POST /api/anchor
│   │       ├── verify/      # POST /api/verify
│   │       ├── pdf/         # POST /api/pdf
│   │       └── health/      # GET /api/health
│   ├── components/          # Composants React
│   │   ├── FileUploader.tsx
│   │   └── WalletConnectButton.tsx
│   ├── lib/                 # Logique métier
│   │   ├── config.ts        # Configuration centrale
│   │   ├── contractABI.json # ABI du contrat
│   │   ├── blockchain.ts    # Interactions blockchain
│   │   ├── hash.ts          # Calcul SHA-256
│   │   └── pdf.ts           # Génération PDF
│   └── styles/
│       └── globals.css      # Styles globaux
├── .env.local               # Variables d'environnement
├── prompts.md              # Ce fichier
└── README.md               # Documentation utilisateur
```

## Variables d'Environnement

### Côté Serveur (API Routes)
```bash
SEPOLIA_RPC_URL=https://sepolia.infura.io/v3/YOUR_PROJECT_ID
PRIVATE_KEY=0x1234567890abcdef...
CONTRACT_ADDRESS=0x7b7C41cf5bc986F406c7067De6e69f200c27D63f
```

### Côté Client (Browser)
```bash
NEXT_PUBLIC_CONTRACT_ADDRESS=0x7b7C41cf5bc986F406c7067De6e69f200c27D63f
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

## APIs Disponibles

### POST /api/anchor
Ancre un hash de document sur la blockchain.

**Body :**
```json
{
  "hash": "0x1234...",
  "fileName": "document.pdf"
}
```

**Response :**
```json
{
  "txHash": "0xabcd...",
  "author": "0x5678...",
  "timestamp": 1234567890
}
```

### POST /api/verify
Vérifie si un hash existe sur la blockchain.

**Body :**
```json
{
  "hash": "0x1234..."
}
```

**Response :**
```json
{
  "exists": true,
  "author": "0x5678...",
  "timestamp": 1234567890,
  "etherscanContractUrl": "https://sepolia.etherscan.io/address/..."
}
```

### POST /api/pdf
Génère un certificat PDF.

**Body :**
```json
{
  "fileName": "document.pdf",
  "hash": "0x1234...",
  "txHash": "0xabcd...",
  "contract": "0x5678...",
  "author": "0x9abc...",
  "timestamp": 1234567890
}
```

**Response :** Fichier PDF en téléchargement

## Sécurité

### Protection des Clés Privées
- `PRIVATE_KEY` est utilisé UNIQUEMENT côté serveur (API routes)
- Jamais exposé dans le code client ou les réponses API
- Stocké dans `.env.local` (non versionné)

### Validation des Données
- Tous les inputs sont validés avec Zod
- Format des hashes : `0x` + 64 caractères hexadécimaux
- Limitation de taille des fichiers : 10MB max
- Types de fichiers autorisés : PDF, DOCX, PNG

### Rate Limiting
- Limite : 30 requêtes par 5 minutes par IP
- Protection contre les abus et attaques DDoS

## Développement

### Commandes Disponibles
```bash
npm run dev          # Serveur de développement
npm run build        # Build de production
npm run start        # Serveur de production
npm run test         # Tests unitaires (Vitest)
npm run lint         # Linting ESLint
```

### Tests
- Tests unitaires avec Vitest
- Mocking des appels blockchain
- Tests des routes API

### Déploiement
- Dockerfile inclus pour containerisation
- docker-compose.yml pour orchestration
- Health checks intégrés

## Erreurs Courantes

### "Configuration serveur incomplète"
- Vérifier que toutes les variables d'environnement sont définies
- S'assurer que `.env.local` existe et est correctement configuré

### "Réseau indisponible"
- Vérifier la connectivité RPC (SEPOLIA_RPC_URL)
- S'assurer que le provider RPC est opérationnel

### "Hash invalide"
- Vérifier le format : `0x` + 64 caractères hexadécimaux
- S'assurer que le hash est calculé avec SHA-256

### "Already anchored"
- Le document a déjà été ancré sur la blockchain
- Un hash ne peut être ancré qu'une seule fois

## Bonnes Pratiques

1. **Toujours valider les inputs** avec Zod
2. **Ne jamais exposer les clés privées** côté client
3. **Gérer les erreurs réseau** avec des messages clairs
4. **Utiliser le rate limiting** pour éviter les abus
5. **Tester les APIs** avant le déploiement
6. **Documenter les changements** dans ce fichier

## Support

Pour toute question ou problème :
1. Vérifier ce fichier `prompts.md`
2. Consulter les logs du serveur
3. Tester les APIs individuellement
4. Vérifier la configuration d'environnement
