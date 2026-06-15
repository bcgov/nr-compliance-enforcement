# Tier-2 adjustment contract

Tier-1 snippets are the verbatim decomposition of a runbook. **Tier 2** is the safe,
composable subset: you (the agent) rewrite a chosen Tier-1 snippet into a `snippet_*` block
an n8n workflow can drop in and chain. This is judgement work — the parser only scaffolds
the stub (`parser.py scaffold`) and preserves your outcome in `status`.

## The contract

A Tier-2 `snippet_*` MUST be:

1. **Individually runnable** — self-contained, with a shebang and `set -euo pipefail` for
   shell. It must not depend on variables a previous Tier-1 line happened to set.
2. **Parameterized** — inputs come from **CLI args and/or env vars**, never hardcoded
   cluster names, namespaces, timestamps, or pod ids. Document each parameter in a header
   comment; fail fast on a missing required one (`: "${NAMESPACE:?set NAMESPACE}"`).
3. **Read-only and idempotent** — safe to run repeatedly, in any order, with no adverse
   mutation or side effect. Observation only.
4. **Processable output** — emit something a downstream snippet can consume. Use **JSON via
   `jq`** for verbose or structured data; plain stdout is fine for a single value. Use
   judgement — not everything needs JSON.

It must also:

5. **Harvest inline code** — when adjusting, look at the inline backtick spans in the source
   `.md` snippets too (e.g. crunchy's inline `pg_dump …`, `oc apply …`), not just fenced
   blocks. `scaffold` lists these candidates for you.
6. **Pass its linter** — run the language-appropriate linter on every block you produce:
   `shellcheck` for `.sh`, and whatever is available for other languages. Fix what it flags.

## Drop unsafe snippets — and record it

If a snippet **cannot** be made read-only and idempotent, do not force it — **drop it** and
record the decision in `config.yaml` `status` so the choice is version-controlled and
durable across re-`build`s:

```yaml
      snippets:
        - id: crunchy-notes_reset-replica
          file: crunchy-notes_reset-replica.sh
          ...
          tier2: dropped
          tier2_reason: "patronictl reinit destroys and rebuilds a replica — not idempotent"
```

The parser preserves `tier2` / `tier2_reason` (keyed by group + file) on every rebuild.
Mutating operations (`patronictl reinit`/`restart`, `oc edit`/`annotate`, PITR restore,
`pg_dump` writes) are the usual drops; their read-only **observation** counterparts are
what become Tier-2 blocks.

## Worked example

Tier-1 `crunchy-notes_get-state-info.sh` (verbatim — hardcoded selector, no params, mixes
output):

```bash
# Fetch main pod name
PRIMARY_POD=$(oc get pods -l postgres-operator.crunchydata.com/role=master -o name | head -n1)
echo "Crunchy Config"
oc exec $PRIMARY_POD -it -- patronictl show-config
echo "Cluster Db Instances State"
oc exec $PRIMARY_POD -it -- patronictl list
```

Tier-2 `snippet_cluster-status.sh` — parameterized, read-only, idempotent, JSON out:

```bash
#!/usr/bin/env bash
# snippet_cluster-status — read-only crunchy cluster state as JSON.
# Params: NAMESPACE (env or $1, required). Read-only: patronictl list/show-config only.
set -euo pipefail
NS="${1:-${NAMESPACE:?set NAMESPACE or pass it as arg 1}}"

primary="$(oc get pods -n "$NS" -l postgres-operator.crunchydata.com/role=master \
  -o name 2>/dev/null | head -n1)"
[ -n "$primary" ] || { echo '{"error":"no primary pod found"}'; exit 1; }

members="$(oc exec -n "$NS" "$primary" -- patronictl list -f json 2>/dev/null || echo '[]')"
jq -n --arg ns "$NS" --argjson members "$members" \
  '{namespace: $ns, members: $members}'
```

This is safe to chain: a downstream `snippet_*` reads its JSON on stdin; a final markdown
`snippet_*` renders it for the user (below). The `reinit`/`restart`/PITR Tier-1 snippets are
dropped per the rule above.

## Markdown display snippets and render.sh

A terminal display block is a markdown `snippet_*.md` template rendered by
`tools/n8n/render.sh`, which works in and out of n8n:

- `{{ .json.path }}` — filled from JSON on stdin via `jq` (handles arrays/tables).
- `${VAR}` — filled from the environment (scalars). Bare `$FOO` is left untouched.

```markdown
<!-- snippet_cluster-report: render via tools/n8n/render.sh -->
# Cluster ${NAMESPACE}

Leader: {{ .members[] | select(.Role=="Leader") | .Member }}

| Member | State | Lag |
|--------|-------|-----|
{{ .members | map("| \(.Member) | \(.State) | \(.["Lag in MB"]) |") | join("\n") }}
```

Render it:

```bash
NAMESPACE=f208ae-dev ./snippet_cluster-status.sh f208ae-dev \
  | tools/n8n/render.sh snippet_cluster-report.md
```

In n8n, an Execute-Command node pipes the upstream node's JSON into `render.sh`; the
parameters arrive as args/env. The same files run unchanged from a developer's shell.
