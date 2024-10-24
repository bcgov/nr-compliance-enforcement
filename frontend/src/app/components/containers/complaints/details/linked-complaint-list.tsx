import { FC, useEffect, useState } from "react";
import { useAppDispatch } from "../../../../hooks/hooks";
import { applyStatusClass } from "../../../../common/methods";
import { Badge } from "react-bootstrap";
import { Link } from "react-router-dom";
import { BsChevronDown, BsChevronUp } from "react-icons/bs";

const linkedComplaintData = [
  {
    id: "23-031750",
    details:
      'Reporting an injured BB needing to be dispatched in the below noted location. Caller states that the BB\'s hind quarters are "scattered all over the road". ',
    name: "",
    address: "",
    email: "",
    phone1: "",
    status: "Closed",
    hwcrId: "d94a00c4-6d49-443b-8a0d-5209bb0323ad",
    species: "Black bear",
    natureOfComplaint: "Injured/distressed - present",
  },
  {
    id: "24-000844",
    details: "",
    name: "",
    address: "",
    phone1: "",
    status: "Open",
    hwcrId: "6823d7f5-fce6-4bb8-bddc-c9d8327905d4",
    species: "Black bear",
    natureOfComplaint: "Damage to property - not present",
  },
  {
    id: "23-007009",
    details:
      "On Mar 30, 2023 at 1245 hrs I observed Lean Bean Miller's truck (see photo) hauling a load of poultry slaughter waste along Doran Rd heading north to Hillbank Rd. I have followed this truck in past from the Island Farmhouse Poultry facility to 4035 Hillbank Road and can attest that this is the route this truck takes to dump its loads of slaughter waste. Last month both Island Farmhouse Poultry Ltd. and GT Farms were told by the Ministry to 'Immediately cease disposing of any processing waste that comes from poultry not reared, kept or slaughtered at Miller properties.' The most recent Ministry Inspection reports, UA202814 and AG144737, both stated that this unauthorized waste disposal must be ceased immediately. Its time for the Ministry to involve the Conservation Officer Service and to start taking regulations enforcement seriously. ",
    name: "Dalton Campbell",
    address: "1234 Doran Road, Cobble Hill, BC V0R 1L5 ",
    phone1: "250-743-1331",
    status: "Closed",
    hwcrId: "f9e581c8-5a63-4561-b5f7-9c28d107481d",
    species: "Black bear",
    natureOfComplaint: "Confined",
  },
  {
    id: "23-032442",
    details:
      "Reporting that there is a small BB cub that has been seen in the area without a sow. Caller states that she was attempting to walk her dog about 1 hour prior to call in and was told by a neighbour that there was a cub in the area. Caller states she just noticed the cub at the back of her residence that has a hill that adjoins onto East Kenworth. ",
    name: "",
    address: "",
    phone1: "",
    status: "Closed",
    hwcrId: "179493a0-8378-4c13-a7c6-7ff50de71117",
    species: "Black bear",
    natureOfComplaint: "Orphaned - large carnivores/ungulates only",
  },
  {
    id: "23-032445",
    details:
      "Reporting that there is a small BB cub that has been seen in the area without a sow. Caller states that she was attempting to walk her dog about 1 hour prior to call in and was told by a neighbour that there was a cub in the area. Caller states she just noticed the cub at the back of her residence that has a hill that adjoins onto East Kenworth. ",
    name: "",
    address: "",
    phone1: "",
    status: "Closed",
    hwcrId: "179493a0-8378-4c13-a7c6-7ff50de71117",
    species: "Black bear",
    natureOfComplaint: "Orphaned - large carnivores/ungulates only",
  },
  {
    id: "23-032446",
    details:
      "Reporting that there is a small BB cub that has been seen in the area without a sow. Caller states that she was attempting to walk her dog about 1 hour prior to call in and was told by a neighbour that there was a cub in the area. Caller states she just noticed the cub at the back of her residence that has a hill that adjoins onto East Kenworth. ",
    name: "",
    address: "",
    phone1: "",
    status: "Closed",
    hwcrId: "179493a0-8378-4c13-a7c6-7ff50de71117",
    species: "Black bear",
    natureOfComplaint: "Orphaned - large carnivores/ungulates only",
  },
  {
    id: "23-032447",
    details:
      "Reporting that there is a small BB cub that has been seen in the area without a sow. Caller states that she was attempting to walk her dog about 1 hour prior to call in and was told by a neighbour that there was a cub in the area. Caller states she just noticed the cub at the back of her residence that has a hill that adjoins onto East Kenworth. ",
    name: "",
    address: "",
    phone1: "",
    status: "Closed",
    hwcrId: "179493a0-8378-4c13-a7c6-7ff50de71117",
    species: "Black bear",
    natureOfComplaint: "Orphaned - large carnivores/ungulates only",
  },
  {
    id: "23-032448",
    details:
      "Reporting that there is a small BB cub that has been seen in the area without a sow. Caller states that she was attempting to walk her dog about 1 hour prior to call in and was told by a neighbour that there was a cub in the area. Caller states she just noticed the cub at the back of her residence that has a hill that adjoins onto East Kenworth. ",
    name: "",
    address: "",
    phone1: "",
    status: "Closed",
    hwcrId: "179493a0-8378-4c13-a7c6-7ff50de71117",
    species: "Black bear",
    natureOfComplaint: "Orphaned - large carnivores/ungulates only",
  },
  {
    id: "23-032449",
    details:
      "Reporting that there is a small BB cub that has been seen in the area without a sow. Caller states that she was attempting to walk her dog about 1 hour prior to call in and was told by a neighbour that there was a cub in the area. Caller states she just noticed the cub at the back of her residence that has a hill that adjoins onto East Kenworth. ",
    name: "",
    address: "",
    phone1: "",
    status: "Closed",
    hwcrId: "179493a0-8378-4c13-a7c6-7ff50de71117",
    species: "Black bear",
    natureOfComplaint: "Orphaned - large carnivores/ungulates only",
  },
];

export const LinkedComplaintList: FC<{ complaintIdentifier: string }> = ({ complaintIdentifier }) => {
  const dispatch = useAppDispatch();
  const [expandedComplaints, setExpandedComplaints] = useState<Record<string, boolean>>({});
  const [viewMore, setViewMore] = useState<boolean>(false);

  useEffect(() => {
    //Call getLinkedComplaints here
    // dispatch(getRelatedData(complaintIdentifier));
  }, [complaintIdentifier, dispatch]);

  const toggleExpand = (id: string) => {
    setExpandedComplaints((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const toggleViewMore = () => {
    setViewMore(!viewMore);
  };

  return (
    <>
      {linkedComplaintData && linkedComplaintData.length > 0 && (
        <div className="comp-complaint-details-block">
          <div>
            <h2>Linked complaints</h2>
          </div>
          <div>
            {linkedComplaintData.map((data, index) => (
              <div
                className="comp-linked-complaint-item"
                style={{ display: `${index > 4 && !viewMore ? "none" : "flex"}` }}
                key={data.id}
                onClick={() => toggleExpand(data.id)}
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
                    <Badge
                      id="comp-details-status-text-id"
                      className={`badge ${applyStatusClass(data.status)}`}
                    >
                      {data.status}
                    </Badge>
                  </div>
                </div>
                {expandedComplaints[data.id] && (
                  <div className="comp-details-section">
                    <div>
                      <dt>Complaint Description</dt>
                      <dd id="comp-details-description">{data.details}</dd>
                    </div>
                    {data.name && (
                      <div>
                        <dt>Name</dt>
                        <dd id="comp-details-location">{data.name}</dd>
                      </div>
                    )}
                    {data.phone1 && (
                      <div>
                        <dt>Primary Phone</dt>
                        <dd id="comp-details-location-description">{data.phone1}</dd>
                      </div>
                    )}
                    {data.address && (
                      <div>
                        <dt>Address</dt>
                        <dd id="comp-details-location-description">{data.address}</dd>
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
          >
            {!viewMore && linkedComplaintData.length > 5 ? (
              <>
                View more <BsChevronDown />
              </>
            ) : (
              <>
                View less <BsChevronUp />
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
};
