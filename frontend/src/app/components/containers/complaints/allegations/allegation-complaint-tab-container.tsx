import { FC } from "react";
import { AllegationComplaintTableHeader } from "./allegation-complaint-table-header";
import { AllegationComplaintTable } from "./allegation-complaint-table";
import ComplaintType from "../../../../constants/complaint-types";
import { Nav, Navbar } from "react-bootstrap";
import { useCollapse } from 'react-collapsed';
import { AllegationComplaintFilterContainer } from "./allegation-complaint-filter-container";
import Option from "../../../../types/app/option";
import filterIcon from "../../../../../assets/images/filter-icon.png";
import { useAppSelector } from "../../../../hooks/hooks";
import { allegationComplaints } from "../../../../store/reducers/allegation-complaint"

type Props = {
    handleChange: Function,
    handleSort: Function,
    sort: string[],
    regionCodeFilter: Option | null,
    setRegionCodeFilter: Function,
    zoneCodeFilter: Option | null,
    setZoneCodeFilter: Function,
    areaCodeFilter: Option | null,
    setAreaCodeFilter: Function,
    officerFilter: Option | null,
    setOfficerFilter: Function,
    violationFilter: Option | null,
    setViolationFilter: Function,
    startDateFilter: Date | undefined,
    setStartDateFilter: Function,
    endDateFilter: Date | undefined,
    setEndDateFilter: Function,
    complaintStatusFilter: Option | null,
    setComplaintStatusFilter: Function,
}
export const AllegationComplaintTabContainer: FC<Props>  = ({  handleChange, handleSort, sort, regionCodeFilter, setRegionCodeFilter, zoneCodeFilter, setZoneCodeFilter, areaCodeFilter, setAreaCodeFilter, officerFilter, setOfficerFilter, violationFilter, setViolationFilter,
    startDateFilter, setStartDateFilter, endDateFilter, setEndDateFilter, complaintStatusFilter, setComplaintStatusFilter}) => {
        const { getCollapseProps, getToggleProps, isExpanded } = useCollapse();
        const allegationComplaintsArray = useAppSelector(allegationComplaints);
    return <>
    <Navbar className="basic-navbar-nav complaint-tab-container-width">
        <Nav className="nav nav-tabs comp-tab container-fluid">
            <Nav.Item className="nav-item comp-tab-inactive">
                <button className="nav-link" id="hwcr-tab" onClick={() => handleChange(ComplaintType.HWCR_COMPLAINT)}>Human Wildlife Conflicts</button>
            </Nav.Item>
            <Nav.Item className="nav-item comp-tab-active">
                <button className="nav-link active" id="ers-tab">Enforcement ({allegationComplaintsArray.length})</button>
            </Nav.Item>
            <Nav.Item className="ms-auto" {...getToggleProps()}>
                <div className="complaint-filter-image-container" id="complaint-filter-image-id">
                    <img src={filterIcon} alt="filter" className="filter-image-spacing"/>
                </div>
                <div className="left-float">
                    Filters
                </div>
                <div className="clear-left-float"></div>
            </Nav.Item>
        </Nav>
    </Navbar>
    <AllegationComplaintFilterContainer getCollapseProps={getCollapseProps} isExpanded={isExpanded} regionCodeFilter={regionCodeFilter} setRegionCodeFilter={setRegionCodeFilter} zoneCodeFilter={zoneCodeFilter} setZoneCodeFilter={setZoneCodeFilter} areaCodeFilter={areaCodeFilter} setAreaCodeFilter={setAreaCodeFilter} officerFilter={officerFilter} setOfficerFilter={setOfficerFilter}  violationFilter={violationFilter} setViolationFilter={setViolationFilter} 
        startDateFilter={startDateFilter} endDateFilter={endDateFilter} setStartDateFilter={setStartDateFilter} setEndDateFilter={setEndDateFilter} complaintStatusFilter={complaintStatusFilter} setComplaintStatusFilter={setComplaintStatusFilter} />
    <AllegationComplaintTableHeader handleSort={handleSort}/>
    <AllegationComplaintTable sortColumn={sort[0]} sortOrder={sort[1]} regionCodeFilter={regionCodeFilter} zoneCodeFilter={zoneCodeFilter} areaCodeFilter={areaCodeFilter} officerFilter={officerFilter} violationFilter={violationFilter} startDateFilter={startDateFilter} 
        endDateFilter={endDateFilter} complaintStatusFilter={complaintStatusFilter} />
    </>;
}