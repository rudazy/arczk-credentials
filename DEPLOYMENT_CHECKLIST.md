# Deployment Checklist

Follow this checklist to deploy your ZK proof system to Arc testnet.

## Pre-Deployment Checklist

### Environment Setup
- [ ] Node.js v18+ installed: `node --version`
- [ ] NPM dependencies installed: `npm install`
- [ ] Nargo installed: `nargo --version`
  - If not: `curl -L https://raw.githubusercontent.com/noir-lang/noirup/main/install | bash && noirup`
- [ ] Git Bash or WSL available (Windows users)

### Wallet Setup
- [ ] Wallet created with private key
- [ ] Private key saved securely
- [ ] Arc testnet ETH acquired (from faucet)
- [ ] Balance verified on https://testnet.arcscan.app

### Configuration
- [ ] `.env` file created: `cp .env.example .env`
- [ ] PRIVATE_KEY added to .env (without 0x prefix)
- [ ] .env file added to .gitignore (already done)

## Build Process

### Circuit Compilation
- [ ] Navigate to project root
- [ ] Run: `npm run compile-circuit`
- [ ] Verify: `circuits/secret_hash/target/secret_hash.json` exists
- [ ] Check output for "✓ Circuit compiled successfully!"

### Verifier Generation
- [ ] Run: `npm run generate-verifier`
- [ ] Verify: `contracts/UltraVerifier.sol` created
- [ ] Check output for "✓ Verifier generated successfully!"

### Contract Compilation
- [ ] Run: `npx hardhat compile`
- [ ] Verify: No compilation errors
- [ ] Check: `artifacts/` directory created
- [ ] Check: TypeScript types generated in `typechain-types/`

## Deployment to Arc Testnet

### Pre-Deployment Verification
- [ ] Confirm wallet has Arc testnet ETH
- [ ] Verify .env file has correct PRIVATE_KEY
- [ ] Check RPC connection: `curl https://rpc.testnet.arc.network -X POST -H "Content-Type: application/json" -d '{"jsonrpc":"2.0","method":"eth_chainId","params":[],"id":1}'`

### Deploy Contracts
- [ ] Run: `npm run deploy`
- [ ] Wait for deployment to complete
- [ ] Note UltraVerifier address
- [ ] Note SecretVerifier address
- [ ] Verify: `deployments.json` created
- [ ] Check contracts on Arc Explorer

### Verify Deployment
- [ ] Open UltraVerifier on Arc Explorer
- [ ] Open SecretVerifier on Arc Explorer
- [ ] Confirm contracts are visible
- [ ] Check contract creation transactions

## Testing the System

### Generate First Proof
- [ ] Choose a secret number (e.g., 12345)
- [ ] Run: `npm run generate-proof 12345`
- [ ] Verify: `proof-output.json` created
- [ ] Check output for "✓ Proof generated"
- [ ] Check output for "✓ Proof verified locally: true"

### Verify On-Chain
- [ ] Run: `npm run verify-onchain`
- [ ] Wait for transaction confirmation
- [ ] Note transaction hash
- [ ] Check output for "✓ Transaction confirmed!"
- [ ] Verify: "Commitment verified: true"

### View on Arc Explorer
- [ ] Open transaction on Arc Explorer
- [ ] Verify transaction status: Success
- [ ] Check ProofVerified event emitted
- [ ] Note gas used
- [ ] Verify timestamp

## Post-Deployment

### Save Important Info
- [ ] Save UltraVerifier address
- [ ] Save SecretVerifier address
- [ ] Save first transaction hash
- [ ] Document deployment date/time
- [ ] Keep deployments.json safe

### Test Additional Proofs
- [ ] Generate proof with different secret
- [ ] Verify second proof on-chain
- [ ] Confirm verification count increases
- [ ] Test with multiple secrets

### Verify Contract Functions
- [ ] Call `isVerified()` for your commitments
- [ ] Call `getProver()` to see your address
- [ ] Call `getVerificationCount()` for your address
- [ ] Confirm all values match expectations

## Common Issues

### Issue: "nargo: command not found"
**Solution**: Install Nargo and restart terminal
```bash
curl -L https://raw.githubusercontent.com/noir-lang/noirup/main/install | bash
noirup
```

### Issue: "Deployer has no balance"
**Solution**: Get Arc testnet ETH
1. Visit Arc testnet faucet
2. Submit wallet address
3. Wait for ETH to arrive
4. Verify on arcscan.app

### Issue: "Circuit not found"
**Solution**: Compile circuit first
```bash
npm run compile-circuit
```

### Issue: "Cannot find module 'UltraVerifier'"
**Solution**: Generate verifier contract
```bash
npm run generate-verifier
npx hardhat compile
```

### Issue: "Invalid proof"
**Solution**:
1. Ensure circuit is compiled
2. Regenerate proof
3. Check proof-output.json exists
4. Verify proof locally shows true

### Issue: "Already verified"
**Solution**: Use a different secret to generate new commitment

## Success Indicators

You've successfully deployed when:
- ✓ Both contracts deployed to Arc testnet
- ✓ Contracts visible on Arc Explorer
- ✓ Can generate proofs locally
- ✓ Proofs verify locally
- ✓ Proofs verify on-chain
- ✓ Events emitted and visible
- ✓ Transaction confirmed on Arc

## Next Steps

After successful deployment:
1. Test with multiple secrets
2. Verify all contract functions work
3. Document your contract addresses
4. Plan credential system features
5. Design balance/activity proofs
6. Consider building UI

## Support Resources

- **Noir Docs**: https://noir-lang.org/docs/
- **Arc Explorer**: https://testnet.arcscan.app
- **Hardhat Docs**: https://hardhat.org/docs
- **Project README**: ./README.md
- **Quick Start**: ./QUICKSTART.md

---

**Remember**: This is testnet. Always audit before mainnet deployment.
