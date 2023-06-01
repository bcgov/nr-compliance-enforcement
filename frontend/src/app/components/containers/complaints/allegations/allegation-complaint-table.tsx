import { FC, useEffect } from "react";
import "../../../../../assets/sass/app.scss";
import { format } from 'date-fns';
import { Row, Table } from "react-bootstrap";
import { useAppDispatch, useAppSelector } from "../../../../hooks/hooks";
import { getAllegationComplaints, allegationComplaints } from "../../../../store/reducers/allegation-complaint"

export const AllegationComplaintTable: FC = () => {
    const dispatch = useAppDispatch();

    const allegationComplaintsArray = useAppSelector(allegationComplaints);

    useEffect(() => {
            dispatch(getAllegationComplaints());
  }, [allegationComplaints, dispatch])


    return (
        <Table id="comp-allegation-table" className="comp-allegation-table">
            <tbody>
                {allegationComplaintsArray.map((val, key, {length}) => {
                    const complaint_identifier = val.complaint_identifier.complaint_identifier;
                    const incident_reported_datetime = val.complaint_identifier.incident_reported_datetime != null ? format(Date.parse(val.complaint_identifier.incident_reported_datetime), 'yyyy/MM/dd kk:mm:ss') : "";
                    const violation_code = val.violation_code != null ? val.violation_code.long_description : "";
                    const in_progreess_button =  val.in_progreess === 'true' ? "<button type=\"button\" className=\"btn btn-primary comp-allegation-species-btn\">" + val.in_progreess + "</button>" : "";
                    const geo_organization_unit_code = val.complaint_identifier.geo_organization_unit_code ? val.complaint_identifier.geo_organization_unit_code.short_description : "";
                    const location_summary = val.complaint_identifier.location_summary_text;
                    const statusClass =  val.complaint_identifier.complaint_status_code.long_description === 'Closed' ? 'btn btn-primary comp-allegation-status-closed-btn' : 'btn btn-primary comp-allegation-status-open-btn';
                    const status = val.complaint_identifier.complaint_status_code.long_description;
                    const update_date = val.complaint_identifier.update_timestamp != null ? format(Date.parse(val.complaint_identifier.update_timestamp), 'yyyy/MM/dd kk:mm:ss') : "";
                    //alternate behaviour for last row for alternate borders and radius'
                    if(length - 1 === key)
                    {
                        return (
                            <Row key={key}>
                                <td id="comp-allegation-id-coulmn{length}" className="comp-allegation-small-cell comp-allegation-cell comp-allegation-cell-bottom comp-allegation-cell-left comp-bottom-left">{complaint_identifier}</td>
                                <td className="comp-allegation-small-cell comp-allegation-cell-bottom comp-allegation-cell">{incident_reported_datetime}</td>
                                <td className="comp-allegation-violation-cell comp-allegation-cell comp-allegation-cell-bottom">{violation_code}</td>
                                <td className="comp-allegation-in-progress-cell comp-allegation-cell comp-allegation-cell-bottom">
                                    {in_progreess_button}
                                </td>
                                <td className="comp-allegation-area-cell comp-allegation-cell comp-allegation-cell-bottom">{geo_organization_unit_code}</td>
                                <td className="comp-allegation-location-cell comp-allegation-cell comp-allegation-cell-bottom">{location_summary}</td>
                                <td className="comp-allegation-medium-cell comp-allegation-cell comp-allegation-cell-bottom">
                                    Unassigned
                                </td>
                                <td className="comp-allegation-status-cell comp-allegation-cell comp-allegation-cell-bottom">
                                    <button type="button" className={statusClass}>{status}</button>
                                </td>
                                <td className="comp-allegation-last-updated-cell comp-allegation-cell comp-allegation-cell-bottom comp-bottom-right">{update_date}</td>
                            </Row>
                        )
                    }
                    else
                    {
                        return (
                            <Row key={key}>
                                <td className="comp-allegation-small-cell comp-allegation-cell comp-allegation-cell-left">{complaint_identifier}</td>
                                <td className="comp-allegation-small-cell comp-allegation-cell">{incident_reported_datetime}</td>
                                <td className="comp-allegation-violation-cell comp-allegation-cell">{violation_code}</td>
                                <td className="comp-allegation-in-prg-cell comp-allegation-cell">
                                    {in_progreess_button}
                                </td>
                                <td className="comp-allegation-area-cell comp-allegation-cell">{geo_organization_unit_code}</td>
                                <td className="comp-allegation-location-cell comp-allegation-cell">{location_summary}</td>
                                <td className="comp-allegation-medium-cell comp-allegation-cell">
                                    Unassigned
                                </td>
                                <td className="comp-allegation-status-cell comp-allegation-cell">
                                <button type="button" className={statusClass}>{status}</button>
                                </td>
                                <td className="comp-allegation-last-updated-cell comp-allegation-cell">{update_date}</td>
                            </Row>
                        )
                    }
                    })}
            </tbody>
        </Table>
    );
  };