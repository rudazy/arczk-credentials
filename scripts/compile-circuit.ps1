# PowerShell script to compile Noir circuit
# For Windows users who installed Nargo binary

Write-Host "Compiling Noir circuit..." -ForegroundColor Cyan
Set-Location circuits\secret_hash

try {
    nargo compile
    Write-Host "`n✓ Circuit compiled successfully!" -ForegroundColor Green
    Write-Host "Output: circuits\secret_hash\target\secret_hash.json" -ForegroundColor Gray
} catch {
    Write-Host "`n❌ Circuit compilation failed!" -ForegroundColor Red
    Write-Host $_.Exception.Message -ForegroundColor Red
    Set-Location ..\..
    exit 1
}

Set-Location ..\..
