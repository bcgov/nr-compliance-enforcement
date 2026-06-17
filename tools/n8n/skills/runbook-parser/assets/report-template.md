<!-- SOURCE NAME triage report. Rendered via tools/n8n/render.sh from the merged collection
     JSON (the chained collection snippets). Cleaned from SOURCE NAME.

     Conditional by design: a report can render more than any one run provides, so guard each
     data section with {{#if}} — it appears only when its data is present, and the report
     degrades cleanly (the outer {{else}} handles the nothing-arrived case).

     Inputs (the keys this report can render; list env keys bare so render.sh leaves them):
       VAR               env / arg            — describe it
       .json.path        from snippet-X       — describe it
       .other[]          from snippet-Y       — describe it
       .tags[]           any upstream node    — header capsule badges (array of strings)
       .comments         any upstream node    — free-form dump shown at the bottom (string/array/any)
       .previous         a prior report       — appended below to chain reports (string/array)
       .validations      from validator-*     — per-section verdicts shown by their data ({check,status,message})

     Tags render as shields.io badge images (capsule art) — an external image fetch, so keep tag
     text non-sensitive. You can also drop static badges in: ![](https://img.shields.io/badge/-text-555)
-->
# TITLE — ${VAR}

{{#if .tags }}
{{ .tags | map("![" + . + "](https://img.shields.io/badge/-" + (gsub("_";"__")|gsub("-";"--")|gsub(" ";"%20")) + "-555)") | join(" ") }}
{{/if}}

{{#if (.json.path | present) or (.other | present) }}
{{#if .json.path }}
**Some value:** {{ .json.path }}
{{/if}}
{{#if .other }}

## Section
{{#if .validations.other }}
> **{{ .validations.other.status | ascii_upcase }}** — {{ .validations.other.message }}

{{/if}}
| Col |
|-----|
{{ .other | map("| \(.field) |") | join("\n") }}
{{/if}}
{{else}}
_No data collected for this report._
{{/if}}
{{#if .comments }}

---

#### Notes

```
{{ .comments | if type == "array" then map(tostring) | join("\n") elif type == "string" then . else tojson end }}
```
{{/if}}
{{#if .previous }}

---

{{ .previous | if type == "array" then join("\n\n---\n\n") else . end }}
{{/if}}
