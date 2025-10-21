# 🚀 GUIDE DE DÉMARRAGE RAPIDE - VERITASCHAIN

## ⚡ **DÉMARRAGE EN 2 ÉTAPES**

### **1. Ouvrez un nouveau terminal (PowerShell ou CMD)**

**Windows PowerShell :**
- Appuyez sur `Windows + X`
- Sélectionnez "Windows PowerShell" ou "Terminal"

**OU**

- Appuyez sur `Windows + R`
- Tapez `powershell` et appuyez sur Entrée

### **2. Copiez-collez ces commandes une par une**

```powershell
cd C:\Users\sabme\Downloads\veritaschain\web
npm run dev
```

**Attendez de voir ce message :**
```
✓ Ready in X.Xs
○ Local:        http://localhost:3000
```

---

## 🌐 **OUVRIR L'INTERFACE**

### **Une fois que vous voyez "Ready" :**

**Ouvrez votre navigateur et allez sur :**
```
http://localhost:3000
```

**Vous verrez :**
- 🏠 Page d'accueil VeritasChain
- Navigation : Anchor | Verify | Docs
- Design professionnel avec cards

---

## 📊 **AUTRES INTERFACES**

### **Prisma Studio (Base de données)**
```
http://localhost:5555
```

### **Vercel Dashboard**
```
https://vercel.com/dashboard
```

### **Supabase Dashboard**
```
https://supabase.com/dashboard
```

---

## ❓ **EN CAS DE PROBLÈME**

### **Erreur "Cannot find module"**
```powershell
cd C:\Users\sabme\Downloads\veritaschain\web
npm install
npm run dev
```

### **Port 3000 déjà utilisé**
```powershell
# Arrêtez le processus qui utilise le port 3000
netstat -ano | findstr :3000
# Puis relancez
npm run dev
```

### **Erreur de compilation**
```powershell
# Nettoyez et reconstruisez
Remove-Item -Recurse -Force .next
npm run build
npm run dev
```

---

## 🎯 **ALTERNATIVE : Fichier start.bat**

**Double-cliquez sur :**
```
C:\Users\sabme\Downloads\veritaschain\web\start.bat
```

Cela ouvrira automatiquement le serveur.

---

## 📖 **COMMANDES UTILES**

```powershell
# Démarrer le serveur
npm run dev

# Build de production
npm run build

# Ouvrir Prisma Studio
npm run db:studio

# Vérifier la configuration
npx dotenv-cli -e .env.local -- npm run zero:verify

# Tester la base de données
npx dotenv-cli -e .env.local -- npm run db:verify
```

---

**💡 IMPORTANT : Vous DEVEZ être dans le dossier `web/` pour que ça fonctionne !**

**📍 Vérifiez que vous êtes au bon endroit avec :**
```powershell
cd
# Résultat attendu : C:\Users\sabme\Downloads\veritaschain\web
```

---

**🎊 Une fois "Ready" affiché, ouvrez `http://localhost:3000` dans votre navigateur !**
