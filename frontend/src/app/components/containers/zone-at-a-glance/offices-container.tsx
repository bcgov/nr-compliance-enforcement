import { FC } from "react";
import { OfficeUserContainer } from "./office-user-container";
import { Row, Col } from "react-bootstrap";
import { OfficeStats } from "../../../types/complaints/zone-at-a-glance-stats";

type Props = {
  hwcrOpenComplaintsOfficeStats: OfficeStats[],
  allegationOpenComplaintsOfficeStats: OfficeStats[],
}

export const OfficesContainer: FC<Props> = ({hwcrOpenComplaintsOfficeStats, allegationOpenComplaintsOfficeStats}) => {

  return (
    <>
        { 
            hwcrOpenComplaintsOfficeStats.map((item, index) => {
              let hwcrUnassigned:number = 0;
              let hwcrUnassignedStyle:{width:string} = {width: "49%" };
              let hwcrAssigned:number = 0;
              let hwcrAssignedStyle:{width:string} = {width: "49%" };

              let allegationUnassigned:number = 0;
              let allegationUnassignedStyle:{width: string} = {width: "49%" };
              let allegationAssigned:number = 0;
              let allegationAssignedStyle:{width: string} = {width: "49%" };

               //fear the hackiness -- this should probably be refactored
              if(item !== undefined && item.unassigned !== undefined && allegationOpenComplaintsOfficeStats[index] !== undefined && allegationOpenComplaintsOfficeStats[index].unassigned !== undefined)
              {
              if(item.assigned === 0 && item.unassigned === 0)
              {
                hwcrUnassigned = 0;
                hwcrUnassignedStyle = {width: "49%" };
                hwcrAssigned = 0;
                hwcrAssignedStyle = {width: "49%" };
              }
              else if(item.assigned === 0 && item.unassigned !== 0)
              {
                hwcrUnassigned = item.unassigned;
                hwcrUnassignedStyle = {width: "94%" };
                hwcrAssigned = 0;
                hwcrAssignedStyle = {width: "4%" };
              }
              else if(item.assigned !== 0 && item.unassigned === 0)
              {
                hwcrUnassigned = 0;
                hwcrUnassignedStyle = {width: "4%" };
                hwcrAssigned = item.assigned;
                hwcrAssignedStyle = {width: "94%" };
              }
              else
              {
                hwcrAssigned = item.assigned;
                hwcrAssignedStyle = {
                  width: (Math.round(item.assigned/(item.assigned+item.unassigned) * 100) - 1) + "%",
                };
                hwcrUnassigned = 100 - hwcrAssigned;
                hwcrUnassignedStyle = {
                  width: ( 100 - Math.round(item.assigned/(item.assigned+item.unassigned) * 100) - 1) + "%",
                };
              }
              if(allegationOpenComplaintsOfficeStats[index].assigned === 0 && allegationOpenComplaintsOfficeStats[index].unassigned === 0)
              {
                allegationUnassigned = 0;
                allegationUnassignedStyle = {width: "49%" };
                allegationAssigned = 0;
                allegationAssignedStyle = {width: "49%" };
              }
              else if(allegationOpenComplaintsOfficeStats[index].assigned === 0 && allegationOpenComplaintsOfficeStats[index].unassigned !== 0)
              {
                allegationUnassigned = allegationOpenComplaintsOfficeStats[index].unassigned;
                allegationUnassignedStyle = {width: "94%" };
                allegationAssigned = 0;
                allegationAssignedStyle = {width: "4%" };
              }
              else if(allegationOpenComplaintsOfficeStats[index].assigned !== 0 && allegationOpenComplaintsOfficeStats[index].unassigned === 0)
              {
                allegationUnassigned = 0;
                allegationUnassignedStyle = {width: "4%" };
                allegationAssigned = allegationOpenComplaintsOfficeStats[index].assigned;
                allegationAssignedStyle = {width: "94%" };
              }
              else
              {
                allegationAssigned = allegationOpenComplaintsOfficeStats[index].assigned;
                allegationAssignedStyle = {
                  width: (Math.round(allegationOpenComplaintsOfficeStats[index].assigned/(allegationOpenComplaintsOfficeStats[index].assigned+allegationOpenComplaintsOfficeStats[index].unassigned) * 100) - 1) + "%",
                };
                allegationUnassigned = allegationOpenComplaintsOfficeStats[index].unassigned;
                allegationUnassignedStyle = {
                  width: (100 - Math.round(allegationOpenComplaintsOfficeStats[index].assigned/(allegationOpenComplaintsOfficeStats[index].assigned+allegationOpenComplaintsOfficeStats[index].unassigned) * 100) - 1) + "%",
                };
              }
            }
            
                return <>
                    <div className="comp-zag-office-container">
                          <Row className="comp-zag-flex-container">
                            <Col className="comp-zag-office">
                              {item.name + " Office"}
                            </Col>
                            <Col className="comp-padding-left-md">
                              <div className="comp-zag-stats-title">
                                Human Wildlife Conflict
                              </div>
                              <div className="comp-zag-bar-spacing" >
                                <div className="comp-zag-float-bar hwcr-unassigned" style={hwcrUnassignedStyle}>
                                  <div className="comp-zag-bar-text">
                                    {hwcrUnassigned}
                                  </div>
                                </div>
                                <div className="comp-zag-float-bar comp-zag-bar-spacer">
                                </div>
                                <div className="comp-zag-float-bar hwcr-assigned" style={hwcrAssignedStyle}>
                                  <div className="comp-zag-bar-text">
                                    {hwcrAssigned}
                                  </div>
                                </div>
                                <div className="clear-left-float" />
                              </div>
                              <div className="comp-zag-stats-view">
                                View Unassigned Compaints
                              </div>
                            </Col>
                            <Col className="comp-padding-left-md">
                              <div className="comp-zag-stats-title">
                                Enforcement
                              </div>
                              <div className="comp-zag-bar-spacing" >
                                  <div className="comp-zag-float-bar allegation-unassigned" style={allegationUnassignedStyle}>
                                    <div className="comp-zag-bar-text">
                                      {allegationUnassigned}
                                    </div>
                                  </div>
                                  <div className="comp-zag-float-bar comp-zag-bar-spacer">
                                  </div>
                                  <div className="comp-zag-float-bar allegation-assigned" style={allegationAssignedStyle}>
                                    <div className="comp-zag-bar-text">
                                      {allegationAssigned}
                                    </div>
                                  </div>
                                <div className="clear-left-float"/>
                              </div>
                              <div className="comp-zag-stats-view">
                                View Unassigned Compaints
                              </div>
                            </Col>
                          </Row>
                      <div><OfficeUserContainer officersInOffice={item.officers}/></div>
                    </div>
                </>;
            }) 
        }
    </>
  );
};
