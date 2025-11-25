#!/bin/bash
# Compile the Noir circuit

set -e

echo "Compiling Noir circuit..."
cd circuits/secret_hash
nargo compile
echo "✓ Circuit compiled successfully!"
echo "Output: circuits/secret_hash/target/secret_hash.json"
