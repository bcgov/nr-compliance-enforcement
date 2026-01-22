import { Fragment, JSX } from "react";

interface LegislationTextProps {
  children: string | null | undefined;
}

// HTML-style tags for formatting markers (handles both <hr/> and <hr> formats)
const MARKUP: Array<{ pattern: RegExp; render: () => JSX.Element }> = [
  { pattern: /<hr\s*\/?>/gi, render: () => <hr className="legislation-hr" /> },
  { pattern: /<br\s*\/?>/gi, render: () => <br /> },
];

const MARKUP_REGEX = new RegExp(`(${MARKUP.map((m) => m.pattern.source).join("|")})`, "gi");

/**
 * Renders legislation text processing formatting markers into JSX elements.
 */
export const LegislationText = ({ children }: LegislationTextProps) => {
  if (!children) return null;

  const parts = children.split(MARKUP_REGEX).filter(Boolean);

  return (
    <>
      {parts.map((part, index) => {
        const marker = MARKUP.find((m) => m.pattern.test(part));
        return <Fragment key={`${part.slice(0, 10)}-${index}`}>{marker ? marker.render() : part}</Fragment>;
      })}
    </>
  );
};
