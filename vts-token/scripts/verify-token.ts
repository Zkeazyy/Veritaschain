import { run, network } from "hardhat";
import * as fs from "fs";
import * as path from "path";

async function main() {
  console.log("🔍 Vérification du token VTS sur", network.name);
  
  // Charger le fichier de déploiements
  const deploymentsPath = path.join(__dirname, "..", "deployments", "deployment.json");
  
  if (!fs.existsSync(deploymentsPath)) {
    throw new Error("❌ Fichier de déploiements non trouvé. Déployez d'abord le contrat.");
  }
  
  let deployments: Record<string, any> = {};
  
  try {
    const content = fs.readFileSync(deploymentsPath, "utf8");
    deployments = JSON.parse(content);
  } catch (error) {
    throw new Error("❌ Erreur lors de la lecture du fichier de déploiements");
  }
  
  // Récupérer l'adresse pour le réseau actuel
  const networkDeployment = deployments[network.name];
  
  if (!networkDeployment || !networkDeployment.address) {
    throw new Error(`❌ Aucune adresse de déploiement trouvée pour le réseau ${network.name}`);
  }
  
  const address = networkDeployment.address;
  console.log("📍 Adresse du contrat:", address);
  console.log("🔗 Transaction de déploiement:", networkDeployment.txHash);
  console.log("📊 Block de déploiement:", networkDeployment.blockNumber);
  
  // Vérifier le contrat
  console.log("⏳ Vérification du contrat sur Etherscan...");
  
  // Vérifier si c'est un réseau local
  if (network.name === "hardhat" || network.name === "localhost") {
    console.log("⚠️ Réseau local détecté - Vérification non supportée");
    console.log("✅ Le contrat est déployé localement avec succès !");
    return;
  }
  
  try {
    await run("verify:verify", {
      address: address,
      constructorArguments: [], // VTS n'a pas d'arguments de constructeur
    });
    
    console.log("✅ Contrat vérifié avec succès !");
    
    // Afficher l'URL de l'explorateur
    const explorerUrl = getExplorerUrl(network.name, address);
    if (explorerUrl) {
      console.log("🔍 Explorateur:", explorerUrl);
    }
    
  } catch (error: any) {
    if (error.message.includes("Already Verified")) {
      console.log("✅ Contrat déjà vérifié !");
    } else if (error.message.includes("Contract source code already verified")) {
      console.log("✅ Code source du contrat déjà vérifié !");
    } else {
      console.error("❌ Erreur lors de la vérification:", error.message);
      throw error;
    }
  }
  
  console.log("\n🎉 Vérification terminée !");
  console.log("📝 Le contrat est maintenant vérifié sur Etherscan");
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
    console.error("❌ Erreur lors de la vérification:", error);
    process.exit(1);
  });
