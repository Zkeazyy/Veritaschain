import { ethers, network } from "hardhat";
import * as fs from "fs";
import * as path from "path";

async function main() {
  console.log("🚀 Déploiement du token VTS sur", network.name);
  
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
  
  // Déployer le contrat VTS
  console.log("📦 Déploiement du contrat VTS...");
  const VTS = await ethers.deployContract("VTS");
  
  console.log("⏳ Attente de la confirmation...");
  await VTS.waitForDeployment();
  
  // Récupérer les informations de déploiement
  const address = await VTS.getAddress();
  const txHash = VTS.deploymentTransaction()?.hash ?? "";
  const receipt = await VTS.deploymentTransaction()?.wait();
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
  
  // Mettre à jour les déploiements pour le réseau actuel
  deployments[network.name] = deploymentData;
  
  // Créer le dossier deployments s'il n'existe pas
  const deploymentsDir = path.dirname(deploymentsPath);
  if (!fs.existsSync(deploymentsDir)) {
    fs.mkdirSync(deploymentsDir, { recursive: true });
  }
  
  // Écrire le fichier de déploiements
  fs.writeFileSync(deploymentsPath, JSON.stringify(deployments, null, 2));
  
  console.log("💾 Informations de déploiement sauvegardées dans:", deploymentsPath);
  console.log("🎯 Réseau:", network.name);
  console.log("📋 Adresse copiée:", address);
  
  // Afficher l'URL de l'explorateur
  const explorerUrl = getExplorerUrl(network.name, address);
  if (explorerUrl) {
    console.log("🔍 Explorateur:", explorerUrl);
  }
  
  console.log("\n🎉 Déploiement terminé avec succès !");
  console.log("📝 Pour vérifier le contrat, exécutez:");
  console.log(`   npm run verify:${network.name}`);
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

// Exécuter le script
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Erreur lors du déploiement:", error);
    process.exit(1);
  });
