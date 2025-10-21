# 🚀 GUIDE COMPLET - SUPABASE + VERITASCHAIN

## ✅ **CONFIGURATION TERMINÉE**

Tous les fichiers nécessaires ont été créés :
- ✅ Schéma Prisma (PostgreSQL)
- ✅ Scripts de vérification et orchestration
- ✅ Package.json mis à jour avec les scripts
- ✅ Client Prisma configuré

---

## 📋 **ÉTAPES DE CONFIGURATION**

### **1. Créer un projet Supabase (5 minutes)**

1. Allez sur [supabase.com](https://supabase.com)
2. Créez un compte (gratuit)
3. Créez un nouveau projet : **VeritasChain**
4. Choisissez :
   - **Nom** : VeritasChain
   - **Mot de passe** : Notez-le bien !
   - **Région** : Choisissez la plus proche
5. Attendez 2-3 minutes (création du projet)

### **2. Récupérer le DSN de connexion**

1. Dans votre projet Supabase, allez dans **Settings** → **Database**
2. Descendez jusqu'à **Connection String**
3. Sélectionnez **URI**
4. Copiez l'URL complète :
   ```
   postgresql://postgres.[votre-projet]:[votre-password]@aws-0-eu-central-1.pooler.supabase.com:6543/postgres
   ```
5. **Important** : Ajoutez `?sslmode=require` à la fin :
   ```
   postgresql://postgres.[votre-projet]:[votre-password]@aws-0-eu-central-1.pooler.supabase.com:6543/postgres?sslmode=require
   ```

### **3. Configurer .env.local**

Créez le fichier `web/.env.local` (copiez depuis `env.local.example`) :

```bash
# Supabase Database (PostgreSQL)
DATABASE_URL="postgresql://postgres.[votre-projet]:[votre-password]@aws-0-eu-central-1.pooler.supabase.com:6543/postgres?sslmode=require"

# Timezone
TZ="UTC"

# Blockchain Configuration
NEXT_PUBLIC_RPC_URL=https://sepolia.infura.io/v3/VOTRE_PROJECT_ID
RPC_URL=https://sepolia.infura.io/v3/VOTRE_PROJECT_ID

# Contract Address (Sepolia)
NEXT_PUBLIC_CONTRACT_ADDRESS=0x7b7C41cf5bc986F406c7067De6e69f200c27D63f
CONTRACT_ADDRESS=0x7b7C41cf5bc986F406c7067De6e69f200c27D63f

# Chain ID
NEXT_PUBLIC_CHAIN_ID=11155111
CHAIN_ID=11155111

# Site URL
NEXT_PUBLIC_SITE_URL=http://localhost:3000

# Etherscan
NEXT_PUBLIC_ETHERSCAN_BASE_URL=https://sepolia.etherscan.io
```

### **4. Exécuter le script de configuration**

```bash
cd web
npm run supabase:wire
```

Ce script va automatiquement :
1. ✅ Vérifier la connexion Supabase
2. ✅ Générer le client Prisma
3. ✅ Déployer les migrations
4. ✅ Vérifier que les tables sont créées
5. ✅ Afficher le résumé de configuration

### **5. Créer la première migration (si nécessaire)**

Si le script indique qu'aucune migration n'existe :

```bash
npm run migrate:dev -- --name init
```

Cela va :
- Créer les tables `documents`, `certificates`, `users`
- Générer le client Prisma
- Appliquer les migrations sur Supabase

### **6. Vérifier avec Prisma Studio**

```bash
npm run db:studio
```

Cela ouvre une interface web sur `http://localhost:5555` où vous pouvez :
- ✅ Voir toutes vos tables
- ✅ Inspecter les colonnes et index
- ✅ Ajouter/modifier/supprimer des données
- ✅ Tester vos requêtes

---

## 🧪 **SCRIPTS DISPONIBLES**

```bash
# Générer le client Prisma
npm run db:generate

# Créer une nouvelle migration
npm run migrate:dev -- --name nom_migration

# Déployer les migrations (production)
npm run migrate:deploy

# Vérifier les tables
npm run db:verify

# Ouvrir Prisma Studio
npm run db:studio

# Configuration automatique Supabase
npm run supabase:wire
```

---

## 💻 **UTILISATION DANS LE CODE**

### **Exemple : Sauvegarder un document après ancrage**

```typescript
// app/api/anchor/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { hash, fileName, txHash, author, timestamp } = body;

    // Sauvegarder le document dans Supabase
    const document = await prisma.document.create({
      data: {
        hash,
        fileName,
        fileSize: body.fileSize,
        mimeType: body.mimeType,
        txHash,
        author,
        timestamp: BigInt(timestamp),
      },
    });

    console.log('✅ Document sauvegardé dans Supabase:', document.id);

    return NextResponse.json({ 
      success: true, 
      documentId: document.id 
    });
  } catch (error) {
    console.error('❌ Erreur lors de la sauvegarde:', error);
    return NextResponse.json({ error: 'Failed to save document' }, { status: 500 });
  }
}
```

### **Exemple : Rechercher un document par hash**

```typescript
// app/api/documents/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const hash = searchParams.get('hash');

    if (!hash) {
      return NextResponse.json({ error: 'Hash required' }, { status: 400 });
    }

    // Rechercher dans Supabase
    const document = await prisma.document.findUnique({
      where: { hash },
      include: { 
        certificates: true 
      },
    });

    if (!document) {
      return NextResponse.json({ error: 'Document not found' }, { status: 404 });
    }

    // Convertir BigInt en Number pour JSON
    return NextResponse.json({
      ...document,
      timestamp: Number(document.timestamp),
    });
  } catch (error) {
    console.error('❌ Erreur lors de la recherche:', error);
    return NextResponse.json({ error: 'Failed to fetch document' }, { status: 500 });
  }
}
```

---

## 🚀 **DÉPLOIEMENT VERCEL AVEC SUPABASE**

### **1. Ajouter les variables d'environnement Vercel**

Dans Vercel → Settings → Environment Variables :

```bash
DATABASE_URL=postgresql://postgres.[votre-projet]:[votre-password]@aws-0-eu-central-1.pooler.supabase.com:6543/postgres?sslmode=require

NEXT_PUBLIC_RPC_URL=https://sepolia.infura.io/v3/VOTRE_PROJECT_ID
RPC_URL=https://sepolia.infura.io/v3/VOTRE_PROJECT_ID

NEXT_PUBLIC_CONTRACT_ADDRESS=0x7b7C41cf5bc986F406c7067De6e69f200c27D63f
CONTRACT_ADDRESS=0x7b7C41cf5bc986F406c7067De6e69f200c27D63f

NEXT_PUBLIC_CHAIN_ID=11155111
CHAIN_ID=11155111

NEXT_PUBLIC_SITE_URL=https://votre-projet.vercel.app

NEXT_PUBLIC_ETHERSCAN_BASE_URL=https://sepolia.etherscan.io
```

### **2. Déployer**

```bash
vercel --prod
```

### **3. Vérifier**

1. ✅ Ouvrez votre URL Vercel
2. ✅ Testez `/anchor` → ancrez un document
3. ✅ Testez `/verify` → vérifiez le document
4. ✅ Allez dans Supabase Dashboard → Table Editor → Vérifiez que les documents apparaissent

---

## 📊 **STRUCTURE DE LA BASE DE DONNÉES**

### **Table `documents`**
```sql
id          UUID      PRIMARY KEY
hash        TEXT      UNIQUE (SHA-256 hash)
fileName    TEXT      
fileSize    INTEGER   
mimeType    TEXT      
txHash      TEXT      UNIQUE (Transaction hash)
author      TEXT      (Ethereum address)
timestamp   BIGINT    (Block timestamp)
createdAt   TIMESTAMP 
updatedAt   TIMESTAMP 
```

### **Table `certificates`**
```sql
id          UUID      PRIMARY KEY
documentId  UUID      FOREIGN KEY → documents(id)
pdfUrl      TEXT      (optionnel)
qrCode      TEXT      (optionnel)
createdAt   TIMESTAMP 
```

### **Table `users`**
```sql
id              UUID      PRIMARY KEY
email           TEXT      UNIQUE (optionnel)
ethereumAddress TEXT      UNIQUE
createdAt       TIMESTAMP 
updatedAt       TIMESTAMP 
```

---

## 🔍 **VÉRIFICATION ET DEBUGGING**

### **Vérifier la connexion Supabase**

```bash
npm run db:verify
```

### **Voir les logs Prisma**

Le client Prisma est configuré avec des logs en développement :
```typescript
log: ['query', 'error', 'warn']
```

### **Inspecter les données**

```bash
npm run db:studio
# Ouvre http://localhost:5555
```

### **Vérifier les migrations**

```bash
npx prisma migrate status
```

---

## 🎯 **CHECKLIST FINALE**

- [ ] Projet Supabase créé
- [ ] DSN de connexion récupéré
- [ ] `.env.local` configuré avec DATABASE_URL
- [ ] `npm run supabase:wire` exécuté avec succès
- [ ] Tables vérifiées avec `npm run db:verify`
- [ ] Prisma Studio testé (`npm run db:studio`)
- [ ] Code mis à jour pour utiliser `prisma.document.create()`
- [ ] Variables ajoutées dans Vercel
- [ ] Application déployée et testée

---

**🎉 Votre VeritasChain est maintenant connecté à Supabase PostgreSQL !**

**💡 Pour toute question :**
- Documentation Supabase : [supabase.com/docs](https://supabase.com/docs)
- Documentation Prisma : [prisma.io/docs](https://prisma.io/docs)
- VeritasChain : Consultez `DEPLOYMENT_FINAL.md` et `README.md`
