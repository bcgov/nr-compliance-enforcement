import { CSSProperties, memo } from "react";
import { generateHTML } from "@tiptap/html";
import StarterKit from "@tiptap/starter-kit";

export const ReportRenderer = memo(({ json, style }: { json: any; style?: CSSProperties }) => {
  const html = generateHTML(json, [StarterKit]);

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
});
