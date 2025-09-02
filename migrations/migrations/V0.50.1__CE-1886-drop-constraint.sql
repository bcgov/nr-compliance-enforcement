DROP INDEX IF EXISTS linked_complaint_xref_linked_complaint_identifier_active_in_idx;

create index on linked_complaint_xref (linked_complaint_identifier, active_ind)
where
  active_ind = true;