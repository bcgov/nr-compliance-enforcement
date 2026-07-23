import { FC, ReactNode } from "react";
import { Link } from "react-router-dom";

interface PartyHeaderProps {
  title: string;
  badges?: ReactNode;
  actions?: ReactNode;
}

export const PartyHeader: FC<PartyHeaderProps> = ({ title, badges, actions }) => {
  return (
    <div className="comp-details-header">
      <div className="comp-container">
        {/* <!-- breadcrumb start --> */}
        <div className="comp-complaint-breadcrumb">
          <nav aria-label="breadcrumb">
            <ol className="breadcrumb">
              <li className="breadcrumb-item comp-nav-item-name-inverted">
                <Link to="/parties">Parties</Link>
              </li>
              <li
                className="breadcrumb-item"
                aria-current="page"
              >
                {title}
              </li>
            </ol>
          </nav>
        </div>
        {/* <!-- breadcrumb end --> */}

        <div className="comp-details-title-container">
          <div className="comp-details-title-info d-flex align-items-center gap-2">
            <h1 className="comp-box-complaint-id mb-0 pb-1">
              <span>{title}</span>
            </h1>
            {badges}
          </div>
          <div className="comp-header-actions">{actions}</div>
        </div>
      </div>
    </div>
  );
};
