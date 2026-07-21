# Bootstrap grid/spacing utility -> Tailwind utility replacements (Pass 3)

$srcPath = "d:\AppSumoClone\appsumo-frontend\src"
$files = Get-ChildItem -Path $srcPath -Recurse -Include "*.jsx"

$replacements = @(
    # === MARGIN ===
    @('\bm-0\b', 'm-0'), @('\bm-1\b', 'm-1'), @('\bm-2\b', 'm-2'), @('\bm-3\b', 'm-4'), @('\bm-4\b', 'm-6'), @('\bm-5\b', 'm-12'),
    @('\bmt-0\b', 'mt-0'), @('\bmt-1\b', 'mt-1'), @('\bmt-2\b', 'mt-2'), @('\bmt-3\b', 'mt-4'), @('\bmt-4\b', 'mt-6'), @('\bmt-5\b', 'mt-12'),
    @('\bmb-0\b', 'mb-0'), @('\bmb-1\b', 'mb-1'), @('\bmb-2\b', 'mb-2'), @('\bmb-3\b', 'mb-4'), @('\bmb-4\b', 'mb-6'), @('\bmb-5\b', 'mb-12'),
    @('\bms-0\b', 'ml-0'), @('\bms-1\b', 'ml-1'), @('\bms-2\b', 'ml-2'), @('\bms-3\b', 'ml-4'), @('\bms-4\b', 'ml-6'), @('\bms-5\b', 'ml-12'),
    @('\bme-0\b', 'mr-0'), @('\bme-1\b', 'mr-1'), @('\bme-2\b', 'mr-2'), @('\bme-3\b', 'mr-4'), @('\bme-4\b', 'mr-6'), @('\bme-5\b', 'mr-12'),
    @('\bmx-0\b', 'mx-0'), @('\bmx-1\b', 'mx-1'), @('\bmx-2\b', 'mx-2'), @('\bmx-3\b', 'mx-4'), @('\bmx-4\b', 'mx-6'), @('\bmx-5\b', 'mx-12'),
    @('\bmy-0\b', 'my-0'), @('\bmy-1\b', 'my-1'), @('\bmy-2\b', 'my-2'), @('\bmy-3\b', 'my-4'), @('\bmy-4\b', 'my-6'), @('\bmy-5\b', 'my-12'),

    # === PADDING ===
    @('\bp-0\b', 'p-0'), @('\bp-1\b', 'p-1'), @('\bp-2\b', 'p-2'), @('\bp-3\b', 'p-4'), @('\bp-4\b', 'p-6'), @('\bp-5\b', 'p-12'),
    @('\bpt-0\b', 'pt-0'), @('\bpt-1\b', 'pt-1'), @('\bpt-2\b', 'pt-2'), @('\bpt-3\b', 'pt-4'), @('\bpt-4\b', 'pt-6'), @('\bpt-5\b', 'pt-12'),
    @('\bpb-0\b', 'pb-0'), @('\bpb-1\b', 'pb-1'), @('\bpb-2\b', 'pb-2'), @('\bpb-3\b', 'pb-4'), @('\bpb-4\b', 'pb-6'), @('\bpb-5\b', 'pb-12'),
    @('\bps-0\b', 'pl-0'), @('\bps-1\b', 'pl-1'), @('\bps-2\b', 'pl-2'), @('\bps-3\b', 'pl-4'), @('\bps-4\b', 'pl-6'), @('\bps-5\b', 'pl-12'),
    @('\bpe-0\b', 'pr-0'), @('\bpe-1\b', 'pr-1'), @('\bpe-2\b', 'pr-2'), @('\bpe-3\b', 'pr-4'), @('\bpe-4\b', 'pr-6'), @('\bpe-5\b', 'pr-12'),
    @('\bpx-0\b', 'px-0'), @('\bpx-1\b', 'px-1'), @('\bpx-2\b', 'px-2'), @('\bpx-3\b', 'px-4'), @('\bpx-4\b', 'px-6'), @('\bpx-5\b', 'px-12'),
    @('\bpy-0\b', 'py-0'), @('\bpy-1\b', 'py-1'), @('\bpy-2\b', 'py-2'), @('\bpy-3\b', 'py-4'), @('\bpy-4\b', 'py-6'), @('\bpy-5\b', 'py-12'),

    # === GRID ===
    @('\brow\b', 'flex flex-wrap -mx-4'),
    @('\bcol\b', 'flex-1 px-4'),
    @('\bcol-12\b', 'w-full px-4'),
    @('\bcol-11\b', 'w-11/12 px-4'),
    @('\bcol-10\b', 'w-5/6 px-4'),
    @('\bcol-9\b', 'w-3/4 px-4'),
    @('\bcol-8\b', 'w-2/3 px-4'),
    @('\bcol-7\b', 'w-7/12 px-4'),
    @('\bcol-6\b', 'w-1/2 px-4'),
    @('\bcol-5\b', 'w-5/12 px-4'),
    @('\bcol-4\b', 'w-1/3 px-4'),
    @('\bcol-3\b', 'w-1/4 px-4'),
    @('\bcol-2\b', 'w-1/6 px-4'),
    @('\bcol-1\b', 'w-1/12 px-4'),

    @('\bcol-sm-12\b', 'sm:w-full px-4'),
    @('\bcol-sm-6\b', 'sm:w-1/2 px-4'),
    
    @('\bcol-md-12\b', 'md:w-full px-4'),
    @('\bcol-md-10\b', 'md:w-5/6 px-4'),
    @('\bcol-md-8\b', 'md:w-2/3 px-4'),
    @('\bcol-md-6\b', 'md:w-1/2 px-4'),
    @('\bcol-md-4\b', 'md:w-1/3 px-4'),
    @('\bcol-md-3\b', 'md:w-1/4 px-4'),
    
    @('\bcol-lg-12\b', 'lg:w-full px-4'),
    @('\bcol-lg-10\b', 'lg:w-5/6 px-4'),
    @('\bcol-lg-8\b', 'lg:w-2/3 px-4'),
    @('\bcol-lg-7\b', 'lg:w-7/12 px-4'),
    @('\bcol-lg-6\b', 'lg:w-1/2 px-4'),
    @('\bcol-lg-5\b', 'lg:w-5/12 px-4'),
    @('\bcol-lg-4\b', 'lg:w-1/3 px-4'),
    @('\bcol-lg-3\b', 'lg:w-1/4 px-4'),
    
    @('\bcol-xl-3\b', 'xl:w-1/4 px-4'),

    # === GAPS ===
    @('\bg-0\b', 'gap-0'),
    @('\bg-1\b', 'gap-1'),
    @('\bg-2\b', 'gap-2'),
    @('\bg-3\b', 'gap-4'),
    @('\bg-4\b', 'gap-6'),
    @('\bg-5\b', 'gap-12'),
    @('\bgy-2\b', 'gap-y-2'),
    @('\bgy-3\b', 'gap-y-4'),
    @('\bgy-4\b', 'gap-y-6')
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
