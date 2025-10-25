# 🚀 GUIDE DÉPLOIEMENT VERCEL - VERITASCHAIN

## ✅ **CONFIGURATION PRÊTE**

### **Variables d'environnement configurées dans `vercel.json` :**
```json
{
  "env": {
    "NEXT_PUBLIC_SITE_URL": "https://veritaschain.vercel.app",
    "NEXT_PUBLIC_RPC_URL": "https://sepolia.infura.io/v3/adc27d09a5464d119b406fbcfe66805f",
    "NEXT_PUBLIC_CONTRACT_ADDRESS": "0x7b7C41cf5bc986F406c7067De6e69f200c27D63f",
    "NEXT_PUBLIC_CHAIN_ID": "11155111",
    "NEXT_PUBLIC_ETHERSCAN_BASE_URL": "https://sepolia.etherscan.io"
  }
}
```

### **✅ Build validé :**
- ✅ Compilation réussie
- ✅ Types validés
- ✅ Pages générées (11/11)
- ✅ Prêt pour déploiement

---

## 🚀 **DÉPLOIEMENT VERCEL (5 minutes)**

### **Option 1 : Déploiement automatique (recommandé)**
```bash
# Si vous avez le CLI Vercel installé
vercel --prod

# Ou utilisez le script automatisé
npm run vercel:wire
```

### **Option 2 : Déploiement manuel**
1. **Allez sur [vercel.com/dashboard](https://vercel.com/dashboard)**
2. **Importez votre projet** (si pas déjà fait)
3. **Configurez les variables d'environnement** :
   - `NEXT_PUBLIC_SITE_URL` → `https://votre-projet.vercel.app`
   - `NEXT_PUBLIC_RPC_URL` → `https://sepolia.infura.io/v3/adc27d09a5464d119b406fbcfe66805f`
   - `NEXT_PUBLIC_CONTRACT_ADDRESS` → `0x7b7C41cf5bc986F406c7067De6e69f200c27D63f`
   - `NEXT_PUBLIC_CHAIN_ID` → `11155111`
   - `NEXT_PUBLIC_ETHERSCAN_BASE_URL` → `https://sepolia.etherscan.io`
4. **Déployez** → Vercel build automatiquement

---

## 🧪 **TESTS POST-DÉPLOIEMENT**

### **1. Test de santé**
```bash
# Remplacez par votre vraie URL Vercel
curl https://votre-projet.vercel.app/api/health/pdf
# ✅ Doit retourner : {"status":"OK","message":"API PDF fonctionnelle"}
```

### **2. Test de vérification**
```bash
curl -X POST https://votre-projet.vercel.app/api/verify \
  -H "Content-Type: application/json" \
  -d '{"hash":"0xba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad"}'
# ✅ Doit retourner le statut du hash
```

### **3. Test interface utilisateur**
- **Page d'accueil** : `https://votre-projet.vercel.app`
- **Page Anchor** : `https://votre-projet.vercel.app/anchor`
- **Page Verify** : `https://votre-projet.vercel.app/verify`
- **Page Docs** : `https://votre-projet.vercel.app/docs`

---

## ⚠️ **POINTS D'ATTENTION**

### **🔴 Critique :**
- **URL Vercel** → Mettez à jour `NEXT_PUBLIC_SITE_URL` avec votre vraie URL
- **Variables manquantes** → Vérifiez que toutes les variables sont définies

### **🟡 Important :**
- **Base de données** → SQLite ne fonctionne pas sur Vercel (utilisez Supabase)
- **PRIVATE_KEY** → Ajoutez si vous voulez des transactions serveur

### **🟢 Optionnel :**
- **Domain personnalisé** → Configurez dans Vercel Settings
- **Analytics** → Activez Vercel Analytics

---

## 🔧 **CONFIGURATION SUPABASE (optionnel)**

Si vous voulez une base de données en production :

### **1. Créez un projet Supabase**
1. Allez sur [supabase.com/dashboard](https://supabase.com/dashboard)
2. Créez un nouveau projet
3. Copiez l'URL de connexion

### **2. Ajoutez à Vercel**
```bash
# Variables à ajouter dans Vercel Dashboard
DATABASE_URL="postgresql://postgres:password@db.xxxxx.supabase.co:5432/postgres?sslmode=require"
DIRECT_URL="postgresql://postgres:password@db.xxxxx.supabase.co:5432/postgres?sslmode=require"
```

### **3. Déployez les migrations**
```bash
# Après déploiement Vercel
npm run supabase:setup
```

---

## 🎯 **CHECKLIST DE DÉPLOIEMENT**

### **Avant déploiement :**
- [x] **Build local** → ✅ Passe
- [x] **Variables configurées** → ✅ Dans vercel.json
- [x] **Infura configuré** → ✅ URL ajoutée
- [x] **Contrat déployé** → ✅ Sepolia

### **Après déploiement :**
- [ ] **URL Vercel** → Mettre à jour NEXT_PUBLIC_SITE_URL
- [ ] **Test API Health** → Vérifier `/api/health/pdf`
- [ ] **Test Interface** → Vérifier toutes les pages
- [ ] **Test Blockchain** → Vérifier connexion Infura
- [ ] **Test Upload/Verify** → Fonctionnalités complètes

---

## 🏆 **VALIDATION FINALE**

**✅ VeritasChain prêt pour le déploiement !**

- **Configuration** : ✅ Complète
- **Build** : ✅ Passe sans erreur
- **Variables** : ✅ Toutes définies
- **Tests** : ✅ Prêts à exécuter

**🚀 Déployez maintenant sur Vercel !**

---

## 📞 **SUPPORT**

Si vous rencontrez des problèmes :
1. **Vérifiez les logs Vercel** → Build logs
2. **Vérifiez les variables** → Environment Variables
3. **Testez localement** → `npm run build` doit passer
4. **Consultez la documentation** → Vercel Docs

**🎉 Bon déploiement !**
