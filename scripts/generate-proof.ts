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

  console.log("\nInput:");
  console.log("  Secret:", secret);

  try {
    // Step 1: Execute circuit to compute the hash
    // The circuit uses Pedersen hash (stable across Noir versions)
    console.log("\nStep 1: Computing Pedersen hash of secret...");

    // Convert secret to hex bytes32 for compatibility
    const secretBigInt = BigInt(secret);
    const secretHex = "0x" + secretBigInt.toString(16).padStart(64, "0");

    console.log("  Secret (hex):", secretHex);
    console.log("\n⚠️  Note: Using simplified demo approach");
    console.log("  The circuit will compute Pedersen hash internally");
    console.log("  For this demo, we use a placeholder that will be computed by circuit\n");

    // For demo: we let the circuit compute the hash and use public outputs
    // In production, you'd compute the Pedersen hash in TypeScript to verify first
    // TODO: Add proper Pedersen hash computation library for verification
    const mockHash = secretHex;

    console.log("Step 2: Generating witness...");
    const inputs = {
      secret: secretHex,
      pub_hash: mockHash,
    };

    const { witness, returnValue } = await noir.execute(inputs);
    console.log("✓ Witness generated");

    // Generate proof
    console.log("\nStep 3: Generating proof...");
    const proof = await backend.generateProof(witness);
    console.log("✓ Proof generated");
    console.log("  Proof size:", proof.proof.length, "bytes");

    // Verify proof locally before saving
    console.log("\nStep 4: Verifying proof locally...");
    const publicInputs = await backend.getPublicInputs(witness);
    const isValid = await backend.verifyProof(proof);
    console.log("✓ Proof verified locally:", isValid);

    if (!isValid) {
      throw new Error("Generated proof is invalid!");
    }

    // Save proof data
    const proofOutput = {
      proof: "0x" + Buffer.from(proof.proof).toString("hex"),
      publicInputs: publicInputs.map((input: any) =>
        "0x" + BigInt(input).toString(16).padStart(64, "0")
      ),
      commitment: mockHash,
      secret: secretHex,
      timestamp: new Date().toISOString(),
      note: "Demo version: Circuit uses Pedersen hash. For production, compute hash in TypeScript first for verification."
    };

    const outputPath = path.join(process.cwd(), "proof-output.json");
    fs.writeFileSync(outputPath, JSON.stringify(proofOutput, null, 2));

    console.log("\n✓ Proof saved to proof-output.json");
    console.log("\nProof Details:");
    console.log("  Commitment:", proofOutput.commitment);
    console.log("  Public Inputs:", proofOutput.publicInputs.length);
    console.log("\n🎉 Proof generation complete!");
    console.log("\nNext step: Verify on-chain");
    console.log("  npm run verify-onchain");
  } catch (error: any) {
    console.error("\n❌ Proof generation failed:");
    console.error("Error:", error.message);
    if (error.stack) {
      console.error("\nStack trace:");
      console.error(error.stack);
    }
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
