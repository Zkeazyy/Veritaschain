// scripts/test-network.ts
// Script pour tester la connectivité aux réseaux

import { ethers } from "hardhat";
import * as dotenv from "dotenv";

// Charger les variables d'environnement
dotenv.config();

async function main() {
  console.log("🌐 Test de connectivité aux réseaux...");
  
  const networks = [
    { name: 'Sepolia', url: process.env.SEPOLIA_RPC_URL, chainId: 11155111 },
    { name: 'Base', url: process.env.BASE_RPC_URL, chainId: 8453 },
    { name: 'Base Sepolia', url: process.env.BASE_SEPOLIA_RPC_URL, chainId: 84532 },
    { name: 'Polygon', url: process.env.POLYGON_RPC_URL, chainId: 137 },
  ];
  
  console.log("\n📋 Variables d'environnement:");
  networks.forEach(network => {
    console.log(`${network.name}: ${network.url ? '✅ Configuré' : '❌ Manquant'}`);
    if (network.url) {
      console.log(`   URL: ${network.url}`);
    }
  });
  
  console.log(`\n🔑 PRIVATE_KEY: ${process.env.PRIVATE_KEY ? '✅ Configuré' : '❌ Manquant'}`);
  
  // Test de connectivité pour chaque réseau configuré
  for (const network of networks) {
    if (!network.url) continue;
    
    console.log(`\n🧪 Test ${network.name}...`);
    try {
      const provider = new ethers.JsonRpcProvider(network.url);
      const blockNumber = await provider.getBlockNumber();
      const networkInfo = await provider.getNetwork();
      
      console.log(`   ✅ Connecté`);
      console.log(`   📦 Block: ${blockNumber}`);
      console.log(`   🔗 Chain ID: ${networkInfo.chainId}`);
      
      // Test avec un compte si PRIVATE_KEY est configuré
      if (process.env.PRIVATE_KEY) {
        const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);
        const balance = await provider.getBalance(wallet.address);
        console.log(`   💰 Balance: ${ethers.formatEther(balance)} ETH`);
      }
      
    } catch (error) {
      console.log(`   ❌ Erreur: ${(error as Error).message}`);
    }
  }
  
  console.log("\n✅ Test de connectivité terminé !");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Erreur:", error);
    process.exit(1);
  });
