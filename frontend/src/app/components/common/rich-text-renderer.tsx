import { CSSProperties, ReactNode, memo } from "react";
import { generateHTML } from "@tiptap/html";
import StarterKit from "@tiptap/starter-kit";

export const RichTextRenderer = memo(
  ({ json, style, fallback }: { json: any; style?: CSSProperties; fallback?: ReactNode }) => {
    let html: string;
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
        {/* This is the tiptap documented pattern for rendering content. The input is schema validated and sanitized by tiptap through generateHTML */}
        <div
          className="prose max-w-none"
          dangerouslySetInnerHTML={{ __html: html }}
        />
      </div>
    );
  },
);
