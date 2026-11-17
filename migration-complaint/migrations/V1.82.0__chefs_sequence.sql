-- Sequence for complaint identifiers generated for CHEFS complaints (yy-8xxxxx).
-- Reset to 800000 each year by SequenceResetScheduler. MAXVALUE stops it running into another range.
CREATE SEQUENCE IF NOT EXISTS complaint.chefs_complaint_sequence
    START WITH 800000
    INCREMENT BY 1
    MINVALUE 800000
    MAXVALUE 899999
    NO CYCLE
    CACHE 1;