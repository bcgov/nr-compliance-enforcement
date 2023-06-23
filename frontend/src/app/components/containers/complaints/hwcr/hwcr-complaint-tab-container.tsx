import { FC } from "react";
import { HwcrComplaintTableHeader } from "./hwcr-complaint-table-header";
import { HwcrComplaintTable } from "./hwcr-complaint-table";
import ComplaintType from "../../../../constants/complaint-types";
import { HwcrComplaintFilterContainer } from "./hwcr-complaint-filter-container";
import { useCollapse } from 'react-collapsed';
import { Nav, Navbar } from "react-bootstrap";
import Option from "../../../../types/app/option";

type Props = {
    handleChange: Function,
    handleSort: Function,
    sort: string[],
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
}

export const HwcrComplaintTabContainer: FC<Props>  = ({ handleChange, handleSort, sort, natureOfComplaintFilter, setNatureOfComplaintFilter, speciesCodeFilter, setSpeicesCodeFilter,
     startDateFilter, setStartDateFilter, endDateFilter, setEndDateFilter, complaintStatusFilter, setComplaintStatusFilter }) => {
    const { getCollapseProps, getToggleProps, isExpanded } = useCollapse();
    return <>
    <Navbar className="comp-div-tab basic-navbar-nav" style={{width: "1330px"}}>
        <Nav className="nav nav-tabs comp-tab container-fluid">
            <Nav.Item className="nav-item comp-tab-active">
                <button className="nav-link active">Human Wildlife Conflicts</button>
            </Nav.Item>
            <Nav.Item className="nav-item comp-tab-inactive">
                <button className="nav-link" onClick={() => handleChange(ComplaintType.ALLEGATION_COMPLAINT)}>Enforcement</button>
            </Nav.Item>
            <Nav.Item className="ms-auto" {...getToggleProps()}>
                Filters
            </Nav.Item>
        </Nav>
    </Navbar>
    <HwcrComplaintFilterContainer getCollapseProps={getCollapseProps} isExpanded={isExpanded} natureOfComplaintFilter={natureOfComplaintFilter} setNatureOfComplaintFilter={setNatureOfComplaintFilter} speciesCodeFilter={speciesCodeFilter}
        setSpeciesCodeFilter={setSpeicesCodeFilter} startDateFilter={startDateFilter} endDateFilter={endDateFilter} setStartDateFilter={setStartDateFilter} setEndDateFilter={setEndDateFilter} complaintStatusFilter={complaintStatusFilter} setComplaintStatusFilter={setComplaintStatusFilter} />
    <HwcrComplaintTableHeader handleSort={handleSort}/>
    <HwcrComplaintTable sortColumn={sort[0]} sortOrder={sort[1]} natureOfComplaintFilter={natureOfComplaintFilter} speciesCodeFilter={speciesCodeFilter} startDateFilter={startDateFilter} 
        endDateFilter={endDateFilter} complaintStatusFilter={complaintStatusFilter} />
    </>;
}
