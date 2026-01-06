import { CompLocationInfo } from "@/app/components/common/comp-location-info";
import { Investigation } from "@/generated/graphql";
import { Card } from "react-bootstrap";
import { Link } from "react-router-dom";

interface InvestigationItemProps {
  investigationData: Investigation;
  caseGuid: string;
  caseName: string;
}

export const InvestigationItem = ({ investigationData, caseGuid, caseName }: InvestigationItemProps) => {
  return (
    <section className="comp-details-section">
      <Card
        className="mb-3"
        border="default"
      >
        <Card.Body>
          <dl>
            <div>
              <dt>Investigation ID</dt>
              <dd>
                <pre id="investigation-summary-id">{investigationData.name}</pre>
              </dd>
            </div>
            <div>
              <dt>Case ID</dt>
              <dd>
                <pre id="investigation-summary-case-id">
                  {caseGuid ? <Link to={`/case/${caseGuid}`}>{caseName || caseGuid}</Link> : "N/A"}
                </pre>
              </dd>
            </div>
            <div>
              <dt>Created by</dt>
              <dd id="comp-details-created-by"> {createdBy}</dd>
            </div>
            <div>
              <dt>Date logged</dt>
              <dd id="comp-details-date-logged">
                {investigationData.openedTimestamp && (
                  <div>
                    <i className="bi bi-calendar"></i>&nbsp;{formatDate(investigationData.openedTimestamp)}
                    &nbsp;&nbsp;
                    <i className="bi bi-clock"></i>&nbsp;{formatTime(investigationData.openedTimestamp)}
                  </div>
                )}
              </dd>
            </div>
            {investigationData.description && (
              <div>
                <dt>Investigation description</dt>
                <dd>
                  <pre id="investigation-summary-description">{investigationData.description}</pre>
                </dd>
              </div>
            )}
            <div>
              <dt>Location/address</dt>
              <dd id="comp-details-location">{investigationData.locationAddress}</dd>
            </div>
            <div>
              <dt>Location description</dt>
              <dd id="comp-details-location-description">{investigationData.locationDescription}</dd>
            </div>
            <div className="row">
              <div className="col-12">
                <div className="form-group">
                  <CompLocationInfo
                    xCoordinate={
                      investigationData?.locationGeometry?.coordinates?.[0] === 0
                        ? ""
                        : (investigationData?.locationGeometry?.coordinates?.[0]?.toString() ?? "")
                    }
                    yCoordinate={
                      investigationData?.locationGeometry?.coordinates?.[1] === 0
                        ? ""
                        : (investigationData?.locationGeometry?.coordinates?.[1]?.toString() ?? "")
                    }
                  />
                </div>
              </div>
            </div>
          </dl>
        </Card.Body>
      </Card>
    </section>
  );
};
