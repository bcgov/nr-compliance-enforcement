#!/usr/bin/env bash
# utils.sh — standard messaging for the tools/n8n shell helpers. SOURCE it; don't execute it:
#
#   . "$(dirname "$0")/utils.sh"          # local: sibling of view.sh / render.sh
#   . "$(command -v utils.sh)"            # n8n image: installed on PATH (/usr/local/bin)
#
# Everything prints to STDERR so stdout stays clean for JSON / pipes (snippets, render.sh).
#   info  — progress / neutral note        warn — non-fatal problem
#   err   — error (no exit)                 die  — error + exit 1
#   have  — is a command on PATH?           (use for soft dependency checks)
# Set N8N_LOG_TAG to prefix every line with "<tag>: " (e.g. the calling script's name).
# Idempotent and side-effect-free to source; safe to source more than once.

: "${N8N_LOG_TAG:=}"

_n8n_emit() { # _n8n_emit LEVEL_PREFIX MESSAGE...
  local level="$1"
  shift
  printf '%s%s%s\n' "${N8N_LOG_TAG:+$N8N_LOG_TAG: }" "$level" "$*" >&2
}

info() { _n8n_emit "" "$@"; }
warn() { _n8n_emit "warning: " "$@"; }
err() { _n8n_emit "error: " "$@"; }
die() {
  err "$@"
  exit 1
}
have() { command -v "$1" >/dev/null 2>&1; }

# --- Output bounds (GLOBAL) -------------------------------------------------------------------
# Truncate collected text AT THE SOURCE, before it is ever stored as JSON, so no single field can
# blow past two limits: (1) n8n hands each node's stdout to the next base64-encoded as ONE command
# arg/env value, and Linux caps a single arg/env string at MAX_ARG_STRLEN (~128KB) — a bigger one
# makes the next execve fail with E2BIG and kills the whole run; (2) a report no human will read.
# base64 inflates ~33%, so keep each raw field well under ~96KB; with several services merged into one
# payload the ~8KB/field default below leaves headroom. Override per-run via env for a deeper look.
: "${TRIAGE_MAX_LINE:=500}"    # truncate any single line to this many characters (kills giant lines)
: "${TRIAGE_MAX_BYTES:=8000}"  # per field, keep only the most-recent lines that fit this many bytes

# clip_stream — bound a raw text stream (stdin -> stdout), truncating EARLY so oversized content never
# reaches the stored JSON. Caps each line to TRIAGE_MAX_LINE chars (sed cuts on a character boundary,
# so output stays valid UTF-8 for jq — a byte-cut could split a codepoint and make jq -Rs choke), then
# keeps only the most-recent lines that fit the TRIAGE_MAX_BYTES budget (logs/errors are newest-last,
# so tail keeps what matters). This is the ONE place output bounds live — change the caps here.
clip_stream() {
  local cols="${TRIAGE_MAX_LINE:-500}" budget="${TRIAGE_MAX_BYTES:-8000}" keep
  (( cols > 0 )) || cols=500
  keep=$(( budget / cols )); (( keep > 0 )) || keep=1
  sed -E "s/^(.{$cols}).+$/\1…/" | tail -n "$keep"
}
