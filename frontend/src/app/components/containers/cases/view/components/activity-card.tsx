import { FC, ReactNode } from "react";
import { Link } from "react-router-dom";
import { Badge } from "react-bootstrap";

interface ActivityCardProps {
  id: string;
  linkTo: string;
  statusBadge: {
    text: string;
    className: string;
  };
  children?: ReactNode;
}

export const ActivityCard: FC<ActivityCardProps> = ({ id, linkTo, statusBadge, children }) => {
  return (
    <div className="border rounded p-3 mb-3 bg-white">
      <div className="d-flex align-items-center justify-content-between">
        <Link
          to={linkTo}
          className="comp-cell-link"
        >
          {id}
        </Link>
        <Badge className={statusBadge.className}>{statusBadge.text}</Badge>
      </div>
      {children && <div className="mt-2 text-muted small">{children}</div>}
    </div>
  );
};
