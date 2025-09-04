ALTER TABLE linked_complaint_xref
ADD COLUMN link_type VARCHAR(20) NOT NULL DEFAULT 'DUPLICATE';

ALTER TABLE linked_complaint_xref
ADD COLUMN person_guid uuid;

ALTER TABLE linked_complaint_xref ADD CONSTRAINT "FK_lnkcmplxref_person_guid" FOREIGN KEY (person_guid) REFERENCES person (person_guid);

CREATE TABLE
  linked_complaint_xref_type_code (
    linked_complaint_xref_type_code VARCHAR(20) NOT NULL,
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
    CONSTRAINT "PK_linked_complaint_xref_type_code" PRIMARY KEY (linked_complaint_xref_type_code)
  );

INSERT INTO
  linked_complaint_xref_type_code (
    linked_complaint_xref_type_code,
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

ALTER TABLE linked_complaint_xref ADD CONSTRAINT "FK_lnkcmplxref_link_type" FOREIGN KEY (link_type) REFERENCES linked_complaint_xref_type_code (linked_complaint_xref_type_code);

UPDATE linked_complaint_xref
SET
  link_type = 'DUPLICATE'
WHERE
  link_type IS NULL;

COMMENT ON COLUMN linked_complaint_xref.link_type IS 'The type of link between complaints, DUPLICATE or LINK';

COMMENT ON COLUMN linked_complaint_xref.person_guid IS 'The person who created the link between complaints';

COMMENT ON TABLE linked_complaint_xref_type_code IS 'Code table for different types of complaint link types';

COMMENT ON COLUMN linked_complaint_xref_type_code.linked_complaint_xref_type_code IS 'A human readable code used to identify a link type between complaints';

COMMENT ON COLUMN linked_complaint_xref_type_code.short_description IS 'The short description of the link type';

COMMENT ON COLUMN linked_complaint_xref_type_code.long_description IS 'The long description of the link type';

COMMENT ON COLUMN linked_complaint_xref_type_code.display_order IS 'The order in which the values should be displayed when presented to a user in a list';

COMMENT ON COLUMN linked_complaint_xref_type_code.active_ind IS 'Flag indicating if the link type is active';