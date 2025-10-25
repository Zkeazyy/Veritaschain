import { ethers } from "hardhat";

async function main() {
  console.log("🚀 Déploiement du Veritas Token (VTS)...");
  
  // Récupération du déployeur
  const [deployer] = await ethers.getSigners();
  console.log(`📝 Déploiement avec le compte: ${deployer.address}`);
  
  // Vérification du solde
  const balance = await ethers.provider.getBalance(deployer.address);
  console.log(`💰 Solde du compte: ${ethers.formatEther(balance)} ETH`);
  
  // Déploiement du contrat VTS
  console.log("📦 Déploiement du contrat VTS...");
  const VTS = await ethers.getContractFactory("VTS");
  const vts = await VTS.deploy();
  
  await vts.waitForDeployment();
  const vtsAddress = await vts.getAddress();
  
  console.log("✅ VTS Token déployé avec succès!");
  console.log(`📍 Adresse du contrat: ${vtsAddress}`);
  
  // Informations du token
  const name = await vts.name();
  const symbol = await vts.symbol();
  const decimals = await vts.decimals();
  const totalSupply = await vts.totalSupply();
  const deployerBalance = await vts.balanceOf(deployer.address);
  
  console.log("\n📊 Informations du Token:");
  console.log(`   Nom: ${name}`);
  console.log(`   Symbole: ${symbol}`);
  console.log(`   Décimales: ${decimals}`);
  console.log(`   Supply total: ${ethers.formatEther(totalSupply)} ${symbol}`);
  console.log(`   Balance déployeur: ${ethers.formatEther(deployerBalance)} ${symbol}`);
  
  // Informations réseau
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
    console.log(`🔍 Explorer: ${explorerUrl}/address/${vtsAddress}`);
  }
  
  // Instructions pour la vérification
  console.log("\n🔐 Pour vérifier le contrat:");
  console.log(`npx hardhat verify --network ${network.name} ${vtsAddress}`);
  
  // Sauvegarde des informations de déploiement
  const deploymentInfo = {
    network: network.name,
    chainId: Number(network.chainId),
    contractAddress: vtsAddress,
    deployer: deployer.address,
    totalSupply: totalSupply.toString(),
    deployedAt: new Date().toISOString(),
    explorerUrl: explorerUrl,
  };
  
  console.log("\n💾 Informations de déploiement:");
  console.log(JSON.stringify(deploymentInfo, null, 2));
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Erreur lors du déploiement:", error);
    process.exit(1);
  });
