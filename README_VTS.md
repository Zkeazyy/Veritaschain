# 🪙 Module VTS - Veritas Token

Intégration read-only du token ERC-20 Veritas Token (VTS) dans VeritasChain pour l'affichage des soldes et l'application automatique de réductions.

## 🚀 Activation du Module

### Variables d'environnement requises

```bash
# Activation du module VTS (obligatoire)
NEXT_PUBLIC_VTS_CONTRACT_ADDRESS=0x<adresse_du_token_VTS>

# Configuration réseau (optionnel)
NEXT_PUBLIC_NETWORK=sepolia  # ou base/polygon

# Nom de l'application (optionnel)
NEXT_PUBLIC_APP_NAME=VeritasChain

# RPC existant (déjà configuré)
NEXT_PUBLIC_RPC_URL=https://sepolia.infura.io/v3/...
```

### Configuration Vercel

1. Allez dans les **Settings** de votre projet Vercel
2. Section **Environment Variables**
3. Ajoutez les variables ci-dessus
4. Redéployez l'application

## 🎯 Fonctionnalités

### ✅ Lecture seule du solde VTS
- Affichage du solde de l'utilisateur connecté
- Revalidation automatique toutes les 30 secondes
- Gestion des erreurs réseau

### ✅ Calcul automatique des réductions
- Seuil par défaut : **500 VTS**
- Réduction par défaut : **-30%**
- Application automatique sur les prix

### ✅ Composants UI intégrés
- `VtsBadge` : Badge compact dans la navbar
- `VtsBalanceCard` : Carte complète du solde
- `PriceWithDiscount` : Prix avec réduction automatique

## 🧪 Test Local

### 1. Configuration
```bash
# Copiez le fichier d'environnement
cp env.sample .env

# Éditez .env avec vos valeurs
NEXT_PUBLIC_VTS_CONTRACT_ADDRESS=0x<adresse_token>
NEXT_PUBLIC_NETWORK=sepolia
```

### 2. Test avec wallet connecté
1. Connectez MetaMask sur le réseau Sepolia
2. Visitez `/vts-test` pour tester les composants
3. Vérifiez l'affichage du solde VTS
4. Testez les réductions sur les prix

### 3. Test sans wallet
- Les composants affichent "Module VTS désactivé"
- Aucune erreur ou crash

## 📍 Où apparaissent les composants

### VtsBadge
- **Navbar** : Badge compact à côté du bouton Wallet
- **État** : Solde + statut d'éligibilité
- **Tooltip** : Informations détaillées au survol

### VtsBalanceCard
- **Page de test** : `/vts-test`
- **Usage recommandé** : Page compte/abonnement
- **Contenu** : Solde complet + barre de progression

### PriceWithDiscount
- **Usage recommandé** : Pages de pricing/abonnement
- **Fonction** : Remplace l'affichage statique des prix
- **Exemple** :
  ```tsx
  <PriceWithDiscount 
    amountCents={990} 
    currency="EUR" 
    showVtsHint={true} 
  />
  ```

## ⚙️ Configuration Avancée

### Modifier les seuils et réductions

Éditez `lib/token/config.ts` :

```typescript
export const VTS_CONFIG = {
  // Seuil en VTS (500 par défaut)
  discountThreshold: 1000,  // 1000 VTS
  
  // Réduction en % (30 par défaut)
  discountPercent: 50,      // -50%
  
  // Messages personnalisés
  messages: {
    thresholdInfo: 'Détenez ≥ 1000 VTS pour bénéficier de -50% sur l\'abonnement.',
    // ...
  },
};
```

### Ajouter des composants personnalisés

```tsx
import { useVtsBalance, useVtsDiscount } from '@/hooks/useVtsBalance';

function MonComposantVTS() {
  const { balanceFormatted, enabled } = useVtsBalance();
  const discount = useVtsDiscount(balanceFormatted);
  
  if (!enabled) return null;
  
  return (
    <div>
      <p>Solde: {balanceFormatted} VTS</p>
      <p>Éligible: {discount.eligible ? 'Oui' : 'Non'}</p>
    </div>
  );
}
```

## 🔒 Sécurité

### ✅ Lecture seule uniquement
- Aucune écriture sur la blockchain
- Pas de signature de transaction
- Pas de clé privée côté client

### ✅ Gestion des erreurs
- RPC indisponible → Fallback UI
- Réseau différent → Warning discret
- Adresse invalide → Message d'erreur

### ✅ Validation des données
- Vérification du format des adresses
- Validation des seuils et pourcentages
- Gestion des cas edge

## 🐛 Dépannage

### Module VTS n'apparaît pas
- ✅ Vérifiez `NEXT_PUBLIC_VTS_CONTRACT_ADDRESS` dans `.env`
- ✅ Redémarrez le serveur de développement
- ✅ Vérifiez la console pour les erreurs

### Solde VTS ne se charge pas
- ✅ Vérifiez la connexion réseau
- ✅ Vérifiez que le wallet est connecté
- ✅ Vérifiez que vous êtes sur le bon réseau

### Réductions ne s'appliquent pas
- ✅ Vérifiez que le solde ≥ 500 VTS
- ✅ Vérifiez la configuration des seuils
- ✅ Testez avec `discountPercent` forcé

### Erreur "Invalid contract address"
- ✅ Vérifiez que l'adresse commence par `0x`
- ✅ Vérifiez que l'adresse fait 42 caractères
- ✅ Vérifiez que le contrat existe sur le réseau

## 📊 Monitoring

### Logs utiles
```bash
# Console du navigateur
[VTS] Balance loaded: 123.45 VTS
[VTS] Discount eligible: true
[VTS] Network warning: Recommended network: sepolia
```

### Métriques recommandées
- Nombre d'utilisateurs avec VTS
- Pourcentage d'utilisateurs éligibles
- Taux de conversion avec réduction

## 🔄 Mises à jour

### Ajouter un nouveau réseau
1. Modifiez `lib/token/config.ts`
2. Ajoutez le réseau dans `hardhat.config.ts`
3. Mettez à jour les variables d'environnement
4. Testez sur le nouveau réseau

### Modifier l'ABI ERC-20
1. Éditez `lib/token/erc20Abi.ts`
2. Ajoutez les nouvelles fonctions
3. Mettez à jour les hooks correspondants
4. Testez les nouvelles fonctionnalités

## 📞 Support

Pour toute question ou problème :
1. Vérifiez cette documentation
2. Consultez les logs de la console
3. Testez sur `/vts-test`
4. Contactez l'équipe de développement

---

**⚠️ Important** : Ce module est en lecture seule. Aucune transaction blockchain n'est effectuée côté client.
