-- Delete existing contravention data as a part of adding legislation versioning

DELETE FROM investigation.ticket;
DELETE FROM investigation.enforcement_action;
DELETE FROM investigation.contravention_party_xref;
DELETE FROM investigation.contravention;
