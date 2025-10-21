# 🔗 Configuration MetaMask pour VeritasChain

## 📋 **ÉTAPES DE CONFIGURATION**

### **1. Installation MetaMask**
- Téléchargez sur [metamask.io](https://metamask.io)
- Créez un nouveau wallet ou importez un existant
- **⚠️ IMPORTANT** : Sauvegardez votre phrase de récupération

### **2. Ajout du réseau Sepolia**

#### **Méthode automatique :**
1. Ouvrez MetaMask
2. Cliquez sur le réseau actuel (en haut)
3. "Add network" → "Add a network manually"
4. Remplissez :

```
Network Name: Sepolia Test Network
RPC URL: https://sepolia.infura.io/v3/VOTRE_PROJECT_ID_INFURA
Chain ID: 11155111
Currency Symbol: ETH
Block Explorer URL: https://sepolia.etherscan.io
```

#### **Méthode via le site :**
1. Allez sur [chainlist.org](https://chainlist.org)
2. Recherchez "Sepolia"
3. Cliquez sur "Add to MetaMask"

### **3. Obtenir des ETH de test**

#### **Faucets recommandés :**
- **Sepolia Faucet** : [sepoliafaucet.com](https://sepoliafaucet.com)
- **Alchemy Faucet** : [sepoliafaucet.xyz](https://sepoliafaucet.xyz)
- **Infura Faucet** : [infura.io/faucet/sepolia](https://infura.io/faucet/sepolia)

#### **Processus :**
1. Copiez votre adresse MetaMask (0x...)
2. Collez dans le faucet
3. Résolvez le captcha
4. Attendez 1-2 minutes
5. Vérifiez votre balance MetaMask

### **4. Configuration du contrat**

#### **Informations du contrat :**
- **Adresse** : `0x7b7C41cf5bc986F406c7067De6e69f200c27D63f`
- **Réseau** : Sepolia (Chain ID: 11155111)
- **Type** : Smart Contract VeritasChain

#### **Vérification sur Etherscan :**
1. Allez sur [sepolia.etherscan.io](https://sepolia.etherscan.io)
2. Recherchez : `0x7b7C41cf5bc986F406c7067De6e69f200c27D63f`
3. Vérifiez que le contrat est bien déployé

## 🧪 **TESTS D'INTERACTION**

### **1. Test de connexion**
1. Ouvrez VeritasChain
2. Cliquez sur "Connect Wallet"
3. Sélectionnez MetaMask
4. Approuvez la connexion
5. ✅ Vérifiez que votre adresse s'affiche

### **2. Test d'ancrage**
1. Allez sur `/anchor`
2. Uploadez un fichier PDF
3. Cliquez sur "Ancrer"
4. MetaMask s'ouvre automatiquement
5. Vérifiez les détails :
   - **To** : `0x7b7C41cf5bc986F406c7067De6e69f200c27D63f`
   - **Network** : Sepolia
   - **Gas** : ~50,000 (estimé)
6. Confirmez la transaction
7. Attendez la confirmation (1-2 minutes)

### **3. Test de vérification**
1. Allez sur `/verify`
2. Uploadez le même fichier
3. Cliquez sur "Vérifier"
4. ✅ Le statut doit être "Document ancré"
5. Vérifiez les informations :
   - Auteur (votre adresse)
   - Timestamp (date d'ancrage)
   - Lien Etherscan

## 🔍 **VÉRIFICATION BLOCKCHAIN**

### **1. Transaction sur Etherscan**
1. Copiez le hash de transaction
2. Allez sur [sepolia.etherscan.io](https://sepolia.etherscan.io)
3. Recherchez le hash
4. Vérifiez :
   - Status : Success ✅
   - From : Votre adresse
   - To : `0x7b7C41cf5bc986F406c7067De6e69f200c27D63f`
   - Method : `anchor(bytes32)`

### **2. Événements du contrat**
1. Dans Etherscan, cliquez sur "Events"
2. Recherchez l'événement `DocumentAnchored`
3. Vérifiez :
   - `docHash` : Le hash de votre fichier
   - `author` : Votre adresse
   - `timestamp` : Date d'ancrage

### **3. État du contrat**
1. Cliquez sur "Contract" → "Read Contract"
2. Utilisez la fonction `verify`
3. Entrez votre hash de document
4. Vérifiez que les données correspondent

## ⚠️ **DÉPANNAGE**

### **Erreur "Wrong Network"**
- Vérifiez que vous êtes sur Sepolia
- Changez de réseau dans MetaMask

### **Erreur "Insufficient Funds"**
- Obtenez plus d'ETH de test
- Vérifiez votre balance

### **Erreur "Transaction Failed"**
- Vérifiez le gas limit
- Réessayez la transaction
- Vérifiez la connexion réseau

### **Erreur "Contract Not Found"**
- Vérifiez l'adresse du contrat
- Vérifiez que vous êtes sur Sepolia
- Vérifiez que le contrat est déployé

## 📊 **MONITORING**

### **1. Métriques importantes**
- **Gas utilisé** : ~50,000 par ancrage
- **Temps de confirmation** : 1-2 minutes
- **Coût** : Gratuit (ETH de test)

### **2. Logs utiles**
- Console MetaMask
- Console navigateur (F12)
- Logs Vercel (si déployé)

### **3. Alertes**
- Transactions en attente
- Échecs de transaction
- Changements de réseau

---

**🎯 Une fois configuré, MetaMask interagira automatiquement avec VeritasChain !**
