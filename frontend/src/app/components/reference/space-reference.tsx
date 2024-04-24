import { FC } from "react";
import { Container, Row, Col } from "react-bootstrap";
import { ReferenceHeader } from "./reference-header";

export const SpaceReference: FC = () => {
  const spaceUnits: { unit: string; size: string }[] = [
    { unit: "xxs", size: "4px" },
    { unit: "xs", size: "8px" },
    { unit: "sm", size: "16px" },
    { unit: "md", size: "24px" },
    { unit: "lg", size: "32px" },
    { unit: "xl", size: "40px" },
    { unit: "xxl", size: "48px" },
  ];

  const orientations: string[] = ["top", "right", "bottom", "left"];

  return (
    <>
      <Container
        fluid
        style={{ backgroundColor: "#F5F5F5" }}
      >
        <ReferenceHeader title="B.C. Gov Design System: Spacing" />

        <Row>
          <Col className="comp-margin-bottom-sm comp-padding-top-sm">
            <h2>How it works</h2>
            <p>
              Assign responsive-friendly margin or padding values to an element or a subset of its sides with shorthand
              classes. Includes support for individual properties, all properties, and vertical and horizontal
              properties. Classes are built from a custom Sass map ranging from 4px to 48px
            </p>
            <p>Units and sizes in pixels, and orientations</p>
            <p>
              <code>$space-units</code>: sass map <code>{JSON.stringify(spaceUnits)}</code>
            </p>
            <p>
              <code>$orientation</code>: sass map <code>{JSON.stringify(orientations)}</code>
            </p>
          </Col>
        </Row>
        <Row>
          <Col>
            <h2>Notation</h2>
            <p>
              Spacing utilities that apply to all breakpoints, from
              <code> xxs</code> to
              <code> xxl</code>, have no breakpoint abbreviation in them. This is because those classes are applied from{" "}
              <code>min-width: 0</code> and up, and thus are not bound by a media query. The remaining breakpoints,
              however, do include a breakpoint abbreviation.
            </p>
            <p>
              The classes are named using the format
              <code> {`.comp-{property}-{orientation}-{size}`}</code>
            </p>
            <p>
              Where <em>property</em> is one of:
            </p>
            <ul>
              <li>
                <code>margin</code> - for classes that set <code>margin</code>
              </li>
              <li>
                <code>nmargin</code> - for classes that set <code>negative margin</code>
              </li>
              <li>
                <code>pading</code> - for classes that set <code>padding</code>
              </li>
            </ul>
            <p>
              Where <em>orientation</em> is one of:
            </p>
            <ul>
              <li>
                <code>top</code> - for classes that set <code>margin-top</code> or <code>padding-top</code>
              </li>
              <li>
                <code>bottom</code> - for classes that set <code>margin-bottom</code> or <code>padding-bottom</code>
              </li>
              <li>
                <code>left</code> - for classes that set <code>margin-left</code> or <code>padding-left</code>
              </li>
              <li>
                <code>right</code> - for classes that set <code>margin-right</code> or <code>padding-right</code>
              </li>
            </ul>
            <p>
              In addition to applying maring and padding to specific sides maring and padding can be applied to a block
              without providing an orientation: <code> {`.comp-{property}-{size}`}</code>
            </p>

            <h2>Examples</h2>
            <p>Here are some representative examples of these classes:</p>
            <p>
              <code>{`.comp-margin-top-sm `}</code>
              {`{margin-top: "16px" }`}
            </p>
            <p>
              <code>{`.comp-padding-left-xl `}</code>
              {`{padding-left: "40px" }`}
            </p>
            <p>
              <code>{`.comp-nmargin-bottom-lg `}</code>
              {`{margin-top: "32px" }`}
            </p>
            <p>
              <code>{`.comp-margin-sm `}</code>
              {`{margin: "16px 16px" }`}
            </p>
          </Col>
        </Row>
      </Container>
    </>
  );
};
