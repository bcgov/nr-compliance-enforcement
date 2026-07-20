import { CSSProperties, ReactNode, memo } from "react";
import { generateHTML } from "@tiptap/html";
import StarterKit from "@tiptap/starter-kit";

export const RichTextRenderer = memo(
  ({ json, style, fallback }: { json: any; style?: CSSProperties; fallback?: ReactNode }) => {
    let html: string;
    // JSON.parse throws on malformed json; generateHTML throws when json isn't a valid ProseMirror doc
    try {
      html = generateHTML(typeof json === "string" ? JSON.parse(json) : json, [StarterKit]);
    } catch {
      return <>{fallback ?? null}</>;
    }

    return (
      <div
        className="mt-1"
        style={style}
      >
        <div
          className="prose max-w-none"
          dangerouslySetInnerHTML={{ __html: html }}
        />
      </div>
    );
  },
);
