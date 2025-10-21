# 🚀 Guide d'intégration Supabase + Prisma pour VeritasChain

## ✅ **Problèmes résolus**
- ✅ Les 49 problèmes de build sont résolus
- ✅ Le build fonctionne parfaitement
- ✅ Prisma est installé et configuré

## 📋 **Configuration Supabase**

### **1. Créer un projet Supabase**
1. Allez sur [supabase.com](https://supabase.com)
2. Créez un compte (gratuit)
3. Créez un nouveau projet : **VeritasChain**
4. Notez votre mot de passe (vous en aurez besoin)

### **2. Récupérer le DSN de connexion**
1. Dans votre projet Supabase, allez dans **Settings** → **Database**
2. Copiez la **Connection String** (URI) :
   ```
   postgresql://postgres:[YOUR-PASSWORD]@db.xxxxx.supabase.co:5432/postgres
   ```
3. Remplacez `[YOUR-PASSWORD]` par votre vrai mot de passe

### **3. Ajouter le DSN dans .env.local**

Ajoutez cette ligne dans `web/.env.local` :

```bash
# Supabase Database
DATABASE_URL="postgresql://postgres:VOTRE_MOT_DE_PASSE@db.xxxxx.supabase.co:5432/postgres?sslmode=require"

# Timezone
TZ="UTC"
```

### **4. Créer la première migration**

```bash
cd web
npx prisma migrate dev --name init
```

Cela va :
- Créer les tables `documents`, `certificates`, `users`
- Générer le client Prisma
- Appliquer les migrations sur Supabase

### **5. Vérifier avec Prisma Studio**

```bash
npx prisma studio
```

Cela ouvre une interface web sur `http://localhost:5555` où vous pouvez :
- Voir toutes vos tables
- Ajouter/modifier/supprimer des données
- Tester vos requêtes

## 🔧 **Utilisation dans votre code**

### **Créer un client Prisma**

Créez `web/lib/prisma.ts` :

```typescript
import { PrismaClient } from '@prisma/client';

const globalForPrisma = global as unknown as { prisma: PrismaClient };

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    log: ['query', 'error', 'warn'],
  });

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;
```

### **Exemple d'utilisation dans une API Route**

```typescript
// app/api/documents/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Créer un document dans la base
    const document = await prisma.document.create({
      data: {
        hash: body.hash,
        fileName: body.fileName,
        fileSize: body.fileSize,
        mimeType: body.mimeType,
        txHash: body.txHash,
        author: body.author,
        timestamp: BigInt(body.timestamp),
      },
    });
    
    return NextResponse.json(document);
  } catch (error) {
    console.error('Error creating document:', error);
    return NextResponse.json({ error: 'Failed to create document' }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const hash = searchParams.get('hash');
    
    if (hash) {
      // Rechercher par hash
      const document = await prisma.document.findUnique({
        where: { hash },
        include: { certificates: true },
      });
      return NextResponse.json(document);
    }
    
    // Liste de tous les documents
    const documents = await prisma.document.findMany({
      orderBy: { createdAt: 'desc' },
      take: 10,
    });
    
    return NextResponse.json(documents);
  } catch (error) {
    console.error('Error fetching documents:', error);
    return NextResponse.json({ error: 'Failed to fetch documents' }, { status: 500 });
  }
}
```

## 🚀 **Déploiement Vercel avec Supabase**

### **Variables d'environnement Vercel**

Ajoutez dans Vercel → Settings → Environment Variables :

```bash
DATABASE_URL=postgresql://postgres:VOTRE_MOT_DE_PASSE@db.xxxxx.supabase.co:5432/postgres?sslmode=require
```

### **Commandes de déploiement**

```bash
# Build local
npm run build

# Déploiement Vercel
vercel --prod
```

## 📊 **Schéma de la base de données**

### **Table `documents`**
- `id` : UUID unique
- `hash` : Hash SHA-256 du document (unique)
- `fileName` : Nom du fichier
- `txHash` : Hash de la transaction blockchain (unique)
- `author` : Adresse Ethereum de l'auteur
- `timestamp` : Timestamp blockchain
- Relations : `certificates[]`

### **Table `certificates`**
- `id` : UUID unique
- `documentId` : Référence au document
- `pdfUrl` : URL optionnelle du PDF généré
- `qrCode` : Données du QR code

### **Table `users`**
- `id` : UUID unique
- `ethereumAddress` : Adresse Ethereum (unique)
- `email` : Email optionnel

## 🎯 **Prochaines étapes**

1. ✅ Ajoutez `DATABASE_URL` dans `.env.local`
2. ✅ Exécutez `npx prisma migrate dev --name init`
3. ✅ Testez avec `npx prisma studio`
4. ✅ Créez `lib/prisma.ts`
5. ✅ Intégrez dans vos API routes
6. ✅ Déployez sur Vercel avec la variable `DATABASE_URL`

---

**🎉 Votre VeritasChain est maintenant prêt avec Supabase + Prisma !**
