# ProgressReport.ps1 - FinPulse 專案每日進度報告
param(
    [string]$WorkingDir = "C:\Users\davidlee\Documents\Project\美夢成真",
    [string]$ProjectDir = "C:\Users\davidlee\Documents\Project\美夢成真\mydream",
    [string]$DocsDir = "C:\Users\davidlee\Documents\Project\美夢成真\docs",
    [string]$DeploymentUrl = "http://8.213.209.231"
)

$taipeiNow = (Get-Date).ToUniversalTime().AddHours(8)
$dateStr = $taipeiNow.ToString('yyyy-MM-dd')
$timeStr = $taipeiNow.ToString('HH:mm')
$outputFile = Join-Path $DocsDir "專案每日進度_$dateStr.md"

$machinePath = [Environment]::GetEnvironmentVariable('Path', 'Machine')
$userPath = [Environment]::GetEnvironmentVariable('Path', 'User')
$env:Path = $machinePath + ';' + $userPath

# --- 1. 專案概覽 ---
$pages = (Get-ChildItem -Path (Join-Path $ProjectDir "src\app") -Recurse -Filter "page.tsx" -File).Count
$apis = (Get-ChildItem -Path (Join-Path $ProjectDir "src\app\api") -Recurse -Filter "route.ts" -File).Count
$components = (Get-ChildItem -Path (Join-Path $ProjectDir "src\components") -Recurse -Filter "*.tsx" -File).Count
$libs = (Get-ChildItem -Path (Join-Path $ProjectDir "src\lib") -Filter "*.ts" -File).Count

# --- 2. Git 提交 ---
$sinceStr = $dateStr + "T00:00:00+08:00"
$gitLog = & git -C $ProjectDir log --since=$sinceStr --oneline --format="%h %s (%ar)" 2>$null
if (-not $gitLog) { $gitLog = @("(今日尚無提交)") }

# --- 3. 建置檢查 ---
$prismaStatus = "N/A (本機未安裝 Node.js)"
$tscStatus = "N/A (本機未安裝 Node.js)"
$buildOutput = ""

$hasNode = (Get-Command "node" -ErrorAction SilentlyContinue) -ne $null
if ($hasNode) {
    Push-Location $ProjectDir
    try {
        $r = & npx prisma generate 2>&1
        $buildOutput += "[prisma generate]`n$($r | Out-String)`n"
        $prismaStatus = if ($LASTEXITCODE -eq 0) { "OK" } else { "FAIL" }
    } catch { $prismaStatus = "FAIL" }
    try {
        $r = & npx tsc --noEmit 2>&1
        $buildOutput += "[tsc --noEmit]`n$($r | Out-String)"
        $tscStatus = if ($LASTEXITCODE -eq 0) { "OK (0 errors)" } else { "FAIL" }
    } catch { $tscStatus = "FAIL" }
    Pop-Location
}

# --- 4. Code Review ---
$crCritical = 0; $crFunctional = 0; $crQuality = 0
$crCriticalItems = @(); $crFunctionalItems = @(); $crQualityItems = @()

$crPath = Join-Path $WorkingDir "測試驗證\CODE_REVIEW.md"
if (Test-Path $crPath) {
    $crRaw = Get-Content $crPath -Raw -Encoding UTF8
    $crSections = $crRaw -split '(?=\r?\n## )'
    foreach ($sec in $crSections) {
        if ($sec -match '嚴重.*業務') {
            $crCriticalItems = [regex]::Matches($sec, '(?m)^### (#\d+ .+)$') | ForEach-Object { $_.Groups[1].Value }
            $crCritical = $crCriticalItems.Count
        } elseif ($sec -match '功能性.*Bug') {
            $crFunctionalItems = [regex]::Matches($sec, '(?m)^### (#\d+ .+)$') | ForEach-Object { $_.Groups[1].Value }
            $crFunctional = $crFunctionalItems.Count
        } elseif ($sec -match '程式碼品質|程式碼') {
            $crQualityItems = [regex]::Matches($sec, '(?m)^### (#\d+ .+)$') | ForEach-Object { $_.Groups[1].Value }
            $crQuality = $crQualityItems.Count
        }
    }
}

# --- 5. 部署狀態 ---
$deployStatus = "? 未檢查"
try {
    $resp = curl.exe -s -o nul -w "%{http_code}" -m 10 $DeploymentUrl 2>$null
    $deployStatus = if ($resp -eq "200") { "OK (HTTP 200)" } else { "FAIL (HTTP $resp)" }
} catch { $deployStatus = "FAIL (連線失敗)" }

# --- 組合輸出 ---
$lines = @()
$lines += "# 專案每日進度 - $dateStr"
$lines += ""
$lines += "> 產生時間：$dateStr $timeStr (台北時間)"
$lines += ""
$lines += "---"
$lines += ""
$lines += "## 專案概覽"
$lines += ""
$lines += "| 項目 | 數量 |"
$lines += "|------|------|"
$lines += "| 頁面 (page.tsx) | $pages |"
$lines += "| API 路由 (route.ts) | $apis |"
$lines += "| 元件 (components/) | $components |"
$lines += "| Lib 模組 (lib/) | $libs |"
$lines += ""
$lines += "---"
$lines += ""
$lines += "## 近期 Git 提交"
$lines += ""
$lines += "> 範圍：$dateStr 00:00 ~ $timeStr"
$lines += ""
foreach ($line in $gitLog) { $lines += "- $line" }
$lines += ""
$lines += "---"
$lines += ""
$lines += "## 建置狀態"
$lines += ""
$lines += "| 檢查項目 | 結果 |"
$lines += "|----------|------|"
$lines += "| prisma generate | $prismaStatus |"
$lines += "| tsc --noEmit | $tscStatus |"

if ($buildOutput.Trim()) {
    $lines += ""
    $lines += '```'
    $lines += $buildOutput.Trim()
    $lines += '```'
}

$lines += ""
$lines += "---"
$lines += ""
$lines += "## Code Review 問題追蹤"
$lines += ""
$lines += "| 類別 | 數量 |"
$lines += "|------|------|"
$lines += "| 嚴重 (安全/業務) | $crCritical |"
foreach ($item in $crCriticalItems) { $lines += "  - $item" }
$lines += "| 功能性 Bug | $crFunctional |"
foreach ($item in $crFunctionalItems) { $lines += "  - $item" }
$lines += "| 程式碼品質 | $crQuality |"
foreach ($item in $crQualityItems) { $lines += "  - $item" }
$lines += "| 合計 | $($crCritical + $crFunctional + $crQuality) |"
$lines += ""
$lines += "---"
$lines += ""
$lines += "## 部署狀態"
$lines += ""
$lines += "| 項目 | 結果 |"
$lines += "|------|------|"
$lines += "| 網址 | $DeploymentUrl |"
$lines += "| 狀態 | $deployStatus |"
$lines += ""
$lines += "---"

[System.IO.File]::WriteAllText($outputFile, ($lines -join "`r`n"), [System.Text.UTF8Encoding]::new($true))
Write-Output "OK"