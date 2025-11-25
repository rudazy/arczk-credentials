import { ethers } from "hardhat";
import * as fs from "fs";
import * as path from "path";

async function verifyOnChain() {
  console.log("🔍 Verifying Proof On-Chain (Arc Testnet)...\n");

  // Load deployment info
  const deploymentsPath = path.join(process.cwd(), "deployments.json");
  if (!fs.existsSync(deploymentsPath)) {
    throw new Error(
      "Deployments file not found. Please deploy contracts first: npm run deploy"
    );
  }

  const deployments = JSON.parse(fs.readFileSync(deploymentsPath, "utf-8"));
  const secretVerifierAddress = deployments.contracts.SecretVerifier;

  console.log("Contract address:", secretVerifierAddress);

  // Load proof data
  const proofPath = path.join(process.cwd(), "proof-output.json");
  if (!fs.existsSync(proofPath)) {
    throw new Error(
      "Proof file not found. Please generate a proof first: npm run generate-proof <secret>"
    );
  }

  const proofData = JSON.parse(fs.readFileSync(proofPath, "utf-8"));
  const proof = "0x" + proofData.proof;
  const publicInputs = proofData.publicInputs;

  console.log("Proof length:", proofData.proof.length / 2, "bytes");
  console.log("Public inputs:", publicInputs);

  // Get signer
  const [signer] = await ethers.getSigners();
  const balance = await ethers.provider.getBalance(signer.address);

  console.log("\nSigner address:", signer.address);
  console.log("Signer balance:", ethers.formatEther(balance), "ETH");

  if (balance === 0n) {
    throw new Error("Signer has no balance. Please fund your account.");
  }

  // Connect to contract
  const SecretVerifier = await ethers.getContractFactory("SecretVerifier");
  const secretVerifier = SecretVerifier.attach(secretVerifierAddress);

  // Prepare commitment (first public input)
  const commitment = publicInputs[0];
  console.log("\nCommitment to verify:", commitment);

  // Check if already verified
  const isAlreadyVerified = await secretVerifier.isVerified(commitment);
  if (isAlreadyVerified) {
    console.log("\n⚠️  This commitment has already been verified!");
    const prover = await secretVerifier.getProver(commitment);
    console.log("Original prover:", prover);
    return;
  }

  // Submit proof for verification
  console.log("\n📤 Submitting proof to Arc testnet...");
  try {
    const tx = await secretVerifier.verifySecret(proof, commitment);
    console.log("Transaction hash:", tx.hash);
    console.log("Waiting for confirmation...");

    const receipt = await tx.wait();
    console.log("✓ Transaction confirmed!");
    console.log("Block number:", receipt?.blockNumber);
    console.log("Gas used:", receipt?.gasUsed.toString());

    // Verify the commitment is now marked as verified
    const isVerified = await secretVerifier.isVerified(commitment);
    console.log("\nCommitment verified:", isVerified);

    const prover = await secretVerifier.getProver(commitment);
    console.log("Prover address:", prover);

    const count = await secretVerifier.getVerificationCount(signer.address);
    console.log("Your total verifications:", count.toString());

    console.log("\n🎉 Proof verified successfully on Arc testnet!");
    console.log("\n═══════════════════════════════════════════════");
    console.log("View transaction on Arc Explorer:");
    console.log(`https://testnet.arcscan.app/tx/${tx.hash}`);
    console.log("═══════════════════════════════════════════════");
  } catch (error: any) {
    console.error("\n❌ Verification failed!");
    if (error.message.includes("Invalid proof")) {
      console.error("The proof is invalid. Please generate a valid proof.");
    } else if (error.message.includes("Already verified")) {
      console.error("This commitment has already been verified.");
    } else {
      console.error("Error:", error.message);
    }
    throw error;
  }
}

verifyOnChain()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("Error:", error);
    process.exit(1);
  });
