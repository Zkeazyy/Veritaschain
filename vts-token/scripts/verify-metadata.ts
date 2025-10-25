// scripts/verify-metadata.ts
// Script pour vérifier les métadonnées du token VTS déployé

import { ethers } from "hardhat";

async function main() {
  console.log("🔍 Vérification des métadonnées du token VTS...");
  
  // Adresse du contrat (à remplacer par l'adresse réelle)
  const contractAddress = process.env.VTS_CONTRACT_ADDRESS || "0x0000000000000000000000000000000000000000";
  
  if (contractAddress === "0x0000000000000000000000000000000000000000") {
    console.log("❌ Veuillez définir VTS_CONTRACT_ADDRESS dans .env");
    console.log("Exemple: VTS_CONTRACT_ADDRESS=0x1234...5678");
    return;
  }
  
  console.log(`📍 Contrat: ${contractAddress}`);
  
  try {
    // Connexion au contrat
    const VTS = await ethers.getContractFactory("VTS");
    const vts = VTS.attach(contractAddress);
    
    // Récupération des métadonnées
    console.log("\n📊 Métadonnées du token:");
    
    const name = await (vts as any).name();
    console.log(`   Nom: ${name}`);
    
    const symbol = await (vts as any).symbol();
    console.log(`   Symbole: ${symbol}`);
    
    const decimals = await (vts as any).decimals();
    console.log(`   Décimales: ${decimals}`);
    
    const totalSupply = await (vts as any).totalSupply();
    console.log(`   Supply total: ${ethers.formatEther(totalSupply)} ${symbol}`);
    
    // Vérification du déployeur
    const deployerAddress = await (vts as any).signer.getAddress();
    const deployerBalance = await (vts as any).balanceOf(deployerAddress);
    console.log(`\n👤 Déployeur: ${deployerAddress}`);
    console.log(`   Balance: ${ethers.formatEther(deployerBalance)} ${symbol}`);
    
    // Vérification réseau
    const network = await ethers.provider.getNetwork();
    console.log(`\n🌐 Réseau: ${network.name} (Chain ID: ${network.chainId})`);
    
    // URLs d'exploration
    const explorerUrls = {
      1: "https://etherscan.io",
      11155111: "https://sepolia.etherscan.io",
      8453: "https://basescan.org",
      137: "https://polygonscan.com",
    };
    
    const explorerUrl = explorerUrls[Number(network.chainId) as keyof typeof explorerUrls];
    if (explorerUrl) {
      console.log(`🔍 Explorer: ${explorerUrl}/address/${contractAddress}`);
    }
    
    // Configuration pour VeritasChain
    console.log("\n🔗 Configuration pour VeritasChain:");
    console.log(`NEXT_PUBLIC_VTS_CONTRACT_ADDRESS=${contractAddress}`);
    console.log(`NEXT_PUBLIC_NETWORK=${network.name.toLowerCase()}`);
    console.log(`NEXT_PUBLIC_RPC_URL=${process.env.SEPOLIA_RPC_URL || process.env.BASE_RPC_URL || process.env.POLYGON_RPC_URL}`);
    
    console.log("\n✅ Token VTS vérifié avec succès !");
    
  } catch (error) {
    console.error("❌ Erreur lors de la vérification:", error);
    
    if ((error as Error).message.includes("call revert exception")) {
      console.log("\n💡 Solutions possibles:");
      console.log("1. Vérifiez que l'adresse du contrat est correcte");
      console.log("2. Vérifiez que vous êtes sur le bon réseau");
      console.log("3. Vérifiez que le contrat est bien déployé");
    }
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Erreur:", error);
    process.exit(1);
  });
