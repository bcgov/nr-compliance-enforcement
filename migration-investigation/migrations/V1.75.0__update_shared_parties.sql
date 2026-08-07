-- Add unenforced FK reference columns linking investigation-local party sub-records
-- to their corresponding shared party sub-records. A null value indicates the
-- local record was added within the investigation and has no shared counterpart.

ALTER TABLE investigation_address ADD COLUMN address_guid_ref UUID;

COMMENT ON COLUMN investigation_address.address_guid_ref IS
    'References shared.address.address_guid. Null indicates the address was added locally within the investigation and has no shared party counterpart.';

ALTER TABLE investigation_contact_method ADD COLUMN contact_method_guid_ref UUID;

COMMENT ON COLUMN investigation.investigation_contact_method.contact_method_guid_ref IS
    'References shared.contact_method.contact_method_guid. Null indicates the contact method was added locally within the investigation and has no shared party counterpart.';

ALTER TABLE investigation_alias ADD COLUMN alias_guid_ref UUID;

COMMENT ON COLUMN investigation.investigation_alias.alias_guid_ref IS
    'References shared.alias.alias_guid. Null indicates the alias was added locally within the investigation and has no shared party counterpart.';

ALTER TABLE investigation_business_identifier ADD COLUMN business_identifier_guid_ref UUID;

COMMENT ON COLUMN investigation.investigation_business_identifier.business_identifier_guid_ref IS
    'References shared.business_identifier.business_identifier_guid. Null indicates the business identifier was added locally within the investigation and has no shared party counterpart.';

ALTER TABLE investigation_business_person_xref ADD COLUMN business_person_xref_guid_ref UUID;

COMMENT ON COLUMN investigation.investigation_business_person_xref.business_person_xref_guid_ref IS
    'References shared.business_person_xref.business_person_xref_guid. Null indicates the business contact was added locally within the investigation and has no shared party counterpart.';