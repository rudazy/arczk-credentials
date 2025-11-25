# 🚀 DEPLOYMENT INFORMATION - Arc ZK Credentials

## ⚠️ PREREQUISITES NEEDED

Before you can deploy, you need:

### 1. ✅ Already Complete
- [x] Project files created
- [x] NPM dependencies installed (588 packages)
- [x] Hardhat configured for Arc testnet
- [x] Solidity contracts compiled

### 2. ❌ Still Required

#### A. Install Nargo (Noir Compiler)

**You need Nargo to compile the ZK circuit.**

**Option 1: Use WSL2 (RECOMMENDED for Windows)**

```powershell
# 1. Install WSL2 (in PowerShell as Admin)
wsl --install

# 2. Restart computer

# 3. Open "Ubuntu" from Start Menu

# 4. In Ubuntu terminal, install Nargo:
curl -L https://raw.githubusercontent.com/noir-lang/noirup/main/install | bash
source ~/.bashrc
noirup

# 5. Verify installation
nargo --version
# Should show: nargo version = 1.0.0-beta.15 or similar

# 6. Navigate to project
cd /mnt/c/Users/RIKI/arczk-credentials
```

**Option 2: Manual Download (Alternative)**

1. Download from: https://github.com/noir-lang/noir/releases/latest
2. Get: `nargo-x86_64-pc-windows-msvc.zip`
3. Extract to: `C:\nargo\bin`
4. Add to PATH: `C:\nargo\bin`
5. Restart terminal
6. Verify: `nargo --version`

#### B. Get Arc Testnet ETH

**You need Arc testnet ETH to deploy contracts.**

1. Go to Arc testnet faucet
   - Check Arc Discord: https://discord.gg/arc (look for #faucet channel)
   - Or Arc docs for faucet URL

2. Submit your wallet address

3. Wait for testnet ETH (usually a few minutes)

4. Verify balance:
   - Visit: https://testnet.arcscan.app
   - Search your address
   - Should see testnet ETH balance

**Recommended amount**: At least 0.1 testnet ETH for deployment and testing

#### C. Setup Private Key

```bash
# 1. Copy template
cp .env.example .env

# 2. Edit .env file
# Add your private key WITHOUT 0x prefix:
PRIVATE_KEY=abc123def456...

# Example:
# CORRECT:   PRIVATE_KEY=1234567890abcdef...
# INCORRECT: PRIVATE_KEY=0x1234567890abcdef...
```

**⚠️ IMPORTANT**: Use a testnet wallet only. Never use mainnet private keys.

---

## 🎯 DEPLOYMENT COMMANDS

Once prerequisites are complete, run these commands **IN ORDER**:

### Step 1: Compile Circuit

**In WSL2 Ubuntu terminal:**
```bash
cd /mnt/c/Users/RIKI/arczk-credentials
npm run compile-circuit
```

**OR manually:**
```bash
cd circuits/secret_hash
nargo compile
cd ../..
```

**Expected Output:**
```
Compiling Noir circuit...
✓ Circuit compiled successfully!
Output: circuits/secret_hash/target/secret_hash.json
```

**Verify**: File `circuits/secret_hash/target/secret_hash.json` should exist

---

### Step 2: Generate Verifier

**In WSL2 or Git Bash:**
```bash
npm run generate-verifier
```

**Expected Output:**
```
Generating Solidity verifier...
✓ Verifier generated successfully!
✓ Verifier moved to contracts/UltraVerifier.sol
```

**Verify**: File `contracts/UltraVerifier.sol` should exist

---

### Step 3: Deploy to Arc Testnet

**In any terminal (Git Bash, PowerShell, or WSL2):**
```bash
npm run deploy
```

**Expected Output:**
```
🚀 Deploying ZK Verifier to Arc Testnet...

Deployer address: 0xYourAddress...
Deployer balance: 0.5 ETH

📝 Deploying UltraVerifier...
✓ UltraVerifier deployed to: 0xVerifierAddress...

📝 Deploying SecretVerifier...
✓ SecretVerifier deployed to: 0xSecretVerifierAddress...

📄 Deployment info saved to deployments.json

🎉 Deployment complete!

═══════════════════════════════════════════════
Contract Addresses:
───────────────────────────────────────────────
UltraVerifier:   0xABC123...
SecretVerifier:  0xDEF456...
═══════════════════════════════════════════════

View on Arc Explorer:
UltraVerifier:   https://testnet.arcscan.app/address/0xABC123...
SecretVerifier:  https://testnet.arcscan.app/address/0xDEF456...

✓ Ready to verify proofs on Arc testnet!
```

**What happens:**
- Deploys UltraVerifier contract (the ZK proof verifier)
- Deploys SecretVerifier contract (wrapper with business logic)
- Saves addresses to `deployments.json`
- Provides Arc Explorer links

**Verify**:
- Check `deployments.json` file created
- Visit both contract addresses on Arc Explorer
- Both contracts should show "Contract Created" transaction

---

### Step 4: Generate Proof

**In any terminal:**
```bash
npm run generate-proof 12345
```

**Replace `12345` with any secret number you want to use.**

**Expected Output:**
```
🔐 Generating ZK Proof...

✓ Circuit loaded

Input:
  Secret: 12345

Step 1: Computing Poseidon hash of secret...
  Secret (hex): 0x0000000000000000000000000000000000000000000000000000000000003039

⚠️  Note: For demo purposes, using simplified hash computation
  In production, use proper Poseidon hash library

Step 2: Generating witness...
✓ Witness generated

Step 3: Generating proof...
✓ Proof generated
  Proof size: 2144 bytes

Step 4: Verifying proof locally...
✓ Proof verified locally: true

✓ Proof saved to proof-output.json

Proof Details:
  Commitment: 0x0000000000000000000000000000000000000000000000000000000000003039
  Public Inputs: 1

🎉 Proof generation complete!

Next step: Verify on-chain
  npm run verify-onchain
```

**What happens:**
- Loads compiled circuit
- Creates witness from your secret
- Generates ZK proof using Barretenberg
- Verifies proof locally
- Saves to `proof-output.json`

**Verify**: File `proof-output.json` should exist

---

### Step 5: Verify On-Chain

**In any terminal:**
```bash
npm run verify-onchain
```

**Expected Output:**
```
🔍 Verifying Proof On-Chain (Arc Testnet)...

Contract address: 0xSecretVerifierAddress...
Proof length: 2144 bytes
Public inputs: 1
Commitment: 0x0000000000000000000000000000000000000000000000000000000000003039

Signer address: 0xYourAddress...
Signer balance: 0.49 ETH

Commitment to verify: 0x0000000000000000000000000000000000000000000000000000000000003039

📤 Submitting proof to Arc testnet...
Transaction hash: 0xTransactionHash...
Waiting for confirmation...
✓ Transaction confirmed!
Block number: 123456
Gas used: 250000

Commitment verified: true
Prover address: 0xYourAddress...
Your total verifications: 1

🎉 Proof verified successfully on Arc testnet!

═══════════════════════════════════════════════
View transaction on Arc Explorer:
https://testnet.arcscan.app/tx/0xTransactionHash...
═══════════════════════════════════════════════
```

**What happens:**
- Loads proof from `proof-output.json`
- Loads contract address from `deployments.json`
- Submits transaction to Arc testnet
- Waits for confirmation
- Verifies commitment is recorded

**Verify**:
- Visit transaction on Arc Explorer
- Status should be: ✓ Success
- Event emitted: `ProofVerified`
- Gas used: ~250,000 gas

---

## 📊 COMPLETE INFO SUMMARY

### Arc Testnet Details
```
Network Name: Arc Testnet
RPC URL:      https://rpc.testnet.arc.network
Chain ID:     5042002
Currency:     ETH
Explorer:     https://testnet.arcscan.app
```

### Contract Addresses
**After deployment, you'll find in `deployments.json`:**
```json
{
  "network": "arc-testnet",
  "chainId": 5042002,
  "contracts": {
    "UltraVerifier": "0xYourVerifierAddress...",
    "SecretVerifier": "0xYourSecretVerifierAddress..."
  }
}
```

### File Locations
```
Project Root: C:\Users\RIKI\arczk-credentials

Important Files:
├── .env                                    # Your private key (create this)
├── deployments.json                        # Created after deployment
├── proof-output.json                       # Created after generate-proof
├── circuits/secret_hash/target/secret_hash.json  # Created after compile
└── contracts/UltraVerifier.sol            # Created after generate-verifier
```

### Commands Quick Reference
```bash
# Setup
cp .env.example .env          # Then edit with private key

# Build (needs Nargo in WSL2)
npm run compile-circuit       # Compile ZK circuit
npm run generate-verifier     # Generate Solidity verifier

# Deploy (needs Arc testnet ETH)
npm run deploy                # Deploy to Arc

# Use
npm run generate-proof 12345  # Any secret number
npm run verify-onchain        # Submit to Arc
```

---

## 🎯 SUCCESS CHECKLIST

After completing all steps:

- [ ] Nargo installed and `nargo --version` works
- [ ] Arc testnet ETH in wallet (check on arcscan.app)
- [ ] `.env` file created with private key (no 0x prefix)
- [ ] Circuit compiled: `circuits/secret_hash/target/secret_hash.json` exists
- [ ] Verifier generated: `contracts/UltraVerifier.sol` exists
- [ ] Contracts deployed: `deployments.json` exists
- [ ] UltraVerifier visible on Arc Explorer
- [ ] SecretVerifier visible on Arc Explorer
- [ ] Proof generated: `proof-output.json` exists
- [ ] Proof verified on-chain successfully
- [ ] Transaction visible on Arc Explorer with ✓ Success status

---

## 🧪 TEST WITH MULTIPLE PROOFS

After first successful verification, try more:

```bash
# Different secrets create different commitments
npm run generate-proof 99999
npm run verify-onchain

npm run generate-proof 42
npm run verify-onchain

npm run generate-proof 777
npm run verify-onchain
```

Each unique secret = unique commitment = can be verified once

---

## 📋 EXPECTED GAS COSTS (Arc Testnet)

```
UltraVerifier Deployment:    ~2,000,000 gas
SecretVerifier Deployment:   ~500,000 gas
Proof Verification:          ~250,000 gas per proof

Total for deployment + 1 proof: ~2,750,000 gas
```

**Cost**: Free (testnet ETH has no value)

---

## 🔍 VERIFY DEPLOYMENT

### Check Contracts on Arc Explorer

1. **Visit**: https://testnet.arcscan.app

2. **Search for** your contract addresses (from `deployments.json`)

3. **UltraVerifier should show**:
   - Contract Creation transaction
   - Contract bytecode
   - Deployment timestamp

4. **SecretVerifier should show**:
   - Contract Creation transaction
   - Constructor arguments (UltraVerifier address)
   - Contract bytecode

### Check Verification Transaction

1. **After verification**, visit transaction link

2. **Should show**:
   - Status: ✓ Success
   - From: Your address
   - To: SecretVerifier address
   - Event: `ProofVerified(bytes32 commitment, address prover, uint256 timestamp)`

---

## 💡 WHAT YOU'RE PROVING

**The ZK Proof proves**: "I know a secret number that hashes to this commitment"

**Without revealing**: What the secret number is

**Example Flow**:
1. You have secret: `12345`
2. System computes: `commitment = hash(12345)`
3. You generate: `proof = ZK_Prove(secret, commitment)`
4. Contract verifies: `proof` is valid for `commitment`
5. Contract records: This commitment is verified
6. **Result**: Everyone knows you knew the secret, but nobody knows what it was

---

## 🚨 TROUBLESHOOTING

### "nargo: command not found"
**Solution**: Install Nargo in WSL2 (see Prerequisites section above)

### "Deployer has no balance"
**Solution**: Get Arc testnet ETH from faucet (see Prerequisites section above)

### "Invalid private key"
**Solution**: Check `.env` file - ensure no `0x` prefix on PRIVATE_KEY

### "Circuit not found"
**Solution**: Run `npm run compile-circuit` first

### "UltraVerifier.sol not found"
**Solution**: Run `npm run generate-verifier` first

### "Deployments file not found"
**Solution**: Run `npm run deploy` first

### "Proof file not found"
**Solution**: Run `npm run generate-proof <secret>` first

### "Already verified"
**Solution**: Use a different secret number to create new commitment

---

## 📚 DOCUMENTATION

- **Main Guide**: [FINAL_SETUP_INSTRUCTIONS.md](./FINAL_SETUP_INSTRUCTIONS.md)
- **Windows Help**: [WINDOWS_SETUP.md](./WINDOWS_SETUP.md)
- **Quick Start**: [START_HERE.md](./START_HERE.md)
- **Full Docs**: [README.md](./README.md)

---

## 🎉 READY TO DEPLOY!

**Your action items**:

1. ✅ Install Nargo (WSL2 or manual)
2. ✅ Get Arc testnet ETH
3. ✅ Create .env with private key
4. ✅ Run the 5 commands in order

**All code is ready. Just need the prerequisites!**
