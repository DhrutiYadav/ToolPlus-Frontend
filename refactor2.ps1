# Bootstrap utility -> Tailwind utility replacements (Pass 2)

$srcPath = "d:\AppSumoClone\appsumo-frontend\src"
$files = Get-ChildItem -Path $srcPath -Recurse -Include "*.jsx"

$replacements = @(
    # === RADIUS ===
    @('(?<=\s|")rounded-0(?=\s|")', 'rounded-none'),
    @('(?<=\s|")rounded-1(?=\s|")', 'rounded-sm'),
    @('(?<=\s|")rounded-2(?=\s|")', 'rounded'),
    @('(?<=\s|")rounded-3(?=\s|")', 'rounded-lg'),
    @('(?<=\s|")rounded-4(?=\s|")', 'rounded-2xl'),
    @('(?<=\s|")rounded-5(?=\s|")', 'rounded-3xl'),
    @('(?<=\s|")rounded-top-4(?=\s|")', 'rounded-t-2xl'),
    @('(?<=\s|")rounded-bottom-4(?=\s|")', 'rounded-b-2xl'),
    @('(?<=\s|")rounded-start-pill(?=\s|")', 'rounded-l-full'),
    @('(?<=\s|")rounded-end-pill(?=\s|")', 'rounded-r-full'),
    @('(?<=\s|")rounded-pill(?=\s|")', 'rounded-full'),

    # === ALIGNMENT / LAYOUT ===
    @('(?<=\s|")align-middle(?=\s|")', 'align-middle'),
    @('(?<=\s|")mx-auto(?=\s|")', 'mx-auto'),
    @('(?<=\s|")text-center(?=\s|")', 'text-center'),

    # === FONT SIZES ===
    @('(?<=\s|")fs-1(?=\s|")', 'text-4xl font-bold'),
    @('(?<=\s|")fs-2(?=\s|")', 'text-3xl font-bold'),
    @('(?<=\s|")fs-3(?=\s|")', 'text-2xl font-bold'),
    @('(?<=\s|")fs-4(?=\s|")', 'text-xl font-bold'),
    @('(?<=\s|")fs-5(?=\s|")', 'text-lg'),
    @('(?<=\s|")fs-6(?=\s|")', 'text-base'),
    @('(?<=\s|")fs-7(?=\s|")', 'text-sm'),
    @('(?<=\s|")fs-8(?=\s|")', 'text-xs'),
    @('(?<=\s|")fs-9(?=\s|")', 'text-[0.65rem]'),

    # === TYPOGRAPHY ===
    @('(?<=\s|")fw-extrabold(?=\s|")', 'font-extrabold'),
    @('(?<=\s|")display-1(?=\s|")', 'text-6xl font-extrabold'),

    # === BORDERS ===
    @('(?<=\s|")border-bottom(?=\s|")', 'border-b'),
    @('(?<=\s|")border-top(?=\s|")', 'border-t'),
    @('(?<=\s|")border-start(?=\s|")', 'border-l'),
    @('(?<=\s|")border-end(?=\s|")', 'border-r'),
    @('(?<=\s|")border-0(?=\s|")', 'border-0'),
    
    # === MIN HEIGHT ===
    @('(?<=\s|")min-vh-100(?=\s|")', 'min-h-screen')
)

$totalChanges = 0

foreach ($file in $files) {
    $content = Get-Content -Path $file.FullName -Raw
    $originalContent = $content
    $fileChanges = 0

    foreach ($pair in $replacements) {
        $pattern = $pair[0]
        $replacement = $pair[1]
        $newContent = [regex]::Replace($content, $pattern, $replacement)
        if ($newContent -ne $content) {
            $matches = [regex]::Matches($content, $pattern)
            $fileChanges += $matches.Count
            $content = $newContent
        }
    }

    if ($content -ne $originalContent) {
        Set-Content -Path $file.FullName -Value $content -NoNewline
        $totalChanges += $fileChanges
        Write-Output "  Modified: $($file.Name) ($fileChanges replacements)"
    }
}

Write-Output "`nTotal replacements: $totalChanges across $($files.Count) files scanned"
