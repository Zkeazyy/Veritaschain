import fs from "fs";
import PDFDocument from "pdfkit";

function formatDate(tsSec) {
  const d = new Date(Number(tsSec) * 1000);
  return d.toLocaleString("fr-FR", { timeZone: "UTC" });
}

function makeCert({
  outPath,
  fileName,
  fileHash,
  txHash,
  contractAddress,
  author,
  timestamp,
  network = "Sepolia",
}) {
  const doc = new PDFDocument({ size: "A4", margin: 50 });
  doc.pipe(fs.createWriteStream(outPath));

  doc
    .fontSize(20)
    .text("Certificat d’Ancrage Blockchain — VeritasChain", { align: "center" })
    .moveDown();

  doc
    .fontSize(12)
    .text(`Fichier : ${fileName}`)
    .text(`Hash (SHA-256) : ${fileHash}`)
    .moveDown(0.5)
    .text(`Contrat : ${contractAddress}`)
    .text(`Transaction : ${txHash}`)
    .text(`Réseau : ${network}`)
    .moveDown(0.5)
    .text(`Auteur (adresse) : ${author}`)
    .text(`Horodatage (UTC) : ${formatDate(timestamp)}`)
    .moveDown();

  const etherscanTx = `https://sepolia.etherscan.io/tx/${txHash}`;
  const etherscanAddr = `https://sepolia.etherscan.io/address/${contractAddress}`;
  doc
    .fillColor("#0000EE")
    .text(`Voir la transaction : ${etherscanTx}`)
    .text(`Voir le contrat : ${etherscanAddr}`)
    .fillColor("#000");

  doc
    .moveDown(2)
    .fontSize(10)
    .text(
      "Ce certificat atteste que le hash du fichier ci-dessus a été ancré sur la blockchain Ethereum (réseau de test Sepolia). "
      + "Toute personne peut vérifier la correspondance en recalculant localement le SHA-256 du fichier original et en le comparant au hash indiqué."
    );

  doc.end();
}

// === Utilisation CLI ===
// node scripts/makeCertificate.js <fileName> <fileHash> <txHash> <contract> <author> <timestamp>
const [, , fileName, fileHash, txHash, contract, author, ts] = process.argv;

if (!fileName || !fileHash || !txHash || !contract || !author || !ts) {
  console.error("Usage: node scripts/makeCertificate.js <fileName> <fileHash> <txHash> <contract> <author> <timestampSec>");
  process.exit(1);
}

const out = `certificate_${Date.now()}.pdf`;

makeCert({
  outPath: out,
  fileName,
  fileHash,
  txHash,
  contractAddress: contract,
  author,
  timestamp: ts,
});

console.log("✅ Certificat créé :", out);
