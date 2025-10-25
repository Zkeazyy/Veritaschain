// scripts/request-testnet-eth.ts
// Script pour demander des ETH de test sur Base Sepolia

import { ethers } from "hardhat";
import * as dotenv from "dotenv";

dotenv.config();

async function main() {
  console.log("🚰 Demande d'ETH de test sur Base Sepolia...");
  
  // Obtenir le signataire
  const [deployer] = await ethers.getSigners();
  console.log("📝 Adresse du compte:", deployer.address);
  
  // Vérifier le solde actuel
  const balance = await ethers.provider.getBalance(deployer.address);
  console.log("💰 Solde actuel:", ethers.formatEther(balance), "ETH");
  
  if (balance > BigInt(0)) {
    console.log("✅ Vous avez déjà des ETH de test !");
    return;
  }
  
  console.log("\n🔗 Faucets disponibles pour Base Sepolia:");
  console.log("1. QuickNode Faucet: https://faucet.quicknode.com/base/sepolia");
  console.log("2. Chainlink Faucet: https://faucets.chain.link/base-sepolia");
  console.log("3. Base Bridge: https://bridge.base.org/deposit");
  
  console.log("\n📋 Instructions:");
  console.log("1. Visitez l'un des faucets ci-dessus");
  console.log("2. Connectez votre wallet MetaMask");
  console.log("3. Sélectionnez Base Sepolia (Chain ID: 84532)");
  console.log("4. Demandez des ETH de test");
  console.log("5. Attendez la confirmation de la transaction");
  
  console.log("\n⏳ Une fois que vous avez reçu les ETH de test:");
  console.log("   npm run deploy:baseSepolia");
  
  console.log("\n🔍 Pour vérifier votre solde:");
  console.log(`   npx hardhat balance --address ${deployer.address} --network baseSepolia`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Erreur:", error);
    process.exit(1);
  });
