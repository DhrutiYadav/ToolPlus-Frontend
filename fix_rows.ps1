$srcPath = "d:\AppSumoClone\appsumo-frontend\src\pages\admin"
$files = Get-ChildItem -Path $srcPath -Filter "*.jsx"

foreach ($file in $files) {
    $content = Get-Content -Path $file.FullName -Raw
    $newContent = $content -replace 'flex flex-wrap -mx-4', 'row'
    $newContent = $newContent -replace 'flex flex-flex-1 px-4 sm:flex-row', 'flex flex-col sm:flex-row' # fix a related bug
    if ($content -ne $newContent) {
        Set-Content -Path $file.FullName -Value $newContent -NoNewline
        Write-Output "Fixed $($file.Name)"
    }
}
