import { ethers } from "hardhat";
import * as fs from "fs";
import * as path from "path";

async function main() {
  console.log("🚀 Deploying ZK Verifier to Arc Testnet...\n");

  const [deployer] = await ethers.getSigners();
  const balance = await ethers.provider.getBalance(deployer.address);

  console.log("Deployer address:", deployer.address);
  console.log("Deployer balance:", ethers.formatEther(balance), "ETH\n");

  // Check if we have enough balance
  if (balance === 0n) {
    throw new Error(
      "❌ Deployer has no balance. Please fund your account with Arc testnet ETH."
    );
  }

  // Deploy UltraVerifier
  console.log("📝 Deploying UltraVerifier...");
  const UltraVerifier = await ethers.getContractFactory("UltraVerifier");
  const ultraVerifier = await UltraVerifier.deploy();
  await ultraVerifier.waitForDeployment();
  const ultraVerifierAddress = await ultraVerifier.getAddress();
  console.log("✓ UltraVerifier deployed to:", ultraVerifierAddress);

  // Deploy SecretVerifier
  console.log("\n📝 Deploying SecretVerifier...");
  const SecretVerifier = await ethers.getContractFactory("SecretVerifier");
  const secretVerifier = await SecretVerifier.deploy(ultraVerifierAddress);
  await secretVerifier.waitForDeployment();
  const secretVerifierAddress = await secretVerifier.getAddress();
  console.log("✓ SecretVerifier deployed to:", secretVerifierAddress);

  // Save deployment info
  const deploymentInfo = {
    network: "arc-testnet",
    chainId: 5042002,
    deployer: deployer.address,
    timestamp: new Date().toISOString(),
    contracts: {
      UltraVerifier: ultraVerifierAddress,
      SecretVerifier: secretVerifierAddress,
    },
    explorer: {
      UltraVerifier: `https://testnet.arcscan.app/address/${ultraVerifierAddress}`,
      SecretVerifier: `https://testnet.arcscan.app/address/${secretVerifierAddress}`,
    },
  };

  const deploymentsPath = path.join(process.cwd(), "deployments.json");
  fs.writeFileSync(deploymentsPath, JSON.stringify(deploymentInfo, null, 2));

  console.log("\n📄 Deployment info saved to deployments.json");
  console.log("\n🎉 Deployment complete!\n");
  console.log("═══════════════════════════════════════════════");
  console.log("Contract Addresses:");
  console.log("───────────────────────────────────────────────");
  console.log("UltraVerifier:  ", ultraVerifierAddress);
  console.log("SecretVerifier: ", secretVerifierAddress);
  console.log("═══════════════════════════════════════════════");
  console.log("\nView on Arc Explorer:");
  console.log(`UltraVerifier:   ${deploymentInfo.explorer.UltraVerifier}`);
  console.log(`SecretVerifier:  ${deploymentInfo.explorer.SecretVerifier}`);
  console.log("\n✓ Ready to verify proofs on Arc testnet!");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Deployment failed:", error);
    process.exit(1);
  });
