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
          <ul>
            <li>
              <Link to="/investigation/66dd3a1f-4bc5-4758-a986-a664b8d8f200">200</Link>
            </li>
            <li>
              <Link to="/investigation/66dd3a1f-4bc5-4758-a986-a664b8d8f201">201</Link>
            </li>
            <li>
              <Link to="/investigation/66dd3a1f-4bc5-4758-a986-a664b8d8f202">202</Link>
            </li>
            <li>
              <Link to="/investigation/66dd3a1f-4bc5-4758-a986-a664b8d8f203">203</Link>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Investigations;
