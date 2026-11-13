ALTER TABLE ticket RENAME COLUMN ticket_amount TO fine_amount;

COMMENT ON COLUMN ticket.fine_amount IS 'The fine amount of the violation ticket.';

ALTER TABLE ticket ADD COLUMN paid_amount NUMERIC(10,2);

COMMENT ON COLUMN ticket.paid_amount IS 'The amount paid against the violation ticket, if any.';
