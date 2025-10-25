// scripts/deploy-veritas.ts
// Script pour déployer le contrat VeritasChain

import { ethers, network } from "hardhat";
import * as fs from "fs";
import * as path from "path";

async function main() {
  console.log("🚀 Déploiement du contrat VeritasChain sur", network.name);
  
  // Obtenir le signataire (déployeur)
  const [deployer] = await ethers.getSigners();
  console.log("📝 Déployeur:", deployer.address);
  
  // Vérifier le solde
  const balance = await ethers.provider.getBalance(deployer.address);
  console.log("💰 Solde:", ethers.formatEther(balance), "ETH");
  
  if (balance === BigInt(0) && network.name !== "hardhat") {
    console.log("⚠️ Solde de 0 ETH détecté. Tentative de déploiement quand même...");
    console.log("💡 Si le déploiement échoue, obtenez des ETH de test depuis un faucet");
  }
  
  // Déployer le contrat VeritasChain
  console.log("📦 Déploiement du contrat VeritasChain...");
  const VeritasChain = await ethers.deployContract("VeritasChain");
  
  console.log("⏳ Attente de la confirmation...");
  await VeritasChain.waitForDeployment();
  
  // Récupérer les informations de déploiement
  const address = await VeritasChain.getAddress();
  const txHash = VeritasChain.deploymentTransaction()?.hash ?? "";
  const receipt = await VeritasChain.deploymentTransaction()?.wait();
  const blockNumber = receipt?.blockNumber ?? 0;
  
  console.log("✅ Contrat déployé avec succès !");
  console.log("📍 Adresse:", address);
  console.log("🔗 Transaction:", txHash);
  console.log("📊 Block:", blockNumber);
  
  // Préparer les données de déploiement
  const deploymentData = {
    address,
    txHash,
    blockNumber,
    deployer: deployer.address,
    timestamp: new Date().toISOString()
  };
  
  // Charger le fichier de déploiements existant
  const deploymentsPath = path.join(__dirname, "..", "deployments", "deployment.json");
  let deployments: Record<string, any> = {};
  
  try {
    if (fs.existsSync(deploymentsPath)) {
      const content = fs.readFileSync(deploymentsPath, "utf8");
      deployments = JSON.parse(content);
    }
  } catch (error) {
    console.warn("⚠️ Erreur lors de la lecture du fichier de déploiements, création d'un nouveau fichier");
    deployments = {};
  }
  
  // Créer la structure pour le réseau actuel si elle n'existe pas
  if (!deployments[network.name]) {
    deployments[network.name] = {};
  }
  
  // Ajouter les informations VeritasChain sous baseSepolia.veritas
  deployments[network.name].veritas = deploymentData;
  
  // Créer le dossier deployments s'il n'existe pas
  const deploymentsDir = path.dirname(deploymentsPath);
  if (!fs.existsSync(deploymentsDir)) {
    fs.mkdirSync(deploymentsDir, { recursive: true });
  }
  
  // Écrire le fichier de déploiements
  fs.writeFileSync(deploymentsPath, JSON.stringify(deployments, null, 2));
  
  console.log("💾 Informations de déploiement sauvegardées dans:", deploymentsPath);
  console.log("🎯 Réseau:", network.name);
  console.log("📋 Adresse VeritasChain:", address);
  
  // Afficher l'URL de l'explorateur
  const explorerUrl = getExplorerUrl(network.name, address);
  if (explorerUrl) {
    console.log("🔍 Explorateur:", explorerUrl);
  }
  
  console.log("\n🎉 Déploiement VeritasChain terminé avec succès !");
  console.log("📝 Pour vérifier le contrat, exécutez:");
  console.log(`   npx hardhat verify --network ${network.name} ${address}`);
  
  console.log("\n🔧 Variables d'environnement pour Vercel:");
  console.log(`NEXT_PUBLIC_CONTRACT_ADDRESS=${address}`);
  console.log(`NEXT_PUBLIC_RPC_URL=${getRpcUrl(network.name)}`);
  console.log(`NEXT_PUBLIC_CHAIN_ID=${getChainId(network.name)}`);
  console.log(`NEXT_PUBLIC_ETHERSCAN_BASE_URL=${getExplorerBaseUrl(network.name)}`);
}

function getExplorerUrl(networkName: string, address: string): string | null {
  const explorers: Record<string, string> = {
    sepolia: `https://sepolia.etherscan.io/address/${address}`,
    mainnet: `https://etherscan.io/address/${address}`,
    base: `https://basescan.org/address/${address}`,
    baseSepolia: `https://sepolia.basescan.org/address/${address}`,
    polygon: `https://polygonscan.com/address/${address}`,
  };
  
  return explorers[networkName] || null;
}

function getRpcUrl(networkName: string): string {
  const rpcUrls: Record<string, string> = {
    sepolia: "https://sepolia.infura.io/v3/YOUR_PROJECT_ID",
    base: "https://base-mainnet.g.alchemy.com/v2/YOUR_API_KEY",
    baseSepolia: "https://sepolia.base.org",
    polygon: "https://polygon-mainnet.g.alchemy.com/v2/YOUR_API_KEY",
  };
  
  return rpcUrls[networkName] || "";
}

function getChainId(networkName: string): string {
  const chainIds: Record<string, string> = {
    sepolia: "11155111",
    base: "8453",
    baseSepolia: "84532",
    polygon: "137",
  };
  
  return chainIds[networkName] || "";
}

function getExplorerBaseUrl(networkName: string): string {
  const explorerUrls: Record<string, string> = {
    sepolia: "https://sepolia.etherscan.io",
    base: "https://basescan.org",
    baseSepolia: "https://sepolia.basescan.org",
    polygon: "https://polygonscan.com",
  };
  
  return explorerUrls[networkName] || "";
}

// Exécuter le script
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Erreur lors du déploiement:", error);
    process.exit(1);
  });
