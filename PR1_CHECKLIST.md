# 🔧 PR 1: NORMALISATION ENV + FIX BUILD MINIMAL

## 📋 **CHECKLIST DE PATCH**

### **1. Variables d'environnement critiques**

#### **✅ À configurer immédiatement :**
- [ ] **NEXT_PUBLIC_RPC_URL** → Remplacer `VOTRE_PROJECT_ID` par vraie URL Infura/Alchemy
- [ ] **PRIVATE_KEY** → Ajouter clé privée MetaMask (optionnel mais recommandé)

#### **✅ Variables déjà correctes :**
- [x] **NEXT_PUBLIC_CONTRACT_ADDRESS** → `0x7b7C41cf5bc986F406c7067De6e69f200c27D63f`
- [x] **NEXT_PUBLIC_CHAIN_ID** → `11155111` (Sepolia)
- [x] **NEXT_PUBLIC_SITE_URL** → `http://localhost:3000` (local)
- [x] **NEXT_PUBLIC_ETHERSCAN_BASE_URL** → `https://sepolia.etherscan.io`

### **2. Configuration Vercel**

#### **✅ À ajuster dans Vercel Dashboard :**
- [ ] **Environment Variables** → Ajouter toutes les variables NEXT_PUBLIC_*
- [ ] **Build Command** → Vérifier `npm run build`
- [ ] **Output Directory** → Vérifier `.next`

#### **✅ Configuration déjà correcte :**
- [x] **Framework** → `nextjs`
- [x] **Node.js Version** → `18.x` (par défaut)
- [x] **Functions** → `maxDuration: 30s`

### **3. Sécurité**

#### **✅ À implémenter :**
- [ ] **Validation Zod** sur `/api/anchor` et `/api/verify`
- [ ] **Rate limiting** sur les API routes
- [ ] **Input sanitization** côté client

#### **✅ Déjà sécurisé :**
- [x] **PRIVATE_KEY** → Server-only
- [x] **Headers de sécurité** → Configurés
- [x] **Variables sensibles** → Dans .env.local

### **4. Tests de validation**

#### **✅ Tests manuels à effectuer :**
- [ ] **Build local** → `npm run build` (déjà ✅)
- [ ] **Démarrage local** → `npm run dev` (déjà ✅)
- [ ] **API Health** → `GET /api/health/pdf` (déjà ✅)
- [ ] **Page Anchor** → Upload + hash + ancrage
- [ ] **Page Verify** → Vérification hash
- [ ] **Certificat PDF** → Génération + téléchargement

### **5. Documentation**

#### **✅ À créer :**
- [ ] **README.md** → Section ENV & Vercel
- [ ] **Guide déploiement** → Checklist Vercel
- [ ] **Variables d'environnement** → Documentation complète

---

## 🚀 **ACTIONS IMMÉDIATES**

### **1. Configuration Infura (5 minutes)**
```bash
# 1. Aller sur https://infura.io
# 2. Créer projet → Ethereum → Sepolia
# 3. Copier l'URL RPC
# 4. Mettre à jour .env.local :
NEXT_PUBLIC_RPC_URL=https://sepolia.infura.io/v3/VOTRE_VRAI_PROJECT_ID
RPC_URL=https://sepolia.infura.io/v3/VOTRE_VRAI_PROJECT_ID
```

### **2. Configuration Vercel (5 minutes)**
```bash
# 1. Aller sur Vercel Dashboard → Project → Settings → Environment Variables
# 2. Ajouter toutes les variables NEXT_PUBLIC_*
# 3. Ajouter PRIVATE_KEY (si défini)
# 4. Redéployer
```

### **3. Test de validation (2 minutes)**
```bash
# 1. Test local
npm run dev
curl http://localhost:3000/api/health/pdf

# 2. Test production (après déploiement)
curl https://votre-projet.vercel.app/api/health/pdf
```

---

## ⚠️ **RISQUES IDENTIFIÉS**

### **🔴 Critique :**
- **Aucun** → Build passe, dépendances complètes

### **🟡 Moyen :**
- **Variables placeholder** → Remplacer par vraies valeurs
- **ESLint ignoré** → Réactiver après stabilisation
- **Pas de validation Zod** → Ajouter sur API routes

### **🟢 Faible :**
- **Rate limiting manquant** → Ajouter plus tard
- **Tests unitaires limités** → Étendre progressivement

---

## ✅ **VALIDATION PR 1**

### **Critères de succès :**
- [ ] Build Vercel passe sans erreur
- [ ] Variables d'environnement configurées
- [ ] Application accessible en production
- [ ] API Health répond correctement
- [ ] Upload/Verify fonctionne

### **Rollback :**
- Revenir aux variables placeholder
- Désactiver ESLint si nécessaire
- Utiliser configuration SQLite en local

---

**🎯 PR 1 prêt à être appliqué !**
