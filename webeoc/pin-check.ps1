$snapshot = Get-Content "$env:TEMP\pinned-frontend.json" -Raw | ConvertFrom-Json
$pkg = Get-Content .\package.json -Raw | ConvertFrom-Json

$rows = foreach ($section in 'dependencies', 'devDependencies') {
    $declared = $pkg.$section
    if (-not $declared) { continue }

    foreach ($name in $declared.PSObject.Properties.Name) {
        [pscustomobject]@{
            Section  = $section
            Package  = $name
            Declared = $declared.$name
            Resolved = $snapshot.dependencies.$name.version
        }
    }
}

$rows | Where-Object { $_.Declared -ne $_.Resolved } | Format-Table -AutoSize