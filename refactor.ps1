# Bootstrap utility -> Tailwind utility replacements
# This script handles Phase 2: Replace Bootstrap utility classes with Tailwind equivalents
# It processes all JSX files in src/

$srcPath = "d:\AppSumoClone\appsumo-frontend\src"

# Get all JSX files
$files = Get-ChildItem -Path $srcPath -Recurse -Include "*.jsx"

# Define replacements - ORDER MATTERS (longer/more-specific patterns first)
# Format: [regex_pattern, replacement]
# We use word-boundary-aware patterns to avoid partial matches inside class strings

$replacements = @(
    # === DISPLAY (responsive first, then base) ===
    @('(?<=\s|")d-none d-md-block(?=\s|")', 'hidden md:block'),
    @('(?<=\s|")d-none d-md-flex(?=\s|")', 'hidden md:flex'),
    @('(?<=\s|")d-none d-lg-block(?=\s|")', 'hidden lg:block'),
    @('(?<=\s|")d-none d-lg-flex(?=\s|")', 'hidden lg:flex'),
    @('(?<=\s|")d-lg-none(?=\s|")', 'lg:hidden'),
    @('(?<=\s|")d-md-none(?=\s|")', 'md:hidden'),
    @('(?<=\s|")d-lg-block(?=\s|")', 'lg:block'),
    @('(?<=\s|")d-md-block(?=\s|")', 'md:block'),
    @('(?<=\s|")d-md-flex(?=\s|")', 'md:flex'),
    @('(?<=\s|")d-lg-flex(?=\s|")', 'lg:flex'),
    @('(?<=\s|")d-inline-flex(?=\s|")', 'inline-flex'),
    @('(?<=\s|")d-inline-block(?=\s|")', 'inline-block'),
    @('(?<=\s|")d-flex(?=\s|")', 'flex'),
    @('(?<=\s|")d-none(?=\s|")', 'hidden'),
    @('(?<=\s|")d-block(?=\s|")', 'block'),
    @('(?<=\s|")d-grid(?=\s|")', 'grid'),

    # === FLEX ===
    @('(?<=\s|")flex-column(?=\s|")', 'flex-col'),
    @('(?<=\s|")flex-grow-1(?=\s|")', 'grow'),
    @('(?<=\s|")flex-shrink-0(?=\s|")', 'shrink-0'),
    @('(?<=\s|")align-items-lg-center(?=\s|")', 'lg:items-center'),
    @('(?<=\s|")align-items-center(?=\s|")', 'items-center'),
    @('(?<=\s|")align-items-start(?=\s|")', 'items-start'),
    @('(?<=\s|")align-items-end(?=\s|")', 'items-end'),
    @('(?<=\s|")align-items-baseline(?=\s|")', 'items-baseline'),
    @('(?<=\s|")justify-content-center(?=\s|")', 'justify-center'),
    @('(?<=\s|")justify-content-between(?=\s|")', 'justify-between'),
    @('(?<=\s|")justify-content-end(?=\s|")', 'justify-end'),
    @('(?<=\s|")justify-content-start(?=\s|")', 'justify-start'),

    # === SPACING (Bootstrap-only class names: me-*, ms-*) ===
    # me-* (margin-end) -> mr-* (margin-right)
    @('(?<=\s|")me-1(?=\s|")', 'mr-1'),
    @('(?<=\s|")me-2(?=\s|")', 'mr-2'),
    @('(?<=\s|")me-3(?=\s|")', 'mr-4'),

    # ms-* (margin-start) -> ml-* (margin-left)
    @('(?<=\s|")ms-lg-1(?=\s|")', 'lg:ml-1'),
    @('(?<=\s|")ms-lg-2(?=\s|")', 'lg:ml-2'),
    @('(?<=\s|")ms-1(?=\s|")', 'ml-1'),
    @('(?<=\s|")ms-2(?=\s|")', 'ml-2'),
    @('(?<=\s|")ms-3(?=\s|")', 'ml-4'),
    @('(?<=\s|")ms-auto(?=\s|")', 'ml-auto'),

    # Responsive spacing
    @('(?<=\s|")mt-lg-0(?=\s|")', 'lg:mt-0'),
    @('(?<=\s|")mb-lg-0(?=\s|")', 'lg:mb-0'),
    @('(?<=\s|")mb-md-0(?=\s|")', 'md:mb-0'),
    @('(?<=\s|")my-lg-0(?=\s|")', 'lg:my-0'),
    @('(?<=\s|")my-2 my-lg-0(?=\s|")', 'my-2 lg:my-0'),
    @('(?<=\s|")px-lg-3(?=\s|")', 'lg:px-3'),
    @('(?<=\s|")px-lg-4(?=\s|")', 'lg:px-4'),
    @('(?<=\s|")px-xl-3(?=\s|")', 'xl:px-3'),
    @('(?<=\s|")px-xl-4(?=\s|")', 'xl:px-4'),

    # === FONT WEIGHT ===
    @('(?<=\s|")fw-bold(?=\s|")', 'font-bold'),
    @('(?<=\s|")fw-semibold(?=\s|")', 'font-semibold'),
    @('(?<=\s|")fw-medium(?=\s|")', 'font-medium'),

    # === TEXT ===
    @('(?<=\s|")text-uppercase(?=\s|")', 'uppercase'),
    @('(?<=\s|")text-decoration-none(?=\s|")', 'no-underline'),
    @('(?<=\s|")text-decoration-line-through(?=\s|")', 'line-through'),
    @('(?<=\s|")text-truncate(?=\s|")', 'truncate'),
    @('(?<=\s|")text-nowrap(?=\s|")', 'whitespace-nowrap'),
    @('(?<=\s|")text-md-start(?=\s|")', 'md:text-left'),
    @('(?<=\s|")text-md-end(?=\s|")', 'md:text-right'),
    @('(?<=\s|")text-start(?=\s|")', 'text-left'),
    @('(?<=\s|")text-end(?=\s|")', 'text-right'),

    # === POSITION ===
    @('(?<=\s|")position-relative(?=\s|")', 'relative'),
    @('(?<=\s|")position-absolute(?=\s|")', 'absolute'),
    @('(?<=\s|")position-fixed(?=\s|")', 'fixed'),
    @('(?<=\s|")position-sticky(?=\s|")', 'sticky'),

    # === SIZING ===
    @('(?<=\s|")w-100(?=\s|")', 'w-full'),
    @('(?<=\s|")h-100(?=\s|")', 'h-full'),
    @('(?<=\s|")min-vh-100(?=\s|")', 'min-h-screen'),

    # === BORDER / RADIUS ===
    @('(?<=\s|")rounded-circle(?=\s|")', 'rounded-full'),

    # === OTHER ===
    @('(?<=\s|")img-fluid(?=\s|")', 'max-w-full h-auto'),
    @('(?<=\s|")list-unstyled(?=\s|")', 'list-none'),
    @('(?<=\s|")visually-hidden(?=\s|")', 'sr-only'),

    # === RESPONSIVE DISPLAY (gap-lg-*, etc) ===
    @('(?<=\s|")gap-lg-2(?=\s|")', 'lg:gap-2')
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
