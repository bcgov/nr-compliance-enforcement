ALTER TABLE linked_complaint_xref
ADD COLUMN linkage_type VARCHAR(20) NOT NULL DEFAULT 'DUPLICATE';

ALTER TABLE linked_complaint_xref
ADD COLUMN person_guid uuid;

ALTER TABLE linked_complaint_xref ADD CONSTRAINT "FK_lnkcmplxref_person_guid" FOREIGN KEY (person_guid) REFERENCES person (person_guid);

CREATE TABLE
  linked_complaint_xref_code (
    linked_complaint_xref_code VARCHAR(20) NOT NULL,
    short_description VARCHAR(50) NOT NULL,
    long_description VARCHAR(250) NULL,
    display_order INT4 NOT NULL,
    active_ind BOOL NOT NULL DEFAULT TRUE,
    create_user_id VARCHAR(32) NOT NULL,
    create_user_guid uuid NULL,
    create_timestamp timestamp NOT NULL,
    update_user_id VARCHAR(32) NOT NULL,
    update_user_guid uuid NULL,
    update_timestamp timestamp NOT NULL,
    CONSTRAINT "PK_linked_complaint_xref_code" PRIMARY KEY (linked_complaint_xref_code)
  );

INSERT INTO
  linked_complaint_xref_code (
    linked_complaint_xref_code,
    short_description,
    long_description,
    display_order,
    active_ind,
    create_user_id,
    create_timestamp,
    update_user_id,
    update_timestamp
  )
VALUES
  (
    'DUPLICATE',
    'Duplicate',
    'Complaint is a duplicate of another complaint',
    1,
    true,
    user,
    now (),
    user,
    now ()
  ),
  (
    'LINK',
    'Linked',
    'Complaint is linked to another complaint due to similar incident or action',
    2,
    true,
    user,
    now (),
    user,
    now ()
  );

ALTER TABLE linked_complaint_xref ADD CONSTRAINT "FK_lnkcmplxref_linkage_type" FOREIGN KEY (linkage_type) REFERENCES linked_complaint_xref_code (linked_complaint_xref_code);

UPDATE linked_complaint_xref
SET
  linkage_type = 'DUPLICATE'
WHERE
  linkage_type IS NULL;

COMMENT ON COLUMN linked_complaint_xref.linkage_type IS 'The type of linkage between complaints, DUPLICATE or LINK';

COMMENT ON COLUMN linked_complaint_xref.person_guid IS 'The person who created the linkage between complaints';

COMMENT ON TABLE linked_complaint_xref_code IS 'Code table for different types of complaint linkages';

COMMENT ON COLUMN linked_complaint_xref_code.linked_complaint_xref_code IS 'A human readable code used to identify a linkage type between complaints';

COMMENT ON COLUMN linked_complaint_xref_code.short_description IS 'The short description of the linkage type';

COMMENT ON COLUMN linked_complaint_xref_code.long_description IS 'The long description of the linkage type';

COMMENT ON COLUMN linked_complaint_xref_code.display_order IS 'The order in which the values should be displayed when presented to a user in a list';

COMMENT ON COLUMN linked_complaint_xref_code.active_ind IS 'Flag indicating if the linkage type is active';