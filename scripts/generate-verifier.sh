#!/bin/bash
# Generate Solidity verifier from compiled circuit

set -e

echo "Generating Solidity verifier..."
cd circuits/secret_hash
nargo codegen-verifier
echo "✓ Verifier generated successfully!"

# Move the generated verifier to contracts directory
echo "Moving verifier to contracts directory..."
cp contract/secret_hash/plonk_vk.sol ../../contracts/UltraVerifier.sol
echo "✓ Verifier moved to contracts/UltraVerifier.sol"
