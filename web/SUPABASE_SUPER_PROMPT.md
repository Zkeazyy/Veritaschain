# 🚀 SUPABASE SUPER PROMPT - GUIDE RAPIDE

## ✅ **CONFIGURATION AUTOMATIQUE EN 3 ÉTAPES**

### **1. Récupérer votre DSN Supabase (2 minutes)**

1. Allez sur [supabase.com](https://supabase.com)
2. Créez un projet (si pas déjà fait) : **VeritasChain**
3. **Settings** → **Database** → **Connection String**
4. Copiez l'**URI** (pas Transaction, pas Session)
5. **Important** : Ajoutez `?sslmode=require` à la fin

Exemple :
```
postgresql://postgres.xxxxx:password@aws-0-eu-central-1.pooler.supabase.com:6543/postgres?sslmode=require
```

### **2. Définir la variable d'environnement**

**Sur Windows (PowerShell):**
```powershell
$env:SUPABASE_DSN="postgresql://postgres.xxxxx:password@aws-0-eu-central-1.pooler.supabase.com:6543/postgres?sslmode=require"
```

**Sur macOS/Linux (Bash/Zsh):**
```bash
export SUPABASE_DSN="postgresql://postgres.xxxxx:password@aws-0-eu-central-1.pooler.supabase.com:6543/postgres?sslmode=require"
```

### **3. Lancer le super script**

```bash
cd web
npm run supabase:super
```

**Ce script va automatiquement :**
1. ✅ Mettre à jour `.env.local` avec `DATABASE_URL`
2. ✅ Vérifier le schéma Prisma (PostgreSQL)
3. ✅ Ajouter les scripts npm manquants
4. ✅ Installer les dépendances (tsx, dotenv)
5. ✅ Générer le client Prisma
6. ✅ Déployer les migrations sur Supabase
7. ✅ Ouvrir Prisma Studio

---

## 🎯 **SCRIPTS DISPONIBLES**

Après la configuration, vous pouvez utiliser :

```bash
# Vérifier les tables
npm run db:verify

# Ouvrir Prisma Studio
npm run db:studio

# Créer une nouvelle migration
npm run migrate:dev -- --name nom_migration

# Déployer les migrations (production)
npm run migrate:deploy

# Générer le client Prisma
npm run db:generate

# Configuration automatique Supabase
npm run supabase:wire

# Super configuration automatique (tout en un)
npm run supabase:super
```

---

## 📊 **VÉRIFICATION RAPIDE**

### **Tester la connexion**

```bash
npm run db:verify
```

Résultat attendu :
```
🔎 VÉRIFICATION DES TABLES PRISMA
📊 Base de données: ✅ PostgreSQL (Supabase)
🔗 Host: aws-0-eu-central-1.pooler.supabase.com

  • Document        : ✅ OK (0 lignes)
  • Certificate     : ✅ OK (0 lignes)
  • User            : ✅ OK (0 lignes)

✅ TOUTES LES TABLES SONT OK
```

### **Inspecter les données**

```bash
npm run db:studio
```

Ouvre `http://localhost:5555` avec une interface graphique pour voir vos données.

---

## 🔧 **DÉPANNAGE**

### **Erreur : "DATABASE_URL invalide"**

1. Vérifiez que votre DSN commence par `postgresql://`
2. Vérifiez que vous avez ajouté `?sslmode=require` à la fin
3. Testez la connexion depuis Supabase Dashboard

### **Erreur : "Table does not exist"**

Créez les tables avec :
```bash
npm run migrate:dev -- --name init
```

### **Erreur : "tsx not found"**

Installez les dépendances :
```bash
npm install
```

### **Le script ne démarre pas**

Vérifiez que vous êtes dans le bon dossier :
```bash
cd web
pwd  # ou "cd" sur Windows pour voir le chemin
```

---

## 🚀 **DÉPLOIEMENT VERCEL**

Une fois configuré localement, ajoutez dans Vercel :

**Settings → Environment Variables :**

```bash
DATABASE_URL=postgresql://postgres.xxxxx:password@aws-0-eu-central-1.pooler.supabase.com:6543/postgres?sslmode=require
```

Puis redéployez :
```bash
vercel --prod
```

---

## 📖 **GUIDES COMPLETS**

Pour plus de détails, consultez :
- **SUPABASE_COMPLETE_GUIDE.md** - Guide détaillé
- **SUPABASE_SETUP.md** - Setup rapide
- **DEPLOYMENT_FINAL.md** - Déploiement Vercel

---

**🎉 C'est tout ! Votre VeritasChain est maintenant connecté à Supabase !**
