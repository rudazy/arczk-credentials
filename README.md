# Arc ZK Credentials

Zero-Knowledge proof system deployed on Arc testnet. Prove you know a secret without revealing it.

## Overview

This project demonstrates a complete ZK proof pipeline:
1. **Noir Circuit**: Proves knowledge of a secret that hashes to a public commitment
2. **Solidity Verifier**: On-chain verification contract deployed to Arc testnet
3. **Proof Generation**: Generate ZK proofs locally using Barretenberg
4. **On-Chain Verification**: Submit and verify proofs on Arc testnet

## Arc Testnet Details

- **RPC URL**: https://rpc.testnet.arc.network
- **Chain ID**: 5042002
- **Explorer**: https://testnet.arcscan.app
- **Faucet**: Get testnet ETH to deploy contracts and submit proofs

## Prerequisites

1. **Nargo** (Noir compiler) - Install from [Noir's website](https://noir-lang.org/docs/getting_started/installation/)
   ```bash
   curl -L https://raw.githubusercontent.com/noir-lang/noirup/main/install | bash
   noirup
   ```

2. **Node.js** - v18 or higher

3. **Git Bash** or **WSL** (for Windows users) - Required to run bash scripts

4. **Arc Testnet ETH** - Get from Arc faucet for deployment and transactions

## Project Structure

```
arczk-credentials/
├── circuits/
│   └── secret_hash/          # Noir circuit
│       ├── src/
│       │   └── main.nr       # Circuit logic
│       └── Nargo.toml        # Circuit config
├── contracts/
│   ├── UltraVerifier.sol     # Generated verifier (after compilation)
│   └── SecretVerifier.sol    # Wrapper contract with business logic
├── scripts/
│   ├── compile-circuit.sh    # Compile Noir circuit
│   ├── generate-verifier.sh  # Generate Solidity verifier
│   ├── deploy.ts             # Deploy to Arc testnet
│   ├── generate-proof.ts     # Generate ZK proof
│   └── verify-onchain.ts     # Verify proof on Arc
├── test/                     # Tests (TODO)
└── README.md
```

## Setup

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment

```bash
cp .env.example .env
```

Edit `.env` and add your private key (without 0x prefix):
```
PRIVATE_KEY=your_private_key_here
```

**Important**: Ensure this wallet has Arc testnet ETH for deployment.

## Usage

### Step 1: Compile Circuit

Compile the Noir circuit to generate the constraint system:

```bash
npm run compile-circuit
```

This creates `circuits/secret_hash/target/secret_hash.json`.

### Step 2: Generate Solidity Verifier

Generate the Solidity verifier contract from the compiled circuit:

```bash
npm run generate-verifier
```

This creates `contracts/UltraVerifier.sol` from the Noir circuit.

### Step 3: Deploy to Arc Testnet

Deploy both the UltraVerifier and SecretVerifier contracts:

```bash
npm run deploy
```

This will:
- Deploy UltraVerifier contract
- Deploy SecretVerifier contract (uses UltraVerifier)
- Save deployment info to `deployments.json`
- Display contract addresses and Explorer links

Example output:
```
🚀 Deploying ZK Verifier to Arc Testnet...

Deployer address: 0x1234...
Deployer balance: 1.5 ETH

✓ UltraVerifier deployed to: 0xabcd...
✓ SecretVerifier deployed to: 0xef01...

View on Arc Explorer:
UltraVerifier:   https://testnet.arcscan.app/address/0xabcd...
SecretVerifier:  https://testnet.arcscan.app/address/0xef01...
```

### Step 4: Generate a Proof

Generate a ZK proof that you know a secret:

```bash
npm run generate-proof 12345
```

Replace `12345` with your secret number. This will:
- Compute the Poseidon hash of your secret
- Generate a ZK proof using Barretenberg backend
- Save proof to `proof-output.json`
- Verify the proof locally before saving

### Step 5: Verify On-Chain

Submit the proof to the Arc testnet for verification:

```bash
npm run verify-onchain
```

This will:
- Load the proof from `proof-output.json`
- Load the contract address from `deployments.json`
- Submit the proof transaction to Arc testnet
- Display transaction hash and Explorer link

Example output:
```
🔍 Verifying Proof On-Chain (Arc Testnet)...

Contract address: 0xef01...
Proof length: 2144 bytes

📤 Submitting proof to Arc testnet...
Transaction hash: 0x5678...
✓ Transaction confirmed!

🎉 Proof verified successfully on Arc testnet!

View transaction on Arc Explorer:
https://testnet.arcscan.app/tx/0x5678...
```

## How It Works

### The Circuit (`circuits/secret_hash/src/main.nr`)

```noir
use std::hash::poseidon;

fn main(
    secret: Field,      // Private: the secret you know
    pub_hash: pub Field // Public: the commitment (hash)
) {
    let computed_hash = poseidon::bn254::hash_1([secret]);
    assert(computed_hash == pub_hash);
}
```

This circuit proves: "I know a `secret` such that `poseidon(secret) == pub_hash`"

### The Smart Contract

**SecretVerifier.sol** provides:
- `verifySecret(proof, commitment)` - Verify a proof and record it
- `isVerified(commitment)` - Check if a commitment has been verified
- `getProver(commitment)` - Get the address that verified a commitment
- `getVerificationCount(address)` - Get total verifications by an address

### The Workflow

1. **Prover** has a secret number (e.g., 12345)
2. **Prover** computes: `commitment = poseidon(secret)`
3. **Prover** generates: `proof = ZK_Prove(secret, commitment)`
4. **Prover** submits: `contract.verifySecret(proof, commitment)`
5. **Contract** verifies proof without learning the secret
6. **Contract** records the commitment as verified

## Smart Contract Interface

```solidity
interface ISecretVerifier {
    function verifySecret(bytes calldata proof, bytes32 commitment) external;
    function isVerified(bytes32 commitment) external view returns (bool);
    function getProver(bytes32 commitment) external view returns (address);
    function getVerificationCount(address prover) external view returns (uint256);
}
```

## Testing

Run local tests:

```bash
npm test
```

## Troubleshooting

### Circuit compilation fails
- Ensure Nargo is installed: `nargo --version`
- Check you're in the right directory
- Try: `cd circuits/secret_hash && nargo check`

### Deployment fails
- Check you have Arc testnet ETH in your wallet
- Verify your `.env` file has the correct private key
- Ensure you're connected to Arc testnet RPC

### Proof generation fails
- Make sure the circuit is compiled: `npm run compile-circuit`
- Check that `circuits/secret_hash/target/secret_hash.json` exists

### On-chain verification fails
- Ensure contracts are deployed: `npm run deploy`
- Check `deployments.json` exists with contract addresses
- Verify you have a valid proof in `proof-output.json`
- Ensure the commitment hasn't been verified already

## Next Steps

This is the foundation for a larger credential system. Future additions:

1. **Balance Proofs**: Prove you have balance > X without revealing exact amount
2. **Activity Proofs**: Prove you've made N transactions without revealing which ones
3. **Multi-credential**: Combine multiple proofs into one
4. **Credential NFTs**: Issue NFTs based on verified proofs
5. **Privacy-preserving DeFi**: Use ZK credentials for private DeFi interactions

## Security Notes

- This is a testnet demonstration project
- Do not use production private keys
- Secrets are not encrypted in this demo
- Production systems need secure secret management
- Always audit smart contracts before mainnet deployment

## Resources

- [Noir Documentation](https://noir-lang.org/docs/)
- [Arc Testnet](https://testnet.arcscan.app)
- [Barretenberg](https://github.com/AztecProtocol/barretenberg)
- [Hardhat](https://hardhat.org/docs)

## License

MIT
