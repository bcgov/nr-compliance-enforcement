import { FC } from "react";
import { Link } from "react-router-dom";

const Cases: FC = () => {
  return (
    <div className="comp-page-container">
      <div className="comp-container">
        <div className="comp-page-header">
          <div className="comp-page-title-container">
            <h1>Cases</h1>
          </div>
        </div>
        <div className="comp-page-content">
          <p>Lorim... Ipsum?</p>

          <div className="mt-3">
            <ul>
              <li>
                <Link to="/case/CASE-001">Case #CASE-001</Link>
              </li>
              <li>
                <Link to="/case/CASE-002">Case #CASE-002</Link>
              </li>
              <li>
                <Link to="/case/CASE-003">Case #CASE-003</Link>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cases;
