# Quick Start Guide

Get your ZK proof system running on Arc testnet in 5 minutes.

## Prerequisites Checklist

- [ ] Nargo installed (`nargo --version`)
- [ ] Node.js v18+ installed (`node --version`)
- [ ] Git Bash or WSL (Windows users)
- [ ] Arc testnet ETH in your wallet

## Quick Setup

```bash
# 1. Install dependencies
npm install

# 2. Setup environment
cp .env.example .env
# Edit .env and add your PRIVATE_KEY

# 3. Compile the circuit
npm run compile-circuit

# 4. Generate verifier contract
npm run generate-verifier

# 5. Deploy to Arc testnet
npm run deploy

# 6. Generate a proof
npm run generate-proof 12345

# 7. Verify on-chain
npm run verify-onchain
```

## Getting Arc Testnet ETH

1. Visit the Arc faucet (check Arc Discord or docs)
2. Submit your wallet address
3. Wait for testnet ETH to arrive
4. Check balance: https://testnet.arcscan.app

## Verifying It Works

After step 7, you should see:
- ✓ Transaction confirmed on Arc testnet
- ✓ Transaction hash displayed
- ✓ Explorer link to view your proof verification

## Troubleshooting

**"nargo: command not found"**
- Install Nargo: `curl -L https://raw.githubusercontent.com/noir-lang/noirup/main/install | bash`
- Run: `noirup`
- Restart terminal

**"Deployer has no balance"**
- Get Arc testnet ETH from faucet
- Verify on https://testnet.arcscan.app

**"Circuit not found"**
- Run: `npm run compile-circuit`
- Check: `circuits/secret_hash/target/secret_hash.json` exists

**"Verifier contract not found"**
- Run: `npm run generate-verifier`
- Check: `contracts/UltraVerifier.sol` exists

## What's Next?

- Read full [README.md](./README.md) for detailed documentation
- Modify the circuit in `circuits/secret_hash/src/main.nr`
- Add more complex proofs (balance, activity, etc.)
- Build your credential system on top of this foundation

## Support

- Check the README.md for detailed troubleshooting
- Review Noir docs: https://noir-lang.org/docs/
- Check Arc testnet explorer: https://testnet.arcscan.app
