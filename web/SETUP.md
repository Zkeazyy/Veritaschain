# 🚀 Guide de Configuration Rapide - VeritasChain

## ⚡ Démarrage en 5 minutes

### 1. Prérequis
- ✅ Node.js 18+ installé
- ✅ MetaMask installé dans votre navigateur
- ✅ Compte Infura créé (gratuit)

### 2. Installation
```bash
cd web
npm install
```

### 3. Configuration Infura (2 minutes)
1. Allez sur [infura.io](https://infura.io)
2. Créez un compte gratuit
3. Créez un nouveau projet
4. Sélectionnez "Ethereum" → "Sepolia"
5. Copiez l'URL RPC (format : `https://sepolia.infura.io/v3/VOTRE_PROJECT_ID`)

### 4. Configuration MetaMask
1. Ouvrez MetaMask
2. Ajoutez le réseau Sepolia :
   - **Nom** : Sepolia Test Network
   - **RPC URL** : `https://sepolia.infura.io/v3/VOTRE_PROJECT_ID`
   - **Chain ID** : `11155111`
   - **Symbole** : `ETH`
   - **Explorer** : `https://sepolia.etherscan.io`

### 5. Obtenir des ETH de test
1. Allez sur [sepoliafaucet.com](https://sepoliafaucet.com)
2. Entrez votre adresse MetaMask
3. Demandez des ETH de test (gratuit)

### 6. Configuration .env.local
Créez le fichier `web/.env.local` :
```bash
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NEXT_PUBLIC_RPC_URL=https://sepolia.infura.io/v3/VOTRE_PROJECT_ID_INFURA
RPC_URL=https://sepolia.infura.io/v3/VOTRE_PROJECT_ID_INFURA
PRIVATE_KEY=0xVOTRE_CLE_PRIVEE_METAMASK
```

**⚠️ Important :** Remplacez `VOTRE_PROJECT_ID_INFURA` et `VOTRE_CLE_PRIVEE_METAMASK` par vos vraies valeurs.

### 7. Démarrer l'application
```bash
npm run dev
```

### 8. Test rapide
1. Ouvrez `http://localhost:3000`
2. Allez sur `/anchor`
3. Sélectionnez un fichier PDF
4. Connectez MetaMask
5. Ancrez le document
6. Téléchargez le certificat PDF

## 🔧 Dépannage

### Erreur "Configuration serveur incomplète"
- Vérifiez que `.env.local` existe et contient toutes les variables
- Redémarrez le serveur après modification

### Erreur MetaMask "User rejected"
- Vérifiez que vous êtes sur le réseau Sepolia
- Assurez-vous d'avoir des ETH de test

### Erreur "Network error"
- Vérifiez votre URL RPC Infura
- Testez la connexion : `curl https://sepolia.infura.io/v3/VOTRE_PROJECT_ID`

### Erreur "Hash invalide"
- Vérifiez que le fichier est bien un PDF/DOCX/PNG
- Taille max : 10MB

## 📞 Support

- **Documentation complète** : `/docs` dans l'app
- **Tests de santé** : `http://localhost:3000/api/health/pdf`
- **Issues GitHub** : [Créer une issue]

---

**🎉 Félicitations !** Votre instance VeritasChain est maintenant opérationnelle.
