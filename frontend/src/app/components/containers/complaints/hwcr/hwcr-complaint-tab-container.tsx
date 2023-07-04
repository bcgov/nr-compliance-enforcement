import { FC } from "react";
import { HwcrComplaintTableHeader } from "./hwcr-complaint-table-header";
import { HwcrComplaintTable } from "./hwcr-complaint-table";
import ComplaintType from "../../../../constants/complaint-types";
import { HwcrComplaintFilterContainer } from "./hwcr-complaint-filter-container";
import { useCollapse } from 'react-collapsed';
import { Nav, Navbar } from "react-bootstrap";
import Option from "../../../../types/app/option";
import filterIcon from "../../../../../assets/images/filter-icon.png";

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
    natureOfComplaintFilter: Option | null,
    setNatureOfComplaintFilter: Function,
    speciesCodeFilter: Option | null,
    setSpeicesCodeFilter: Function,
    startDateFilter: Date | undefined,
    setStartDateFilter: Function,
    endDateFilter: Date | undefined,
    setEndDateFilter: Function,
    complaintStatusFilter: Option | null,
    setComplaintStatusFilter: Function,
    numberOfComplaints: number,
    setNumberOfComplaints: Function,
}

export const HwcrComplaintTabContainer: FC<Props>  = ({ handleChange, handleSort, sort, regionCodeFilter, setRegionCodeFilter, zoneCodeFilter, setZoneCodeFilter, areaCodeFilter, setAreaCodeFilter, officerFilter, setOfficerFilter, natureOfComplaintFilter, setNatureOfComplaintFilter, speciesCodeFilter, setSpeicesCodeFilter,
     startDateFilter, setStartDateFilter, endDateFilter, setEndDateFilter, complaintStatusFilter, setComplaintStatusFilter,  numberOfComplaints, setNumberOfComplaints}) => {
    const { getCollapseProps, getToggleProps, isExpanded } = useCollapse();
    return <>
    <Navbar className="basic-navbar-nav complaint-tab-container-width">
        <Nav className="nav nav-tabs comp-tab container-fluid">
            <Nav.Item className="nav-item comp-tab-active">
                <button className="nav-link active">Human Wildlife Conflicts ({numberOfComplaints})</button>
            </Nav.Item>
            <Nav.Item className="nav-item comp-tab-inactive">
                <button className="nav-link" onClick={() => handleChange(ComplaintType.ALLEGATION_COMPLAINT)}>Enforcement</button>
            </Nav.Item>
            <Nav.Item className="ms-auto" {...getToggleProps()}>
                <div className="complaint-filter-image-container">
                    <img src={filterIcon} alt="filter" className="filter-image-spacing"/>
                </div>
                <div className="left-float">
                    Filters
                </div>
                <div className="clear-left-float"></div>
            </Nav.Item>
        </Nav>
    </Navbar>
    <HwcrComplaintFilterContainer getCollapseProps={getCollapseProps} isExpanded={isExpanded} regionCodeFilter={regionCodeFilter} setRegionCodeFilter={setRegionCodeFilter} zoneCodeFilter={zoneCodeFilter} setZoneCodeFilter={setZoneCodeFilter} areaCodeFilter={areaCodeFilter} setAreaCodeFilter={setAreaCodeFilter} officerFilter={officerFilter} setOfficerFilter={setOfficerFilter} natureOfComplaintFilter={natureOfComplaintFilter} setNatureOfComplaintFilter={setNatureOfComplaintFilter} speciesCodeFilter={speciesCodeFilter}
        setSpeciesCodeFilter={setSpeicesCodeFilter} startDateFilter={startDateFilter} endDateFilter={endDateFilter} setStartDateFilter={setStartDateFilter} setEndDateFilter={setEndDateFilter} complaintStatusFilter={complaintStatusFilter} setComplaintStatusFilter={setComplaintStatusFilter} />
    <HwcrComplaintTableHeader handleSort={handleSort}/>
    <HwcrComplaintTable sortColumn={sort[0]} sortOrder={sort[1]} regionCodeFilter={regionCodeFilter} zoneCodeFilter={zoneCodeFilter} areaCodeFilter={areaCodeFilter} officerFilter={officerFilter} natureOfComplaintFilter={natureOfComplaintFilter} speciesCodeFilter={speciesCodeFilter} startDateFilter={startDateFilter} 
        endDateFilter={endDateFilter} complaintStatusFilter={complaintStatusFilter} setNumberOfComplaints={setNumberOfComplaints} />
    </>;
}
