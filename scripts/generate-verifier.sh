#!/bin/bash
# Generate Solidity verifier from compiled circuit
# Modern Noir versions use different commands

set -e

echo "Generating Solidity verifier..."
cd circuits/secret_hash

# First ensure circuit is compiled
if [ ! -f "target/secret_hash.json" ]; then
    echo "Circuit not compiled. Compiling first..."
    nargo compile
fi

echo "✓ Circuit compiled"

# Try modern approach first (Noir 1.0+)
echo "Attempting to generate verifier with nargo codegen..."

# Method 1: Try nargo codegen (newer versions)
if nargo codegen-verifier 2>/dev/null; then
    echo "✓ Used nargo codegen-verifier"
elif nargo codegen 2>/dev/null; then
    echo "✓ Used nargo codegen"
else
    echo "ℹ️  nargo codegen not available, trying bb (barretenberg)..."

    # Method 2: Use bb directly
    if command -v bb &> /dev/null; then
        echo "Using bb to generate verifier..."
        bb write_vk -b target/secret_hash.json -o target/vk
        bb contract -k target/vk -o target/Verifier.sol
        echo "✓ Generated with bb"
    else
        echo "⚠️  Warning: Neither nargo codegen nor bb found"
        echo "Verifier generation may not work. Please ensure you have:"
        echo "  - Noir 1.0+ with codegen support, OR"
        echo "  - bb (barretenberg) CLI installed"
        echo ""
        echo "Trying legacy method..."
    fi
fi

# Move the generated verifier to contracts directory
echo "Moving verifier to contracts directory..."

# Try all possible locations (different Noir versions)
if [ -f "contract/secret_hash/plonk_vk.sol" ]; then
    cp contract/secret_hash/plonk_vk.sol ../../contracts/UltraVerifier.sol
    echo "✓ Found at contract/secret_hash/plonk_vk.sol"
elif [ -f "contract/plonk_vk.sol" ]; then
    cp contract/plonk_vk.sol ../../contracts/UltraVerifier.sol
    echo "✓ Found at contract/plonk_vk.sol"
elif [ -f "target/Verifier.sol" ]; then
    cp target/Verifier.sol ../../contracts/UltraVerifier.sol
    echo "✓ Found at target/Verifier.sol"
elif [ -f "target/contract.sol" ]; then
    cp target/contract.sol ../../contracts/UltraVerifier.sol
    echo "✓ Found at target/contract.sol"
else
    echo ""
    echo "❌ Error: Could not find generated verifier contract"
    echo ""
    echo "Searched locations:"
    echo "  - contract/secret_hash/plonk_vk.sol"
    echo "  - contract/plonk_vk.sol"
    echo "  - target/Verifier.sol"
    echo "  - target/contract.sol"
    echo ""
    echo "Directory contents:"
    ls -R contract/ target/ 2>/dev/null || echo "No contract/ or target/ directories found"
    echo ""
    echo "Please check your Noir/nargo version: nargo --version"
    exit 1
fi

echo "✓ Verifier moved to contracts/UltraVerifier.sol"
