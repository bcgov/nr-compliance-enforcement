import { FC, useState } from "react";
import { applyStatusClass } from "@common/methods";
import { Badge } from "react-bootstrap";
import { Link } from "react-router-dom";
import { BsChevronDown, BsChevronUp } from "react-icons/bs";
import { formatPhoneNumber } from "react-phone-number-input/input";
import { LinkedComplaint } from "@/app/types/app/complaints/linked-complaint";

type Props = {
  linkedComplaintData: LinkedComplaint[];
};

export const LinkedComplaintList: FC<Props> = ({ linkedComplaintData }) => {
  const [expandedComplaints, setExpandedComplaints] = useState<Record<string, boolean>>({});
  const [viewMore, setViewMore] = useState<boolean>(false);

  const toggleExpand = (id: string) => {
    setExpandedComplaints((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const toggleViewMore = () => {
    setViewMore(!viewMore);
  };

  const renderViewMore = () => {
    if (linkedComplaintData.length > 5) {
      if (!viewMore) {
        return (
          <>
            View more <BsChevronDown />
          </>
        );
      } else {
        return (
          <>
            View less <BsChevronUp />
          </>
        );
      }
    } else {
      return <></>;
    }
  };

  return (
    <div className="comp-complaint-details-block">
      <div>
        <h2>Duplicate complaints</h2>
      </div>
      <div>
        {linkedComplaintData.map((data, index) => (
          <div
            className="comp-linked-complaint-item"
            style={{ display: `${index > 4 && !viewMore ? "none" : "flex"}` }}
            key={data.id}
            role="button"
            tabIndex={index}
            onClick={() => toggleExpand(data.id)}
            onKeyDown={() => toggleExpand(data.id)}
          >
            <div className="item-header">
              <div className="item-link">
                <Link
                  to={`/complaint/HWCR/${data.id}`}
                  id={data.id}
                >
                  {data.id}
                </Link>
              </div>
              <div>{data.species}</div>
              <div> • </div>
              <div>{data.natureOfComplaint}</div>
              <div className="comp-details-badge-container">
                <Badge className={`badge ${applyStatusClass(data.status)}`}>{data.status}</Badge>
              </div>
            </div>
            {expandedComplaints[data.id] && (
              <div className="comp-details-section">
                <div>
                  <dt>Complaint description</dt>
                  <dd>{data.details}</dd>
                </div>
                {data.name && (
                  <div>
                    <dt>Name</dt>
                    <dd>{data.name}</dd>
                  </div>
                )}
                {data.phone && (
                  <div>
                    <dt>Primary phone</dt>
                    <dd>{formatPhoneNumber(data.phone)}</dd>
                  </div>
                )}
                {data.address && (
                  <div>
                    <dt>Address</dt>
                    <dd>{data.address}</dd>
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
      <div
        className="viewMore"
        onClick={toggleViewMore}
        onKeyDown={toggleViewMore}
      >
        {renderViewMore()}
      </div>
    </div>
  );
};
