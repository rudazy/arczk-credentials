# ⚡ START HERE

Welcome to Arc ZK Credentials! This is your starting point.

## 🎯 What This Project Does

Proves you know a secret without revealing it, using Zero-Knowledge proofs on Arc testnet.

**Example**: You prove "I know the secret that creates commitment 0x123..." without revealing what that secret is.

## 🚀 Quick Start (5 Minutes)

### 1. Prerequisites
- [ ] Node.js installed
- [ ] Nargo (Noir compiler) installed → See [WINDOWS_SETUP.md](./WINDOWS_SETUP.md)
- [ ] Arc testnet ETH → Get from Arc faucet
- [ ] Private key ready

### 2. Setup
```bash
# Install dependencies
npm install

# Configure environment
cp .env.example .env
# Edit .env - add your PRIVATE_KEY (no 0x prefix)
```

### 3. Build & Deploy
```bash
# Compile circuit (requires Nargo - use WSL on Windows)
npm run compile-circuit

# Generate verifier contract
npm run generate-verifier

# Deploy to Arc testnet
npm run deploy
```

### 4. Use It!
```bash
# Generate a proof
npm run generate-proof 12345

# Verify on Arc testnet
npm run verify-onchain
```

Done! Check your transaction on https://testnet.arcscan.app

## 📚 Documentation

Choose your path:

### For First-Time Users
1. **[WINDOWS_SETUP.md](./WINDOWS_SETUP.md)** - Install Nargo on Windows
2. **[FINAL_SETUP_INSTRUCTIONS.md](./FINAL_SETUP_INSTRUCTIONS.md)** - Complete step-by-step guide
3. **[QUICKSTART.md](./QUICKSTART.md)** - Fastest path to deployment

### For Detailed Information
- **[README.md](./README.md)** - Complete documentation
- **[DEPLOYMENT_CHECKLIST.md](./DEPLOYMENT_CHECKLIST.md)** - Deployment checklist
- **[PROJECT_SUMMARY.md](./PROJECT_SUMMARY.md)** - Technical overview

## 🪟 Windows Users

Nargo requires WSL2 or manual installation. Two options:

**Option 1: WSL2** (Recommended)
```powershell
wsl --install
# In WSL: curl -L https://raw.githubusercontent.com/noir-lang/noirup/main/install | bash
# In WSL: noirup
```

**Option 2: PowerShell Scripts**
- Download Nargo binary from GitHub
- Use `.ps1` scripts instead of `.sh`
- See [WINDOWS_SETUP.md](./WINDOWS_SETUP.md) for details

## ⚡ Arc Testnet Info

- **RPC**: https://rpc.testnet.arc.network
- **Chain ID**: 5042002
- **Explorer**: https://testnet.arcscan.app
- **Faucet**: Get ETH from Arc Discord/docs

## 🔧 Troubleshooting

| Issue | Solution |
|-------|----------|
| "nargo: command not found" | Install Nargo → [WINDOWS_SETUP.md](./WINDOWS_SETUP.md) |
| "Circuit not found" | Run `npm run compile-circuit` |
| "Deployer has no balance" | Get Arc testnet ETH from faucet |
| "Invalid proof" | Regenerate proof with `npm run generate-proof` |

Full troubleshooting: [FINAL_SETUP_INSTRUCTIONS.md](./FINAL_SETUP_INSTRUCTIONS.md#troubleshooting)

## 📁 Project Structure

```
arczk-credentials/
├── circuits/secret_hash/    # Noir ZK circuit
├── contracts/               # Solidity verifier contracts
├── scripts/                 # Build & deployment scripts
├── test/                    # Tests
└── [multiple .md files]     # Documentation
```

## 🎓 What You'll Learn

1. **ZK Circuits** - Write Noir circuits
2. **Proof Generation** - Create ZK proofs locally
3. **Smart Contracts** - Deploy verifiers
4. **On-Chain Verification** - Verify proofs on Arc
5. **Privacy Tech** - Build privacy-preserving systems

## 🚦 Next Steps

After your first proof verification:

1. **Test More**: Try different secrets
2. **Explore Contracts**: Call contract functions
3. **Build More**: Create balance/activity proofs
4. **Add Frontend**: Build a UI
5. **Go Production**: Audit and deploy to mainnet

## 💡 Important Notes

⚠️ **This is a Demo**:
- Uses simplified hash (not full Poseidon)
- Testnet only
- Not production-ready without audit

🔒 **Security**:
- Never commit .env
- Never share private keys
- Get Arc testnet ETH only

## 📖 Learn More

- **Noir**: https://noir-lang.org/docs/
- **Arc**: https://testnet.arcscan.app
- **ZK Proofs**: https://zkp.science/

## 🤝 Support

Questions? Check the documentation in this order:
1. [FINAL_SETUP_INSTRUCTIONS.md](./FINAL_SETUP_INSTRUCTIONS.md)
2. [README.md](./README.md)
3. [WINDOWS_SETUP.md](./WINDOWS_SETUP.md) (Windows only)

---

**Ready? Start with [FINAL_SETUP_INSTRUCTIONS.md](./FINAL_SETUP_INSTRUCTIONS.md) for step-by-step deployment!**
