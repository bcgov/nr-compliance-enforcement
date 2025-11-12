import { memo } from "react";
import { generateHTML } from "@tiptap/html";
import StarterKit from "@tiptap/starter-kit";

export const ReportRenderer = memo(({ json }: { json: any }) => {
  const html = generateHTML(json, [StarterKit]);

  return (
    <div className="mt-1">
      <div
        className="prose max-w-none"
        dangerouslySetInnerHTML={{ __html: html }}
      />
    </div>
  );
});
