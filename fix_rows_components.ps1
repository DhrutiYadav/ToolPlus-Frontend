$srcPath = "d:\AppSumoClone\appsumo-frontend\src\components"
$files = Get-ChildItem -Path $srcPath -Recurse -Filter "*.jsx"

foreach ($file in $files) {
    $content = Get-Content -Path $file.FullName -Raw
    $newContent = $content -replace 'flex flex-wrap -mx-4', 'row'
    if ($content -ne $newContent) {
        Set-Content -Path $file.FullName -Value $newContent -NoNewline
        Write-Output "Fixed $($file.Name)"
    }
}
