-- Add additional legislation type codes for BC Laws schemas (Act, Regulation, Bylaw)
-- Reference: http://www.bclaws.ca/standards/act.xsd
-- Reference: http://www.bclaws.ca/standards/regulation.xsd
-- Reference: http://www.bclaws.ca/standards/bylaw.xsd
INSERT INTO
  legislation_type_code (
    legislation_type_code,
    short_description,
    long_description,
    display_order,
    active_ind,
    create_user_id,
    create_utc_timestamp
  )
VALUES
  (
    'PART',
    'Part',
    'A major division of an Act or Regulation, typically numbered Part 1, Part 2, etc.',
    25,
    TRUE,
    'FLYWAY',
    NOW ()
  ),
  (
    'DEF',
    'Definition',
    'A defined term within an Act or Regulation, typically found in a definitions section.',
    35,
    TRUE,
    'FLYWAY',
    NOW ()
  ),
  (
    'BYLAW',
    'Bylaw',
    'A municipal bylaw or local government regulation.',
    15,
    TRUE,
    'FLYWAY',
    NOW ()
  ),
  (
    'DIV',
    'Division',
    'A division within a Part or directly under an Act/Regulation.',
    27,
    TRUE,
    'FLYWAY',
    NOW ()
  ),
  (
    'SCHED',
    'Schedule',
    'A schedule or appendix attached to an Act, Regulation, or Bylaw.',
    40,
    TRUE,
    'FLYWAY',
    NOW ()
  ),
  (
    'CL',
    'Clause',
    'A clause within a paragraph or subparagraph, typically lettered (A), (B), etc.',
    36,
    TRUE,
    'FLYWAY',
    NOW ()
  ),
  (
    'SUBCL',
    'Subclause',
    'A subclause within a clause, the lowest level of legislative text hierarchy.',
    37,
    TRUE,
    'FLYWAY',
    NOW ()
  ),
  (
    'TEXT',
    'Text Segment',
    'Text segment that appears between other child elements',
    17,
    true,
    'SYSTEM',
    NOW ()
  ),
  (
    'RULE',
    'Rule',
    'A rule within a Regulation, typically used in procedural or court rules.',
    28,
    TRUE,
    'FLYWAY',
    NOW ()
  ) ON CONFLICT (legislation_type_code) DO NOTHING;