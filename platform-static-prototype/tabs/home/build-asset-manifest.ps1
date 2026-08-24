param(
  [string]$CheckedAt = (Get-Date).ToUniversalTime().ToString('o')
)

$ErrorActionPreference = 'Stop'
$homeRoot = Split-Path -Parent $MyInvocation.MyCommand.Path
$assetRoot = Join-Path $homeRoot 'assets'
$outputPath = Join-Path $assetRoot 'figma-assets.manifest.json'

$nodeMap = [ordered]@{
  'images/hero/image-herosection-screen.png' = @('198:27539', 'image-herosection-screen')
  'images/hero/image-herosection-decoration03.png' = @('198:27540', 'image-herosection-decoration03')
  'images/hero/image-herosection-decoration01.png' = @('198:27544', 'image-herosection-decoration01')
  'images/hero/image-herosection-decoration02.png' = @('198:27554', 'image-herosection-decoration02')
  'images/security/image-safecontrol.png' = @('198:35475', 'image-safecontrol')
  'images/ecosystem/image-open-ecosystem.png' = @('198:35502', 'image-open-ecosystem')
  'images/research-base/image-worldmordel.png' = @('198:35630', 'image-worldmordel')
  'images/research-base/image-interns2.png' = @('198:35631', 'image-interns2')
  'images/footer/image-intern-qrcode.png' = @('220:62071', 'image-intern-QRcode')
}

1..6 | ForEach-Object { $nodeMap["images/highlights/image-highlight0$_.png"] = @((@('198:53844','198:53849','198:53847','198:53859','198:53861','198:53857'))[$_ - 1], "image-highlight0$_") }
1..7 | ForEach-Object { $nodeMap["images/outputs/image-output0$_.png"] = @((@('198:27745','198:27751','198:27757','198:27765','198:27771','198:27777','198:27783'))[$_ - 1], "image-output0$_") }
1..10 | ForEach-Object { $nodeMap[("images/research-cases/image-research-cases-achievements{0:d2}.png" -f $_)] = @('local-source', ("image-ResearchCases-Achievements{0:d2}" -f $_)) }

$directoryMap = [ordered]@{
  'images/discipline/' = @('198:27637', 'discipline-stream-assets')
  'icons/flow/' = @('198:27602', 'image-flow')
  'icons/disciplines/cards/' = @('314:3303', 'discipline-card-assets')
  'icons/disciplines/' = @('210:53949', 'image-six-subject')
  'icons/security/' = @('198:35475', 'image-safecontrol')
  'icons/ecosystem/' = @('198:35502', 'image-open-ecosystem')
  'icons/foundation/' = @('198:35625', 'research-foundation-decoration')
  'icons/capabilities/' = @('198:35635', 'research-foundation-capabilities')
  'icons/downloads/' = @('242:63272', 'download-card-icons')
  'icons/evidence-chain/chain01/' = @('168:938', 'image-chain01')
  'icons/evidence-chain/chain02/' = @('168:896', 'image-chain02')
  'icons/evidence-chain/chain03/' = @('168:1296', 'image-chain03')
  'icons/evidence-chain/chain04/' = @('168:1015', 'image-chain04')
  'icons/evidence-chain/chain05/' = @('168:1057', 'image-chain05')
  'icons/evidence-chain/chain06/' = @('168:1073', 'image-chain06')
  'icons/evidence-chain/chain07/' = @('168:1175', 'image-chain07')
}

$evidenceChainMap = [ordered]@{
  'icons/evidence-chain/chain01/' = [ordered]@{ variantNodeId = '168:1204'; outerNodeId = '168:938'; innerNodeId = '221:2138'; stateKey = 'chain01'; tabLabel = '文献综述及引用网络' }
  'icons/evidence-chain/chain02/' = [ordered]@{ variantNodeId = '168:1205'; outerNodeId = '168:896'; innerNodeId = '221:2805'; stateKey = 'chain02'; tabLabel = '数据统计结果' }
  'icons/evidence-chain/chain03/' = [ordered]@{ variantNodeId = '168:1317'; outerNodeId = '168:1296'; innerNodeId = '226:3362'; stateKey = 'chain03'; tabLabel = '论文插图' }
  'icons/evidence-chain/chain04/' = [ordered]@{ variantNodeId = '168:1207'; outerNodeId = '168:1015'; innerNodeId = '226:4390'; stateKey = 'chain04'; tabLabel = '分析代码' }
  'icons/evidence-chain/chain05/' = [ordered]@{ variantNodeId = '168:1208'; outerNodeId = '168:1057'; innerNodeId = '226:4487'; stateKey = 'chain05'; tabLabel = '仿真结果' }
  'icons/evidence-chain/chain06/' = [ordered]@{ variantNodeId = '168:1209'; outerNodeId = '168:1073'; innerNodeId = '226:4769'; stateKey = 'chain06'; tabLabel = '实验设计' }
  'icons/evidence-chain/chain07/' = [ordered]@{ variantNodeId = '168:1246'; outerNodeId = '168:1175'; innerNodeId = '226:4965'; stateKey = 'chain07'; tabLabel = '论文草稿 / 技术报告' }
}

function Get-PngDimensions([byte[]]$bytes) {
  if ($bytes.Length -lt 24) { return $null }
  if ($bytes[0] -ne 137 -or $bytes[1] -ne 80 -or $bytes[2] -ne 78 -or $bytes[3] -ne 71) { return $null }
  $width = [System.Net.IPAddress]::NetworkToHostOrder([BitConverter]::ToInt32($bytes, 16))
  $height = [System.Net.IPAddress]::NetworkToHostOrder([BitConverter]::ToInt32($bytes, 20))
  return [ordered]@{ width = $width; height = $height }
}

function Get-SvgDimensions([string]$path) {
  $svg = Get-Content -LiteralPath $path -Raw -Encoding UTF8
  if ($svg -match 'viewBox="[^\"]*?([0-9.]+)\s+([0-9.]+)"') { return [ordered]@{ width = [double]$Matches[1]; height = [double]$Matches[2] } }
  if ($svg -match 'width="([0-9.]+)"[^>]*height="([0-9.]+)"') { return [ordered]@{ width = [double]$Matches[1]; height = [double]$Matches[2] } }
  return $null
}

$assets = Get-ChildItem -LiteralPath $assetRoot -Recurse -File | Where-Object Name -ne 'figma-assets.manifest.json' | Sort-Object FullName | ForEach-Object {
  $relative = $_.FullName.Substring($assetRoot.Length + 1).Replace('\', '/')
  $source = $nodeMap[$relative]
  $sourceNodeResolution = if ($source -and $source[0] -eq 'local-source') { 'user-provided-file' } elseif ($source) { 'exact-file-node' } else { $null }
  if (-not $source) {
    foreach ($prefix in $directoryMap.Keys) {
      if ($relative.StartsWith($prefix, [StringComparison]::OrdinalIgnoreCase)) {
        $source = $directoryMap[$prefix]
        $sourceNodeResolution = 'context-container'
        break
      }
    }
  }
  if (-not $source) {
    $source = @('198:27482', [IO.Path]::GetFileNameWithoutExtension($_.Name))
    $sourceNodeResolution = 'root-fallback'
  }
  $evidenceState = $null
  foreach ($prefix in $evidenceChainMap.Keys) {
    if ($relative.StartsWith($prefix, [StringComparison]::OrdinalIgnoreCase)) { $evidenceState = $evidenceChainMap[$prefix]; break }
  }
  $bytes = [IO.File]::ReadAllBytes($_.FullName)
  $dimensions = if ($_.Extension -eq '.png') { Get-PngDimensions $bytes } elseif ($_.Extension -eq '.svg') { Get-SvgDimensions $_.FullName } else { $null }
  $record = [ordered]@{
    nodeId = $source[0]
    layerName = $source[1]
    checkedAt = $CheckedAt
    naturalSize = $dimensions
    exportType = if ($source[0] -eq 'local-source') { 'user-provided-png' } elseif ($_.Extension -eq '.svg') { 'figma-svg-fragment' } else { 'figma-original-png' }
    sourceNodeResolution = $sourceNodeResolution
    outputPath = "tabs/home/assets/$relative"
    bytes = $_.Length
    sha256 = (Get-FileHash -LiteralPath $_.FullName -Algorithm SHA256).Hash.ToLowerInvariant()
  }
  if ($evidenceState) {
    $record.componentSetNodeId = '168:1325'
    $record.variantNodeId = $evidenceState.variantNodeId
    $record.stateKey = $evidenceState.stateKey
    $record.outerNodeId = $evidenceState.outerNodeId
    $record.innerNodeId = $evidenceState.innerNodeId
    $record.sourceNodeResolution = 'state-container'
  }
  $record
}

$evidenceChainStates = $evidenceChainMap.Values | ForEach-Object {
  [ordered]@{
    componentSetNodeId = '168:1325'
    variantNodeId = $_.variantNodeId
    stateKey = $_.stateKey
    tabLabel = $_.tabLabel
    outerNodeId = $_.outerNodeId
    innerNodeId = $_.innerNodeId
    outerNaturalSize = [ordered]@{ width = 960; height = 480 }
    innerNaturalBounds = [ordered]@{ x = 80; y = 0; width = 800; height = 480 }
    runtimeRepresentation = 'html-css-svg-fragments'
  }
}

$manifest = [ordered]@{
  schemaVersion = 1
  figmaFileKey = 'ZaggbS0TYv1ljbBzqEwc7h'
  rootNodeId = '198:27482'
  checkedAt = $CheckedAt
  assetCount = @($assets).Count
  figmaExportCount = @($assets | Where-Object exportType -ne 'user-provided-png').Count
  userProvidedAssetCount = @($assets | Where-Object exportType -eq 'user-provided-png').Count
  sourceResolutionSummary = [ordered]@{
    exactFileNode = @($assets | Where-Object sourceNodeResolution -eq 'exact-file-node').Count
    contextContainer = @($assets | Where-Object sourceNodeResolution -eq 'context-container').Count
    evidenceStateContainer = @($assets | Where-Object sourceNodeResolution -eq 'state-container').Count
    userProvidedFile = @($assets | Where-Object sourceNodeResolution -eq 'user-provided-file').Count
    rootFallback = @($assets | Where-Object sourceNodeResolution -eq 'root-fallback').Count
  }
  evidenceChainStates = @($evidenceChainStates)
  assets = @($assets)
}

$manifest | ConvertTo-Json -Depth 8 | Set-Content -LiteralPath $outputPath -Encoding UTF8
Get-Item -LiteralPath $outputPath | Select-Object FullName, Length
