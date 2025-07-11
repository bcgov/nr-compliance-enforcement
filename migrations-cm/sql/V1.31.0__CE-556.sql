--
-- CREATE TABLE drug_additional_comments
--

ALTER TABLE case_management.drug_administered
  ADD additional_comments_text text NULL;

comment on column case_management.drug_administered.additional_comments_text is 'Includes comments on immobilization outcomes, any adverse reactions, and drug storage or discarding.';

--
-- Migrate existing adverse reactions, discard method, amount discarded to Additional comments
--

UPDATE case_management.drug_administered
  SET additional_comments_text = TRIM(
    CONCAT(
      CASE WHEN adverse_reaction_text IS NOT NULL AND adverse_reaction_text <> ''
        THEN 'Adverse reaction: ' || adverse_reaction_text || '; '
        ELSE ''
      END,
      CASE WHEN discard_method_text IS NOT NULL AND discard_method_text <> ''
        THEN 'Discard method: ' || discard_method_text || '; '
        ELSE ''
      END,
      CASE WHEN drug_discarded_amount IS NOT NULL
        THEN 'Amount discarded: ' || drug_discarded_amount::text || '; '
        ELSE ''
      END
    )
  )
  WHERE additional_comments_text IS NULL;


--
-- DROP Adverse reactions, discard method, amount discarded columns.
--

ALTER TABLE case_management.drug_administered DROP COLUMN adverse_reaction_text;
ALTER TABLE case_management.drug_administered DROP COLUMN drug_discarded_amount;
ALTER TABLE case_management.drug_administered DROP COLUMN discard_method_text;
