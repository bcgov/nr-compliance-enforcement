import { FC } from "react";
import { Link } from "react-router-dom";

const Inspections: FC = () => {
  return (
    <div className="comp-page-container">
      <div className="comp-container">
        <div className="comp-page-header">
          <div className="comp-page-title-container">
            <h1>Inspections</h1>
          </div>
        </div>
        <div className="comp-page-content">
          <p>For developer sanity</p>
          <ul>
            <li>
              <Link to="/inspection/8116f74c-19d2-4903-9dfc-d5607c1fb900">00</Link>
            </li>
            <li>
              <Link to="/inspection/8116f74c-19d2-4903-9dfc-d5607c1fb901">01</Link>
            </li>
            <li>
              <Link to="/inspection/8116f74c-19d2-4903-9dfc-d5607c1fb902">02</Link>
            </li>
            <li>
              <Link to="/inspection/8116f74c-19d2-4903-9dfc-d5607c1fb903">03</Link>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Inspections;
