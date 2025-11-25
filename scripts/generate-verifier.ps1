# PowerShell script to generate Solidity verifier
# For Windows users who installed Nargo binary
# Modern Noir versions use different commands

Write-Host "Generating Solidity verifier..." -ForegroundColor Cyan
Set-Location circuits\secret_hash

try {
    # First ensure circuit is compiled
    if (-not (Test-Path "target\secret_hash.json")) {
        Write-Host "Circuit not compiled. Compiling first..." -ForegroundColor Yellow
        nargo compile
    }

    Write-Host "✓ Circuit compiled" -ForegroundColor Green

    # Try modern approach first (Noir 1.0+)
    Write-Host "Attempting to generate verifier..." -ForegroundColor Gray

    # Method 1: Try nargo codegen-verifier
    $codegenWorked = $false
    try {
        nargo codegen-verifier 2>$null
        Write-Host "✓ Used nargo codegen-verifier" -ForegroundColor Green
        $codegenWorked = $true
    } catch {
        # Method 2: Try nargo codegen
        try {
            nargo codegen 2>$null
            Write-Host "✓ Used nargo codegen" -ForegroundColor Green
            $codegenWorked = $true
        } catch {
            Write-Host "ℹ️  nargo codegen not available, trying bb..." -ForegroundColor Yellow

            # Method 3: Try bb (barretenberg)
            if (Get-Command bb -ErrorAction SilentlyContinue) {
                Write-Host "Using bb to generate verifier..." -ForegroundColor Gray
                bb write_vk -b target\secret_hash.json -o target\vk
                bb contract -k target\vk -o target\Verifier.sol
                Write-Host "✓ Generated with bb" -ForegroundColor Green
                $codegenWorked = $true
            } else {
                Write-Host "⚠️  Warning: Neither nargo codegen nor bb found" -ForegroundColor Yellow
                Write-Host "Verifier generation may not work." -ForegroundColor Yellow
            }
        }
    }

    # Move the generated verifier to contracts directory
    Write-Host "`nMoving verifier to contracts directory..." -ForegroundColor Gray

    # Try all possible locations (different Noir versions)
    if (Test-Path "contract\secret_hash\plonk_vk.sol") {
        Copy-Item "contract\secret_hash\plonk_vk.sol" "..\..\contracts\UltraVerifier.sol"
        Write-Host "✓ Found at contract\secret_hash\plonk_vk.sol" -ForegroundColor Green
    }
    elseif (Test-Path "contract\plonk_vk.sol") {
        Copy-Item "contract\plonk_vk.sol" "..\..\contracts\UltraVerifier.sol"
        Write-Host "✓ Found at contract\plonk_vk.sol" -ForegroundColor Green
    }
    elseif (Test-Path "target\Verifier.sol") {
        Copy-Item "target\Verifier.sol" "..\..\contracts\UltraVerifier.sol"
        Write-Host "✓ Found at target\Verifier.sol" -ForegroundColor Green
    }
    elseif (Test-Path "target\contract.sol") {
        Copy-Item "target\contract.sol" "..\..\contracts\UltraVerifier.sol"
        Write-Host "✓ Found at target\contract.sol" -ForegroundColor Green
    }
    else {
        Write-Host "`n❌ Error: Could not find generated verifier contract" -ForegroundColor Red
        Write-Host "`nSearched locations:" -ForegroundColor Yellow
        Write-Host "  - contract\secret_hash\plonk_vk.sol" -ForegroundColor Gray
        Write-Host "  - contract\plonk_vk.sol" -ForegroundColor Gray
        Write-Host "  - target\Verifier.sol" -ForegroundColor Gray
        Write-Host "  - target\contract.sol" -ForegroundColor Gray
        Write-Host "`nDirectory contents:" -ForegroundColor Yellow
        Get-ChildItem -Recurse contract\, target\ -ErrorAction SilentlyContinue
        Write-Host "`nPlease check your Noir version: nargo --version" -ForegroundColor Yellow
        Set-Location ..\..
        exit 1
    }

    Write-Host "✓ Verifier moved to contracts\UltraVerifier.sol" -ForegroundColor Green

} catch {
    Write-Host "`n❌ Verifier generation failed!" -ForegroundColor Red
    Write-Host $_.Exception.Message -ForegroundColor Red
    Set-Location ..\..
    exit 1
}

Set-Location ..\..
