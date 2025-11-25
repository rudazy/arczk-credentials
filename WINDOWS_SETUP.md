# Windows Setup Guide

## Installing Nargo on Windows

Nargo (Noir compiler) requires either WSL2 or manual installation on Windows.

### Option 1: WSL2 (Recommended)

1. **Install WSL2**:
   ```powershell
   wsl --install
   ```
   Restart your computer after installation.

2. **Open WSL2 Terminal** (Ubuntu)

3. **Install Nargo in WSL**:
   ```bash
   curl -L https://raw.githubusercontent.com/noir-lang/noirup/main/install | bash
   source ~/.bashrc
   noirup
   ```

4. **Verify Installation**:
   ```bash
   nargo --version
   ```

5. **Navigate to Project**:
   ```bash
   cd /mnt/c/Users/RIKI/arczk-credentials
   ```

6. **Run Commands in WSL**:
   ```bash
   npm run compile-circuit
   npm run generate-verifier
   ```

### Option 2: Manual Binary Installation

1. **Download Nargo**:
   - Visit: https://github.com/noir-lang/noir/releases
   - Download latest `nargo-x86_64-pc-windows-msvc.zip`
   - Extract to a folder (e.g., `C:\nargo`)

2. **Add to PATH**:
   - Open System Environment Variables
   - Add `C:\nargo` to PATH
   - Restart terminal

3. **Verify**:
   ```bash
   nargo --version
   ```

### Option 3: Use PowerShell Scripts (Alternative)

If bash scripts don't work, use PowerShell equivalents:

**Compile Circuit** (PowerShell):
```powershell
cd circuits\secret_hash
nargo compile
cd ..\..
```

**Generate Verifier** (PowerShell):
```powershell
cd circuits\secret_hash
nargo codegen-verifier
Copy-Item contract\secret_hash\plonk_vk.sol ..\..\contracts\UltraVerifier.sol
cd ..\..
```

## After Installing Nargo

Once Nargo is installed, continue with:

```bash
# In Git Bash or WSL
npm run compile-circuit
npm run generate-verifier
npm run deploy
```

## Troubleshooting

### "nargo: command not found" in Git Bash
- Use WSL2 instead of Git Bash for Nargo commands
- Or use PowerShell with manual commands above

### "Permission denied" errors
- Run PowerShell as Administrator
- Or use WSL2

### Circuit compilation issues
- Make sure you're in WSL2 or have proper Windows binary
- Check `nargo --version` works first

## Quick Start (After Nargo Installation)

```bash
# 1. Compile circuit
npm run compile-circuit

# 2. Generate verifier
npm run generate-verifier

# 3. Setup environment
cp .env.example .env
# Edit .env with your private key

# 4. Deploy to Arc
npm run deploy

# 5. Generate and verify proof
npm run generate-proof 12345
npm run verify-onchain
```

## Recommended Workflow

For Windows users, the smoothest workflow is:
1. **Use WSL2 for Noir/Nargo commands** (compile, generate-verifier)
2. **Use Git Bash or PowerShell for npm/node commands** (deploy, generate-proof, verify-onchain)

Both environments can access the same files in `/mnt/c/Users/RIKI/arczk-credentials`.
