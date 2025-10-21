import "dotenv/config";
import { readFileSync, existsSync } from "fs";
import { createHash } from "crypto";
import path from "path";
import { createWalletClient, createPublicClient, http, parseAbi } from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { sepolia } from "viem/chains";

// Utilitaire centralisé pour le hachage (même format que côté web)
function sha256HexFile(filePath) {
  const buf = readFileSync(filePath);
  const hash = createHash("sha256").update(buf).digest("hex");
  return "0x" + hash; // Format uniforme : 0x + hex minuscule
}

async function main() {
  const address =
    process.env.CONTRACT_ADDRESS ||
    "0x7b7C41cf5bc986F406c7067De6e69f200c27D63f"; // ton contrat

  // chemin du PDF
  const filePath = path.resolve("./files/contrat.pdf");
  if (!existsSync(filePath)) {
    throw new Error(`Fichier introuvable: ${filePath}`);
  }

  const h = sha256HexFile(filePath);
  console.log("📄 Hash du fichier :", h);

  // clients viem (signer + lecteur) basés sur ton .env
  const account = privateKeyToAccount(process.env.PRIVATE_KEY);
  const wallet = createWalletClient({
    account,
    chain: sepolia,
    transport: http(process.env.SEPOLIA_RPC_URL),
  });
  const rpc = createPublicClient({
    chain: sepolia,
    transport: http(process.env.SEPOLIA_RPC_URL),
  });

  const abi = parseAbi([
    "function anchor(bytes32 docHash)",
    "function verify(bytes32 docHash) view returns (address,uint256)",
  ]);

  const txHash = await wallet.writeContract({
    address,
    abi,
    functionName: "anchor",
    args: [h],
  });
  console.log("🧾 Transaction envoyée :", txHash);

  const receipt = await rpc.waitForTransactionReceipt({ hash: txHash });
  console.log("✅ Confirmée dans le bloc :", Number(receipt.blockNumber));

  const [author, ts] = await rpc.readContract({
    address,
    abi,
    functionName: "verify",
    args: [h],
  });
  console.log("✅ Auteur :", author, "— Horodatage :", Number(ts));
}

main().catch((e) => {
  console.error("❌ ERREUR :", e.message || e);
  process.exit(1);
});
