import { Fragment } from "react";

interface LegislationTextProps {
  children: string | null | undefined;
}

/**
 * Renders legislation text processing formatting tags such as <hr> elements.
 */
export const LegislationText = ({ children }: LegislationTextProps) => {
  if (!children) return null;

  const text = children;

  const parts = text.split("[HR]");

  if (parts.length === 1) {
    return <>{text}</>;
  }

  return (
    <>
      {parts.map((part, index) => (
        <Fragment key={`${part.slice(0, 10)}-${part.slice(-10)}`}>
          {part.trim()}
          {index < parts.length - 1 && <hr className="legislation-hr" />}
        </Fragment>
      ))}
    </>
  );
};
