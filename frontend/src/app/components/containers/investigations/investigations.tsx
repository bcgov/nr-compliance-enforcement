import { FC } from "react";
import { Link } from "react-router-dom";

const Investigations: FC = () => {
  return (
    <div className="comp-page-container">
      <div className="comp-container">
        <div className="comp-page-header">
          <div className="comp-page-title-container">
            <h1>Investigations</h1>
          </div>
        </div>
        <div className="comp-page-content">
          <p>For developer sanity</p>

          <div className="mt-3">
            <ul>
              <li>
                <Link to="/case/35f7301d-ae9e-40e5-b2a0-1becf9157b42">Case #CASE-001</Link>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Investigations;
