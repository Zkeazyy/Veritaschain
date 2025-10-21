import { viem } from "hardhat";
import { keccak256, toHex } from "viem";

async function main() {
  console.log("🚀 Démarrage anchor.js");

  const address = "0x7b7C41cf5bc986F406c7067De6e69f200c27D63f";
  const c = await viem.getContractAt("DocumentRegistry", address);

  const content = "MonPremierDocumentDeTest";
  const h = keccak256(toHex(content));
  console.log("📄 Hash:", h);

  const tx = await c.write.anchor([h]);
  console.log("🧾 Tx:", tx);

  const [author, ts] = await c.read.verify([h]);
  console.log("✅ Author:", author, "— ts:", Number(ts));
}

main().catch((e) => { console.error(e); process.exit(1); });
