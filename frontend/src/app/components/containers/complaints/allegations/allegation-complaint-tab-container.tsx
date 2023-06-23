import { FC } from "react";
import { AllegationComplaintTableHeader } from "./allegation-complaint-table-header";
import { AllegationComplaintTable } from "./allegation-complaint-table";
import ComplaintType from "../../../../constants/complaint-types";
import { Nav, Navbar } from "react-bootstrap";
import { useCollapse } from 'react-collapsed';
import { AllegationComplaintFilterContainer } from "./allegation-complaint-filter-container";
import Option from "../../../../types/app/option";

type Props = {
    handleChange: Function,
    handleSort: Function,
    sort: string[],
    violationFilter: Option | null,
    setViolationFilter: Function,
    startDateFilter: Date | undefined,
    setStartDateFilter: Function,
    endDateFilter: Date | undefined,
    setEndDateFilter: Function,
    complaintStatusFilter: Option | null,
    setComplaintStatusFilter: Function,
}

export const AllegationComplaintTabContainer: FC<Props>  = ({  handleChange, handleSort, sort, violationFilter, setViolationFilter,
    startDateFilter, setStartDateFilter, endDateFilter, setEndDateFilter, complaintStatusFilter, setComplaintStatusFilter }) => {
        const { getCollapseProps, getToggleProps, isExpanded } = useCollapse();
    return <>
    <Navbar className="comp-div-tab basic-navbar-nav" style={{width: "1330px"}}>
        <Nav className="nav nav-tabs comp-tab container-fluid">
            <Nav.Item className="nav-item comp-tab-inactive">
                <button className="nav-link" onClick={() => handleChange(ComplaintType.HWCR_COMPLAINT)}>Human Wildlife Conflicts</button>
            </Nav.Item>
            <Nav.Item className="nav-item comp-tab-active">
                <button className="nav-link active">Enforcement</button>
            </Nav.Item>
            <Nav.Item className="ms-auto" {...getToggleProps()}>
                Filters
            </Nav.Item>
        </Nav>
    </Navbar>
    <AllegationComplaintFilterContainer getCollapseProps={getCollapseProps} isExpanded={isExpanded} violationFilter={violationFilter} setViolationFilter={setViolationFilter} 
        startDateFilter={startDateFilter} endDateFilter={endDateFilter} setStartDateFilter={setStartDateFilter} setEndDateFilter={setEndDateFilter} complaintStatusFilter={complaintStatusFilter} setComplaintStatusFilter={setComplaintStatusFilter} />
    <AllegationComplaintTableHeader handleSort={handleSort}/>
    <AllegationComplaintTable sortColumn={sort[0]} sortOrder={sort[1]} violationFilter={violationFilter} startDateFilter={startDateFilter} 
        endDateFilter={endDateFilter} complaintStatusFilter={complaintStatusFilter} />
    </>;
}