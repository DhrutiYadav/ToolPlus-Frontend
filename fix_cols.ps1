$srcPath = "d:\AppSumoClone\appsumo-frontend\src"
$files = Get-ChildItem -Path $srcPath -Recurse -Filter "*.jsx"

foreach ($file in $files) {
    $content = Get-Content -Path $file.FullName -Raw
    $newContent = $content -replace 'flex-1 px-4', 'col'
    if ($content -ne $newContent) {
        Set-Content -Path $file.FullName -Value $newContent -NoNewline
        Write-Output "Fixed $($file.Name)"
    }
}
