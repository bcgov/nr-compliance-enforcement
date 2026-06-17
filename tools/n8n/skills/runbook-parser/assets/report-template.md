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
       .validations      from validator-*     — per-section verdicts ({check,status,message,docs,sources})

     Shared render.sh helpers (each returns "" when its input is absent, so call them unguarded):
       badges(.tags)             a row of shields.io capsule images
       verdict(.validations.X)   a validator's blockquote: status + message + docs link + objects checked
       dump(.comments)           a free-form comments block (array/string/any)
       chain(.previous)          a prior report's output appended (--- rule between array items)
     Wrap every table cell in cell(...) — it collapses control/whitespace (incl. invisible Unicode
     separators that would split the row) and escapes |, so a query/value can't break the table.
     Tags fetch external badge images — keep tag text non-sensitive. Drop static badges in too:
       ![](https://img.shields.io/badge/-text-555)
-->
# TITLE — ${VAR}

{{ badges(.tags) }}

{{#if (.json.path | present) or (.other | present) }}
{{#if .json.path }}
**Some value:** {{ .json.path }}
{{/if}}
{{#if .other }}

## Section
{{ verdict(.validations.other) }}

| Col |
|-----|
{{ .other | map("| \((.field // "") | gsub("[|]"; "&#124;")) |") | join("\n") }}
{{/if}}
{{else}}
_No data collected for this report._
{{/if}}
{{#if .comments }}

---

#### Notes

```
{{ dump(.comments) }}
```
{{/if}}
{{#if .previous }}

---

{{ chain(.previous) }}
{{/if}}
