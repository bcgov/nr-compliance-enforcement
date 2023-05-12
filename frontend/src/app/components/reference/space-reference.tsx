import { FC } from "react";
import { Container, Row, Col } from "react-bootstrap";
import { ReferenceHeader } from "./reference-header";

export const SpaceReference: FC = () => {
  return (
    <>
      <Container fluid style={{ backgroundColor: "#F5F5F5" }}>
        <ReferenceHeader title="B.C. Gov Design System: Spacing" />

        <Row>
          <Col className="comp-mb-s">
            <h2>How it works</h2>
            <p>
              Assign responsive-friendly margin or padding values to an element
              or a subset of its sides with shorthand classes. Includes support
              for individual properties, all properties, and vertical and
              horizontal properties. Classes are built from a custom Sass map
              ranging from 4px to 48px
            </p>

            <p>Units and sizes in pixels, and sides</p>
            <code className="highlighter-rouge">
              $space-units: ( "xxs": "4px", "xs": "8px", "s": "16px", "m":
              "24px", "l": "32px", "xl": "40px", "xxl": "48px" );
            </code>
            <br />
            <code className="highlighter-rouge">
              $sides: (top, bottom, left, right);
            </code>
          </Col>
        </Row>
        <Row>
          <Col>
            <h2>Notation</h2>
            <p>
              Spacing utilities that apply to all breakpoints, from
              <code className="highlighter-rouge"> xxs</code> to
              <code className="highlighter-rouge"> xxl</code>, have no
              breakpoint abbreviation in them. This is because those classes are
              applied from
              <code className="highlighter-rouge">min-width: 0</code> and up,
              and thus are not bound by a media query. The remaining
              breakpoints, however, do include a breakpoint abbreviation.
            </p>
            <p>
              The classes are named using the format
              <code className="highlighter-rouge">
                {" "}
                {`.comp-{property}}{sides}-{size}`}
              </code>
            </p>
            <p>
              Where <em>property</em> is one of:
            </p>
            <ul>
              <li>
                <code className="highlighter-rouge">m</code> - for classes that
                set <code className="highlighter-rouge">margin</code>
              </li>
              <li>
                <code className="highlighter-rouge">n-m</code> - for classes
                that set{" "}
                <code className="highlighter-rouge">negative margin</code>
              </li>
              <li>
                <code className="highlighter-rouge">p</code> - for classes that
                set <code className="highlighter-rouge">padding</code>
              </li>
            </ul>
            <p>
              Where <em>sides</em> is one of:
            </p>
            <ul>
              <li>
                <code className="highlighter-rouge">t</code> - for classes that
                set <code className="highlighter-rouge">margin-top</code> or{" "}
                <code className="highlighter-rouge">padding-top</code>
              </li>
              <li>
                <code className="highlighter-rouge">b</code> - for classes that
                set <code className="highlighter-rouge">margin-bottom</code> or{" "}
                <code className="highlighter-rouge">padding-bottom</code>
              </li>
              <li>
                <code className="highlighter-rouge">l</code> - for classes that
                set <code className="highlighter-rouge">margin-left</code> or{" "}
                <code className="highlighter-rouge">padding-left</code>
              </li>
              <li>
                <code className="highlighter-rouge">r</code> - for classes that
                set <code className="highlighter-rouge">margin-right</code> or{" "}
                <code className="highlighter-rouge">padding-right</code>
              </li>
            </ul>
            <h2>Examples</h2>
            <p>Here are some representative examples of these classes:</p>
            <figure className="highlight">
              <pre>
                <code className="language-scss" data-lang="scss">
                  {`.comp-mt-s {margin-top: "16px" }`}
                </code>
              </pre>
              <pre>
                <code className="language-scss" data-lang="scss">
                  {`.comp-pl-xl {padding-left: "40px" }`}
                </code>
              </pre>
              <pre>
                <code className="language-scss" data-lang="scss">
                  {`.comp-n-mr-s {margin-right: "-24px" }`}
                </code>
              </pre>
            </figure>
          </Col>
        </Row>
      </Container>
    </>
  );
};
