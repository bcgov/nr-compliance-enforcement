ALTER TABLE ticket ADD COLUMN notice_of_cancellation_number VARCHAR(32);

COMMENT ON COLUMN ticket.notice_of_cancellation_number IS 'A notice of cancellation is issued at the same time that an officer issues a violation ticket against the wildlife or firearms act, notifying the party of interest that there will be action taken against their license if they do not pay the associated violation ticket.';
