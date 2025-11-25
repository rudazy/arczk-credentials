import { Noir } from "@noir-lang/noir_js";
import { BarretenbergBackend } from "@noir-lang/backend_barretenberg";
import * as fs from "fs";
import * as path from "path";

async function generateProof(secret: string) {
  console.log("🔐 Generating ZK Proof...\n");

  // Load the compiled circuit
  const circuitPath = path.join(
    process.cwd(),
    "circuits/secret_hash/target/secret_hash.json"
  );

  if (!fs.existsSync(circuitPath)) {
    throw new Error(
      `Circuit not found at ${circuitPath}. Run: npm run compile-circuit`
    );
  }

  const circuit = JSON.parse(fs.readFileSync(circuitPath, "utf-8"));
  console.log("✓ Circuit loaded");

  // Initialize backend and Noir
  const backend = new BarretenbergBackend(circuit);
  const noir = new Noir(circuit);

  // Convert secret to Field element (this is a simple conversion)
  // In production, you'd want more sophisticated secret handling
  const secretField = secret;

  console.log("\nInput:");
  console.log("  Secret:", secret);

  // For now, we need to manually compute the hash
  // In a real scenario, you'd use a proper Poseidon hash library or
  // let the circuit do the hashing and we just verify
  console.log("\n⚠️  Note: You need to compute the Poseidon hash separately");
  console.log("  This script will be updated once we can compute it properly\n");

  // Generate inputs for the circuit
  const inputs = {
    secret: secretField,
    pub_hash: "0x0", // This needs to be the actual Poseidon hash
  };

  try {
    // Generate witness
    console.log("Generating witness...");
    const { witness } = await noir.execute(inputs);
    console.log("✓ Witness generated");

    // Generate proof
    console.log("Generating proof...");
    const proof = await backend.generateProof(witness);
    console.log("✓ Proof generated");

    // Verify proof locally before saving
    console.log("Verifying proof locally...");
    const isValid = await backend.verifyProof(proof);
    console.log("✓ Proof verified locally:", isValid);

    if (!isValid) {
      throw new Error("Generated proof is invalid!");
    }

    // Save proof data
    const proofOutput = {
      proof: Buffer.from(proof.proof).toString("hex"),
      publicInputs: proof.publicInputs,
      timestamp: new Date().toISOString(),
    };

    const outputPath = path.join(process.cwd(), "proof-output.json");
    fs.writeFileSync(outputPath, JSON.stringify(proofOutput, null, 2));

    console.log("\n✓ Proof saved to proof-output.json");
    console.log("\n🎉 Proof generation complete!");
    console.log("\nYou can now verify this proof on-chain using:");
    console.log("  npm run verify-onchain");
  } catch (error: any) {
    console.error("\n❌ Proof generation failed:", error.message);
    throw error;
  }
}

// Parse command line arguments
const args = process.argv.slice(2);
if (args.length === 0) {
  console.log("Usage: npm run generate-proof <secret>");
  console.log("Example: npm run generate-proof 12345");
  process.exit(1);
}

const secret = args[0];

generateProof(secret)
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("Error:", error);
    process.exit(1);
  });
