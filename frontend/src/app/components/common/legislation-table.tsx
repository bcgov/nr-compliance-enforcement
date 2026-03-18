import { Table } from "react-bootstrap";
import { LegislationText } from "./legislation-text";

interface LegislationTableProps {
  html: string;
}

export const LegislationTable = ({ html }: LegislationTableProps) => {
  const doc = new DOMParser().parseFromString(html, "text/html");
  const getRows = (selector: string) =>
    Array.from(doc.querySelectorAll(`${selector} tr`)).map((tr) => Array.from(tr.children));

  const getAttr = (cell: Element, attr: string) => {
    const val = cell.getAttribute(attr);
    return val ? Number(val) : undefined;
  };

  const renderRows = (rows: Element[][], prefix: string) =>
    rows.map((cells, rowIdx) => (
      <tr key={`${prefix}-${rowIdx}`}>
        {cells.map((cell, cellIdx) => {
          const Tag = cell.tagName.toLowerCase() as "th" | "td";
          return (
            <Tag
              key={`${prefix}-${rowIdx}-${cellIdx}-${cell.textContent?.slice(0, 10)}`}
              rowSpan={getAttr(cell, "rowspan")}
              colSpan={getAttr(cell, "colspan")}
            >
              <LegislationText>{cell.textContent}</LegislationText>
            </Tag>
          );
        })}
      </tr>
    ));

  return (
    <Table
      bordered
      size="sm"
      className="comp-table"
    >
      <thead>{renderRows(getRows("thead"), "th")}</thead>
      <tbody>{renderRows(getRows("tbody"), "td")}</tbody>
    </Table>
  );
};
