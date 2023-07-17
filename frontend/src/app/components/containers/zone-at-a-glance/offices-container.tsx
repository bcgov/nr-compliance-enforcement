import { FC, useEffect, useState  } from "react";
import { useAppDispatch, useAppSelector } from "../../../hooks/hooks";
import { getOfficesInZone, officesInZone } from "../../../store/reducers/office";
import { getTokenProfile, profileZone } from "../../../store/reducers/app";
import { Office } from "../../../types/office/office";
import { OfficeUserContainer } from "./office-user-container";
import { Row, Col } from "react-bootstrap";
import { getZoneAtAGlanceStats, zoneAtAGlanceStats } from "../../../store/reducers/complaints";

export const OfficesContainer: FC = () => {
    const dispatch = useAppDispatch();

    const defaultZone = useAppSelector(profileZone);
    const officeArray = useAppSelector(officesInZone);
    const zoneStats = useAppSelector(zoneAtAGlanceStats);

    const [officeArrayList, setOfficeArrayList] = useState<Office[]>([]);

    const hwcrAssignedNum = 21;
    const hwcrUnassignedNum = 26;
    const allegationAssignedNum = 11;
    const allegationUnassignedNum = 41;
    
    useEffect(() => {
        if (!defaultZone || defaultZone === "") {
          dispatch(getTokenProfile());
        }
      }, [dispatch, defaultZone]);

      useEffect(() => {
        if ((defaultZone && defaultZone !== "") && (officeArray === null || officeArray.length === 0)) {
          dispatch(getOfficesInZone(defaultZone));
        }
        else
        {
            setOfficeArrayList(officeArray);
        }
      }, [dispatch, defaultZone, officeArray]);

      useEffect(() => {
        dispatch(getZoneAtAGlanceStats(defaultZone));
      }, [dispatch, defaultZone]);
  
  //fear the hackiness
  const hwcrAssigned:number = Math.round(hwcrAssignedNum/(hwcrAssignedNum+hwcrUnassignedNum) * 100);
  const hwcrAssignedStyle = {
    width: (hwcrAssigned - 1) + "%",
  };
  const hwcrUnassigned:string = (100 - hwcrAssigned - 1) + "%";
  const hwcrUnassignedStyle = {
    width: hwcrUnassigned,
  };
  const allegationAssigned:number = Math.round(allegationAssignedNum/(allegationAssignedNum+allegationUnassignedNum) * 100) ;
  const allegationAssignedStyle = {
    width: (allegationAssigned - 1) + "%",
  };
  const allegationUnassigned:string = (100 - allegationAssigned - 1) + "%";
  const allegationUnassignedStyle = {
    width: allegationUnassigned,
  };


  return (
    <>
        { 
            officeArrayList.map((item) => {
                return <>
                    <div className="comp-zag-office-container">
                          <Row className="comp-zag-flex-container">
                            <Col className="comp-zag-office">
                              {item.cos_geo_org_unit.office_location_name + " Office"}
                            </Col>
                            <Col className="comp-padding-left-md">
                              <div className="comp-zag-stats-title">
                                Human Wildlife Conflict
                              </div>
                              <div className="comp-zag-bar-spacing" >
                                <div className="comp-zag-float-bar hwcr-assigned" style={hwcrAssignedStyle}>
                                  <div className="comp-zag-bar-text">
                                    {hwcrAssignedNum}
                                  </div>
                                </div>
                                <div className="comp-zag-float-bar comp-zag-bar-spacer">
                                </div>
                                <div className="comp-zag-float-bar hwcr-unassigned" style={hwcrUnassignedStyle}>
                                  <div className="comp-zag-bar-text">
                                    {hwcrUnassignedNum}
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
                                  <div className="comp-zag-float-bar allegation-assigned" style={allegationAssignedStyle}>
                                    <div className="comp-zag-bar-text">
                                      {allegationAssignedNum}
                                    </div>
                                  </div>
                                  <div className="comp-zag-float-bar comp-zag-bar-spacer">
                                  </div>
                                  <div className="comp-zag-float-bar allegation-unassigned" style={allegationUnassignedStyle}>
                                    <div className="comp-zag-bar-text">
                                      {allegationUnassignedNum}
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
