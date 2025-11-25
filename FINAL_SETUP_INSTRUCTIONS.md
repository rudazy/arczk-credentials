# Final Setup Instructions

## Current Status ✓

All code is complete and ready. Follow these steps to deploy to Arc testnet.

## Prerequisites

### 1. Install Nargo (Noir Compiler)

**For Windows Users** - Choose ONE method:

#### Option A: WSL2 (Recommended)
```powershell
# In PowerShell (Admin)
wsl --install
# Restart computer

# In WSL Ubuntu terminal
curl -L https://raw.githubusercontent.com/noir-lang/noirup/main/install | bash
source ~/.bashrc
noirup
nargo --version
```

#### Option B: Manual Download
1. Download from: https://github.com/noir-lang/noir/releases/latest
2. Get `nargo-x86_64-pc-windows-msvc.zip`
3. Extract to `C:\nargo`
4. Add `C:\nargo` to system PATH
5. Restart terminal and verify: `nargo --version`

### 2. Get Arc Testnet ETH

- Visit Arc testnet faucet (check Arc Discord/docs)
- Request testnet ETH for your wallet address
- Verify on: https://testnet.arcscan.app

### 3. Configure Environment

```bash
# Copy template
cp .env.example .env

# Edit .env and add:
PRIVATE_KEY=your_private_key_here_without_0x
```

**IMPORTANT**:
- Do NOT include "0x" prefix in private key
- Do NOT commit .env to git (already in .gitignore)
- Ensure wallet has Arc testnet ETH

## Build & Deploy Steps

### Step 1: Compile Circuit

```bash
# If using WSL
cd /mnt/c/Users/RIKI/arczk-credentials
npm run compile-circuit

# Or manually in WSL
cd circuits/secret_hash
nargo compile
cd ../..
```

**Expected Output**:
```
✓ Circuit compiled successfully!
Output: circuits/secret_hash/target/secret_hash.json
```

**Verify**: Check that `circuits/secret_hash/target/secret_hash.json` exists

### Step 2: Generate Solidity Verifier

```bash
# In WSL or Git Bash
npm run generate-verifier
```

**Expected Output**:
```
✓ Verifier generated successfully!
✓ Verifier moved to contracts/UltraVerifier.sol
```

**Verify**: Check that `contracts/UltraVerifier.sol` exists

### Step 3: Compile Solidity Contracts

```bash
# In any terminal (Git Bash/PowerShell/WSL)
npx hardhat compile
```

**Expected Output**:
```
Compiled 3 Solidity files successfully
```

### Step 4: Deploy to Arc Testnet

```bash
npm run deploy
```

**Expected Output**:
```
🚀 Deploying ZK Verifier to Arc Testnet...

Deployer address: 0x...
Deployer balance: X.X ETH

✓ UltraVerifier deployed to: 0x...
✓ SecretVerifier deployed to: 0x...

🎉 Deployment complete!
```

**Verify**:
- Check `deployments.json` created
- Visit contract addresses on https://testnet.arcscan.app
- Both contracts should be visible

### Step 5: Generate a Proof

```bash
# Generate proof for secret number 12345
npm run generate-proof 12345
```

**Expected Output**:
```
🔐 Generating ZK Proof...

✓ Circuit loaded

Step 1: Computing Poseidon hash of secret...
Step 2: Generating witness...
✓ Witness generated

Step 3: Generating proof...
✓ Proof generated

Step 4: Verifying proof locally...
✓ Proof verified locally: true

✓ Proof saved to proof-output.json

🎉 Proof generation complete!
```

**Verify**: Check that `proof-output.json` exists

### Step 6: Verify On-Chain

```bash
npm run verify-onchain
```

**Expected Output**:
```
🔍 Verifying Proof On-Chain (Arc Testnet)...

Contract address: 0x...
Commitment: 0x...

📤 Submitting proof to Arc testnet...
Transaction hash: 0x...
✓ Transaction confirmed!

🎉 Proof verified successfully on Arc testnet!

View transaction on Arc Explorer:
https://testnet.arcscan.app/tx/0x...
```

**Verify**:
- Transaction visible on Arc Explorer
- Status: Success
- ProofVerified event emitted

## Success Checklist

After completing all steps, verify:

- [ ] Circuit compiled: `circuits/secret_hash/target/secret_hash.json` exists
- [ ] Verifier generated: `contracts/UltraVerifier.sol` exists
- [ ] Contracts deployed: `deployments.json` exists
- [ ] UltraVerifier visible on Arc Explorer
- [ ] SecretVerifier visible on Arc Explorer
- [ ] Proof generated: `proof-output.json` exists
- [ ] Proof verified on-chain successfully
- [ ] Transaction visible on Arc Explorer with Success status

## Testing Multiple Proofs

Generate and verify additional proofs:

```bash
# Different secrets create different commitments
npm run generate-proof 99999
npm run verify-onchain

npm run generate-proof 42
npm run verify-onchain
```

Each unique secret creates a unique commitment that can be verified once.

## Troubleshooting

### "nargo: command not found"
- Install Nargo (see Prerequisites above)
- Use WSL2 if Windows
- Restart terminal after installation

### "Circuit not found"
- Run: `npm run compile-circuit`
- Check you're in project root directory
- Verify Nargo is installed: `nargo --version`

### "UltraVerifier.sol not found" during compile
- Run: `npm run generate-verifier`
- Check `contracts/UltraVerifier.sol` exists

### "Deployer has no balance"
- Get Arc testnet ETH from faucet
- Verify on https://testnet.arcscan.app
- Wait for transaction to confirm

### "Proof generation failed"
- Ensure circuit is compiled first
- Check `circuits/secret_hash/target/secret_hash.json` exists
- Try with simple number: `npm run generate-proof 123`

### "Invalid proof" on-chain
- Regenerate proof: `npm run generate-proof 12345`
- Ensure proof verified locally first
- Check proof-output.json is recent

### "Already verified"
- Use different secret to create new commitment
- Each commitment can only be verified once

## Next Steps

After successful deployment:

1. **Test the System**:
   - Generate proofs with different secrets
   - Verify on-chain
   - Check events on Arc Explorer

2. **Explore the Contracts**:
   - Call `isVerified(commitment)`
   - Call `getProver(commitment)`
   - Call `getVerificationCount(yourAddress)`

3. **Build More Circuits**:
   - Create balance proof circuit
   - Create activity proof circuit
   - Combine multiple proofs

4. **Create Frontend**:
   - Build UI for proof generation
   - Display verified commitments
   - Show user's verification history

## Important Notes

⚠️ **Current Limitations** (Demo Version):
- Using simplified hash instead of full Poseidon
- For demonstration purposes only
- Not production-ready

🔒 **Security**:
- Never commit .env file
- Never share private keys
- This is testnet only
- Audit before mainnet

📝 **Production TODO**:
- Implement proper Poseidon hash in TypeScript
- Add comprehensive tests
- Security audit
- Gas optimization
- Error handling improvements

## Support & Resources

- **Project README**: `./README.md`
- **Quick Start**: `./QUICKSTART.md`
- **Windows Setup**: `./WINDOWS_SETUP.md`
- **Deployment Checklist**: `./DEPLOYMENT_CHECKLIST.md`

- **Noir Docs**: https://noir-lang.org/docs/
- **Arc Explorer**: https://testnet.arcscan.app
- **Hardhat Docs**: https://hardhat.org/docs

---

**You're ready to deploy! Start with Step 1 above.**
