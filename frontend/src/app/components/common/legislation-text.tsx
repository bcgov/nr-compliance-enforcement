import { Fragment, JSX } from "react";

interface LegislationTextProps {
  children: string | null | undefined;
}

// HTML-style self-closing tags for formatting markers
const MARKUP: Array<{ pattern: string; render: () => JSX.Element }> = [
  { pattern: "<hr/>", render: () => <hr className="legislation-hr" /> },
  { pattern: "<br/>", render: () => <br /> },
];

// Escape special regex characters in HTML tag patterns
const escapePattern = (pattern: string) => pattern.replaceAll(/[/<>]/g, String.raw`\$&`);

const MARKUP_REGEX = new RegExp(`(${MARKUP.map((m) => escapePattern(m.pattern)).join("|")})`, "g");

/**
 * Renders legislation text processing formatting markers into JSX elements.
 */
export const LegislationText = ({ children }: LegislationTextProps) => {
  if (!children) return null;

  const parts = children.split(MARKUP_REGEX).filter(Boolean);

  return (
    <>
      {parts.map((part, index) => {
        const marker = MARKUP.find((m) => m.pattern === part);
        return <Fragment key={`${part.slice(0, 10)}-${index}`}>{marker ? marker.render() : part}</Fragment>;
      })}
    </>
  );
};
