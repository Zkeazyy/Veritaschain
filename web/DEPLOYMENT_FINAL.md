# 🚀 Guide de déploiement Vercel - VeritasChain

## ✅ **ÉTAPES DE DÉPLOIEMENT**

### **1. Préparation (2 minutes)**
```bash
# Votre application est prête !
# Build testé et fonctionnel ✅
# Configuration Vercel créée ✅
# Variables d'environnement définies ✅
```

### **2. Configuration Infura (5 minutes)**
1. **Créez un compte** sur [infura.io](https://infura.io)
2. **Nouveau projet** → Ethereum → Sepolia
3. **Copiez l'URL RPC** : `https://sepolia.infura.io/v3/VOTRE_PROJECT_ID`

### **3. Déploiement Vercel (10 minutes)**

#### **Option A : Interface Web (Recommandée)**
1. Allez sur [vercel.com](https://vercel.com)
2. **"New Project"** → Importez votre repo GitHub
3. **Root Directory** : `web`
4. **Framework** : Next.js (détecté automatiquement)

#### **Option B : CLI Vercel**
```bash
cd web
npm install -g vercel
vercel --prod
```

### **4. Variables d'environnement Vercel**
Dans **Settings → Environment Variables**, ajoutez :

```bash
# Site
NEXT_PUBLIC_SITE_URL=https://votre-projet.vercel.app

# Blockchain
NEXT_PUBLIC_RPC_URL=https://sepolia.infura.io/v3/VOTRE_PROJECT_ID
RPC_URL=https://sepolia.infura.io/v3/VOTRE_PROJECT_ID

# Contract
NEXT_PUBLIC_CONTRACT_ADDRESS=0x7b7C41cf5bc986F406c7067De6e69f200c27D63f
CONTRACT_ADDRESS=0x7b7C41cf5bc986F406c7067De6e69f200c27D63f

# Chain
NEXT_PUBLIC_CHAIN_ID=11155111
CHAIN_ID=11155111

# Private Key (pour transactions serveur)
PRIVATE_KEY=0xVOTRE_CLE_PRIVEE_METAMASK

# Etherscan
NEXT_PUBLIC_ETHERSCAN_BASE_URL=https://sepolia.etherscan.io
```

### **5. Configuration MetaMask**

#### **Réseau Sepolia :**
- **Nom** : Sepolia Test Network
- **RPC URL** : `https://sepolia.infura.io/v3/VOTRE_PROJECT_ID`
- **Chain ID** : `11155111`
- **Symbole** : `ETH`
- **Explorer** : `https://sepolia.etherscan.io`

#### **ETH de test :**
- Allez sur [sepoliafaucet.com](https://sepoliafaucet.com)
- Entrez votre adresse MetaMask
- Demandez des ETH gratuits

## 🧪 **TESTS DE PRODUCTION**

### **1. Test de base**
- ✅ Page d'accueil s'affiche
- ✅ Navigation fonctionne
- ✅ Pages `/anchor`, `/verify`, `/docs` accessibles

### **2. Test d'ancrage**
- ✅ Upload d'un fichier PDF
- ✅ Connexion MetaMask
- ✅ Transaction signée
- ✅ Confirmation blockchain
- ✅ Téléchargement certificat PDF

### **3. Test de vérification**
- ✅ Upload du même fichier
- ✅ Calcul du hash identique
- ✅ Statut "Document ancré" ✅
- ✅ Informations blockchain affichées

### **4. Test PDF**
- ✅ Certificat téléchargé
- ✅ QR code fonctionnel
- ✅ Liens Etherscan corrects
- ✅ Informations complètes

## 🔗 **LIENS UTILES**

- **Vercel Dashboard** : [vercel.com/dashboard](https://vercel.com/dashboard)
- **Infura Console** : [infura.io/dashboard](https://infura.io/dashboard)
- **Sepolia Faucet** : [sepoliafaucet.com](https://sepoliafaucet.com)
- **Etherscan Sepolia** : [sepolia.etherscan.io](https://sepolia.etherscan.io)
- **Contract Address** : `0x7b7C41cf5bc986F406c7067De6e69f200c27D63f`

## 🎯 **VALIDATION FINALE**

Une fois déployé, votre VeritasChain sera accessible sur :
**`https://votre-projet.vercel.app`**

### **Checklist de validation :**
- [ ] Site accessible et responsive
- [ ] MetaMask se connecte correctement
- [ ] Ancrage de document fonctionne
- [ ] Vérification de document fonctionne
- [ ] Certificat PDF généré correctement
- [ ] QR code redirige vers la page de vérification
- [ ] Transactions visibles sur Etherscan

## 🚀 **PARTAGE**

Une fois validé, partagez votre URL avec :
- Votre équipe
- Vos utilisateurs
- Votre réseau professionnel

**Exemple** : `https://veritaschain.vercel.app`

---

**🎉 Félicitations !** Votre VeritasChain est maintenant déployé en production !
