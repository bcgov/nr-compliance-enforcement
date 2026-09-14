# Rewrites dependency ranges in package.json to the exact versions currently resolved.
# Edits the raw text in place so formatting, escaping and non-dependency sections are untouched.
# Reads the snapshot produced by: npm ls --depth=0 --json

$snapshotPath = "$env:TEMP\pinned-event-worker.json"
$packagePath = ".\package.json"

$snapshot = Get-Content $snapshotPath -Raw | ConvertFrom-Json
$package = Get-Content $packagePath -Raw | ConvertFrom-Json
$text = Get-Content $packagePath -Raw

if (-not $text) {
    throw "Could not read $packagePath - run this from the folder containing package.json."
}

$skipped = @()
$pinned = 0

# Only these two sections are pinned. Overrides and resolutions stay as ranges - they are
# deliberate constraints on the tree, not declarations of what this package depends on.
foreach ($section in 'dependencies', 'devDependencies') {
    $declared = $package.$section
    if (-not $declared) { continue }

    foreach ($name in $declared.PSObject.Properties.Name) {
        $current = $declared.$name
        $resolved = $snapshot.dependencies.$name.version

        # Leave git URLs, file paths and workspace protocol entries alone - they carry no registry version
        if ($current -match '^(git|github|file:|workspace:|link:|https?:)') {
            $skipped += "$name ($current) - non-registry specifier"
            continue
        }

        if (-not $resolved) {
            $skipped += "$name ($current) - no resolved version in snapshot"
            continue
        }

        if ($current -eq $resolved) { continue }

        # Match this package's entry by its exact declared value, so an identical version
        # string on a different package is not caught by accident
        $pattern = '("' + [regex]::Escape($name) + '"\s*:\s*)"' + [regex]::Escape($current) + '"'
        $matches = [regex]::Matches($text, $pattern)

        if ($matches.Count -ne 1) {
            $skipped += "$name ($current) - matched $($matches.Count) times, left unchanged"
            continue
        }

        $text = [regex]::Replace($text, $pattern, ('${1}"' + $resolved + '"'))
        $pinned++
    }
}

[System.IO.File]::WriteAllText((Resolve-Path $packagePath), $text)