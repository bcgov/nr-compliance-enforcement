--
-- alter complaint table - add reference number
--

alter table complaint add reference_number VARCHAR(20);

comment on column complaint.reference_number is 'Allows users to link complaints to files in external systems.   Currently labeled in the system as COORS reference number and initially only used for COORS linkages.';
