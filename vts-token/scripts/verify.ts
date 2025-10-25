import { run } from "hardhat";

interface VerifyArgs {
  network: string;
  address: string;
  constructorArgs?: string[];
}

async function main() {
  console.log("🔐 Vérification du contrat VTS...");
  
  // Parse des arguments de ligne de commande
  const args = process.argv.slice(2);
  const verifyArgs: VerifyArgs = {
    network: "",
    address: "",
    constructorArgs: [],
  };
  
  // Parsing des arguments
  for (let i = 0; i < args.length; i++) {
    switch (args[i]) {
      case "--network":
        verifyArgs.network = args[i + 1];
        i++;
        break;
      case "--address":
        verifyArgs.address = args[i + 1];
        i++;
        break;
      case "--constructor-args":
        verifyArgs.constructorArgs = args[i + 1] ? args[i + 1].split(",") : [];
        i++;
        break;
    }
  }
  
  // Validation des arguments
  if (!verifyArgs.network) {
    console.error("❌ Erreur: --network est requis");
    console.log("Usage: npx ts-node scripts/verify.ts --network <network> --address <address> [--constructor-args <args>]");
    process.exit(1);
  }
  
  if (!verifyArgs.address) {
    console.error("❌ Erreur: --address est requis");
    console.log("Usage: npx ts-node scripts/verify.ts --network <network> --address <address> [--constructor-args <args>]");
    process.exit(1);
  }
  
  console.log(`🌐 Réseau: ${verifyArgs.network}`);
  console.log(`📍 Adresse: ${verifyArgs.address}`);
  
  if (verifyArgs.constructorArgs && verifyArgs.constructorArgs.length > 0) {
    console.log(`🔧 Arguments constructeur: ${verifyArgs.constructorArgs.join(", ")}`);
  }
  
  try {
    // Vérification du contrat
    console.log("⏳ Vérification en cours...");
    
    await run("verify:verify", {
      address: verifyArgs.address,
      constructorArguments: verifyArgs.constructorArgs,
    });
    
    console.log("✅ Contrat vérifié avec succès!");
    
    // URLs d'exploration
    const explorerUrls = {
      sepolia: "https://sepolia.etherscan.io",
      base: "https://basescan.org",
      polygon: "https://polygonscan.com",
    };
    
    const explorerUrl = explorerUrls[verifyArgs.network as keyof typeof explorerUrls];
    if (explorerUrl) {
      console.log(`🔍 Voir sur l'explorer: ${explorerUrl}/address/${verifyArgs.address}`);
    }
    
  } catch (error: any) {
    if (error.message.includes("Already Verified")) {
      console.log("ℹ️ Le contrat est déjà vérifié");
    } else {
      console.error("❌ Erreur lors de la vérification:", error.message);
      process.exit(1);
    }
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Erreur:", error);
    process.exit(1);
  });
