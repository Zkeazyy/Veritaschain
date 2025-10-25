import { ethers } from "hardhat";

async function main() {
  console.log("⛽ Estimation du coût de gas pour le déploiement VTS...");
  
  // Récupération du déployeur
  const [deployer] = await ethers.getSigners();
  console.log(`📝 Compte: ${deployer.address}`);
  
  // Vérification du solde
  const balance = await ethers.provider.getBalance(deployer.address);
  console.log(`💰 Solde: ${ethers.formatEther(balance)} ETH`);
  
  // Estimation du gas
  console.log("⏳ Estimation du gas...");
  const VTS = await ethers.getContractFactory("VTS");
  
  try {
    const deployTx = await VTS.getDeployTransaction();
    const gasEstimate = await ethers.provider.estimateGas(deployTx);
    
    console.log(`⛽ Gas estimé: ${gasEstimate.toString()}`);
    
    // Estimation du coût (en utilisant un prix de gas fixe)
    const estimatedGasPrice = ethers.parseUnits("20", "gwei"); // 20 Gwei
    const totalCost = gasEstimate * estimatedGasPrice;
    console.log(`💰 Prix du gas estimé: 20 Gwei`);
    console.log(`💸 Coût total estimé: ${ethers.formatEther(totalCost)} ETH`);
    
    // Vérification du solde suffisant
    if (balance >= totalCost) {
      console.log("✅ Solde suffisant pour le déploiement");
    } else {
      console.log("❌ Solde insuffisant pour le déploiement");
      console.log(`   Manquant: ${ethers.formatEther(totalCost - balance)} ETH`);
    }
    
  } catch (error) {
    console.error("❌ Erreur lors de l'estimation:", error);
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Erreur:", error);
    process.exit(1);
  });
