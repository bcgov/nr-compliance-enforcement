-- 
-- CREATE TABLE linked_complaint_xref
-- 
CREATE TABLE
  linked_complaint_xref (
    linked_complaint_xref_guid uuid NOT NULL DEFAULT uuid_generate_v4 (),
    complaint_identifier VARCHAR(20) NOT NULL,
    linked_complaint_identifier VARCHAR(20) NOT NULL,
    active_ind bool NOT NULL,
    create_user_id VARCHAR(32) NOT NULL,
    create_utc_timestamp timestamp NOT NULL,
    update_user_id VARCHAR(32),
    update_utc_timestamp timestamp,
    CONSTRAINT "PK_lnkcmplxref" PRIMARY KEY (linked_complaint_xref_guid),
    CONSTRAINT "FK_lnkcmplxref_complaint" FOREIGN KEY (complaint_identifier) REFERENCES complaint (complaint_identifier),
    CONSTRAINT "FK_lnkcmplxref_linked_complaint" FOREIGN KEY (linked_complaint_identifier) REFERENCES complaint (complaint_identifier),
    CONSTRAINT "NE_lnkcmplxref_no_self_link" CHECK (
      complaint_identifier <> linked_complaint_identifier
    ) -- No linking a complaint to itself
  );

comment on table linked_complaint_xref is 'Provides the ability to link one COMPLAINT to another COMPLAINT.   The initial use case for this table is to identify duplicate complaints, however additional linkages maybe possible in the future.';

comment on column linked_complaint_xref.linked_complaint_xref_guid is 'A human readable code used to identify a complaint linkage.';

comment on column linked_complaint_xref.complaint_identifier is 'One half of a linked complaint pair.  If the type requires a context of hierarchy, the complaint that is higher in the hierarchy.  For example, in the case of duplicate complaints, this would be the complaint that would remain open and where the majority of the information should be contained.';

comment on column linked_complaint_xref.linked_complaint_identifier is 'One half of a linked complaint pair.  If the type requires a context of hierarchy, the complaint that is lower in the hierarchy.  For example, in the case of duplicate complaints, this would be the complaint that would be closed as a duplicate of the parent.';

comment on column linked_complaint_xref.active_ind is 'Flag indicating if the linkage is active.';

comment on column linked_complaint_xref.create_user_id is 'The id of the user that created the complaint linkage.';

comment on column linked_complaint_xref.create_utc_timestamp is 'The timestamp when the complaint linkage was created.  The timestamp is stored in UTC with no Offset.';

comment on column linked_complaint_xref.update_user_id is 'The id of the user that updated the complaint linkage.';

comment on column linked_complaint_xref.update_utc_timestamp is 'The timestamp when the complaint linkage was updated.  The timestamp is stored in UTC with no Offset.';

-- Create unique index to ensure that a complaint can only be marked as a duplicate of one complaint
create unique index on linked_complaint_xref (linked_complaint_identifier, active_ind)
where
  active_ind = true;