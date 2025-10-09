-- Update email reference table for GUID parity across environments
-- this is required as this table acts like a code table, but the PK is a GUID

UPDATE email_reference set email_reference_guid = '359fd776-dcbd-47e4-a9ec-dd29a19617c9' where agency_code_ref = 'EPO' and geo_organization_unit_code IS NULL;
UPDATE email_reference set email_reference_guid = '6ae106cb-dbf1-40c8-8a8c-242943396246' where agency_code_ref = 'COS' and geo_organization_unit_code = 'BLKYCSR';
UPDATE email_reference set email_reference_guid = 'b249ea08-8901-4129-88ab-0be294ed0500' where agency_code_ref = 'COS' and geo_organization_unit_code = 'CRBOCHLCTN';
UPDATE email_reference set email_reference_guid = 'a89e804d-9b0f-4ce2-89f3-282103ff562f' where agency_code_ref = 'COS' and geo_organization_unit_code = 'CRBOTMPSN';
UPDATE email_reference set email_reference_guid = '3e58a1f1-cb95-4506-9a9b-5a34e28792e1' where agency_code_ref = 'COS' and geo_organization_unit_code = 'CENISL';
UPDATE email_reference set email_reference_guid = '40110158-248c-42b5-87a7-54bdf48b1b4e' where agency_code_ref = 'COS' and geo_organization_unit_code = 'CENOKNGN';
UPDATE email_reference set email_reference_guid = 'b9d1e096-a4dc-4eef-99ca-9bd9ea9087a6' where agency_code_ref = 'COS' and geo_organization_unit_code = 'FRSRN';
UPDATE email_reference set email_reference_guid = 'bac0b7b6-d8dd-4bd8-a109-3ea8abde662f' where agency_code_ref = 'COS' and geo_organization_unit_code = 'FRSRS';
UPDATE email_reference set email_reference_guid = '9fc164e1-e773-48ee-b845-f1815b19bed2' where agency_code_ref = 'COS' and geo_organization_unit_code = 'NCHKOLKS';
UPDATE email_reference set email_reference_guid = '4fd7ca92-753f-4349-9631-b914dc1d1345' where agency_code_ref = 'COS' and geo_organization_unit_code = 'NCST';
UPDATE email_reference set email_reference_guid = '823a3d3b-88ea-4a8a-9c64-e41a5fc28300' where agency_code_ref = 'COS' and geo_organization_unit_code = 'NISL';
UPDATE email_reference set email_reference_guid = '9b9ff714-c4dc-4768-add1-2336d57494c6' where agency_code_ref = 'COS' and geo_organization_unit_code = 'NOKNGN';
UPDATE email_reference set email_reference_guid = 'b4bba5eb-91ee-4bc9-936c-800baa3c30db' where agency_code_ref = 'COS' and geo_organization_unit_code = 'NPCE';
UPDATE email_reference set email_reference_guid = '629a3b7a-b896-4408-89ab-7d5616a955e6' where agency_code_ref = 'COS' and geo_organization_unit_code = 'OMNCA';
UPDATE email_reference set email_reference_guid = 'a1adc03b-6ba3-4074-8713-868631b2bf46' where agency_code_ref = 'COS' and geo_organization_unit_code = 'SEA2SKY';
UPDATE email_reference set email_reference_guid = 'cd502141-4c87-4e46-83e0-c1beb1c310bb' where agency_code_ref = 'COS' and geo_organization_unit_code = 'SISL';
UPDATE email_reference set email_reference_guid = '4facc07d-fd03-4976-b1b0-23ce8e231789' where agency_code_ref = 'COS' and geo_organization_unit_code = 'SOKNGN';
UPDATE email_reference set email_reference_guid = '083b3ce3-8e73-41c7-8e01-760b27642b45' where agency_code_ref = 'COS' and geo_organization_unit_code = 'SPCE';
UPDATE email_reference set email_reference_guid = '3ec1df5e-5f83-4849-b426-4fb7ec21b48e' where agency_code_ref = 'COS' and geo_organization_unit_code = 'SNSHNCST';
UPDATE email_reference set email_reference_guid = '23eaf999-0ffe-42bf-8deb-1ae7759b58f1' where agency_code_ref = 'COS' and geo_organization_unit_code = 'TMPSNNCLA';
UPDATE email_reference set email_reference_guid = '097d60fb-6603-4d4a-b15d-5a0071bbcc11' where agency_code_ref = 'COS' and geo_organization_unit_code = 'CLMBAKTNY';
UPDATE email_reference set email_reference_guid = '85e18e06-baaf-4f36-82f1-001d785c2f94' where agency_code_ref = 'COS' and geo_organization_unit_code = 'EKTNY';
UPDATE email_reference set email_reference_guid = '3c6ad456-b4eb-4b7c-b0e7-e411a9f7e71b' where agency_code_ref = 'COS' and geo_organization_unit_code = 'WKTNY';
UPDATE email_reference set email_reference_guid = '6bfe170b-7a0e-4a72-b726-586411fa4b37' where agency_code_ref = 'PARKS' and geo_organization_unit_code IS NULL;
