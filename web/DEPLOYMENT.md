# 🚀 Guide de Déploiement Vercel - VeritasChain

## 📋 Prérequis

1. ✅ Compte GitHub avec le code VeritasChain
2. ✅ Compte Vercel (gratuit)
3. ✅ Compte Infura configuré
4. ✅ MetaMask avec ETH Sepolia

## 🔧 Configuration Infura

### 1. Créer un projet Infura
1. Allez sur [infura.io](https://infura.io)
2. Créez un compte gratuit
3. Cliquez sur "Create New Project"
4. Nom : `VeritasChain`
5. Sélectionnez "Ethereum"
6. Cliquez sur "Create Project"

### 2. Configurer Sepolia
1. Dans votre projet, cliquez sur "Sepolia"
2. Copiez l'URL RPC (format : `https://sepolia.infura.io/v3/VOTRE_PROJECT_ID`)
3. Gardez cette URL pour la configuration Vercel

## 🚀 Déploiement Vercel

### 1. Connecter GitHub
1. Allez sur [vercel.com](https://vercel.com)
2. Cliquez sur "New Project"
3. Importez votre repository GitHub
4. Sélectionnez le dossier `web` comme root directory

### 2. Configuration du projet
- **Framework Preset** : Next.js
- **Root Directory** : `web`
- **Build Command** : `npm run build`
- **Output Directory** : `.next`

### 3. Variables d'environnement
Dans Vercel, ajoutez ces variables :

```bash
# Site
NEXT_PUBLIC_SITE_URL=https://votre-projet.vercel.app

# Blockchain
NEXT_PUBLIC_RPC_URL=https://sepolia.infura.io/v3/VOTRE_PROJECT_ID_INFURA
RPC_URL=https://sepolia.infura.io/v3/VOTRE_PROJECT_ID_INFURA

# Contract
NEXT_PUBLIC_CONTRACT_ADDRESS=0x7b7C41cf5bc986F406c7067De6e69f200c27D63f
CONTRACT_ADDRESS=0x7b7C41cf5bc986F406c7067De6e69f200c27D63f

# Private Key (pour les transactions serveur)
PRIVATE_KEY=0xVOTRE_CLE_PRIVEE_METAMASK
```

### 4. Déploiement
1. Cliquez sur "Deploy"
2. Attendez la fin du build (2-3 minutes)
3. Votre app sera disponible sur `https://votre-projet.vercel.app`

## 🔐 Configuration MetaMask

### 1. Ajouter le réseau Sepolia
1. Ouvrez MetaMask
2. Cliquez sur le réseau actuel
3. "Add Network" → "Add a network manually"
4. Remplissez :
   - **Network Name** : Sepolia Test Network
   - **RPC URL** : `https://sepolia.infura.io/v3/VOTRE_PROJECT_ID`
   - **Chain ID** : `11155111`
   - **Currency Symbol** : `ETH`
   - **Block Explorer** : `https://sepolia.etherscan.io`

### 2. Obtenir des ETH de test
1. Allez sur [sepoliafaucet.com](https://sepoliafaucet.com)
2. Entrez votre adresse MetaMask
3. Demandez des ETH de test (gratuit)

## ✅ Tests de production

### 1. Test de base
1. Ouvrez votre URL Vercel
2. Vérifiez que la page d'accueil s'affiche
3. Testez la navigation

### 2. Test d'ancrage
1. Allez sur `/anchor`
2. Sélectionnez un fichier PDF
3. Connectez MetaMask
4. Ancrez le document
5. Vérifiez que la transaction apparaît sur Etherscan

### 3. Test de vérification
1. Allez sur `/verify`
2. Uploadez le même fichier
3. Vérifiez que le statut est "✅ Document ancré"

### 4. Test PDF
1. Téléchargez le certificat PDF
2. Vérifiez que le QR code fonctionne
3. Scannez le QR code et vérifiez la redirection

## 🔧 Dépannage

### Erreur "Configuration serveur incomplète"
- Vérifiez que toutes les variables d'environnement sont définies dans Vercel
- Redéployez après modification des variables

### Erreur MetaMask "User rejected"
- Vérifiez que vous êtes sur le réseau Sepolia
- Assurez-vous d'avoir des ETH de test

### Erreur "Network error"
- Vérifiez votre URL RPC Infura
- Testez la connexion : `curl https://sepolia.infura.io/v3/VOTRE_PROJECT_ID`

### Build failed
- Vérifiez les logs de build dans Vercel
- Assurez-vous que `package.json` est correct
- Vérifiez que tous les fichiers sont présents

## 📊 Monitoring

### 1. Analytics Vercel
- Consultez les métriques dans le dashboard Vercel
- Surveillez les erreurs et performances

### 2. Logs
- Consultez les logs de fonction dans Vercel
- Surveillez les erreurs API

### 3. Etherscan
- Surveillez les transactions sur [sepolia.etherscan.io](https://sepolia.etherscan.io)
- Vérifiez l'état du contrat

## 🎯 Prochaines étapes

1. **Custom Domain** : Ajoutez votre propre domaine
2. **Analytics** : Intégrez Google Analytics ou Vercel Analytics
3. **Monitoring** : Ajoutez Sentry pour le monitoring d'erreurs
4. **CDN** : Optimisez les performances avec Vercel Edge Network

---

**🎉 Félicitations !** Votre VeritasChain est maintenant déployé en production !
