ALTER TABLE investigation.enforcement_action
ADD COLUMN comment text;

COMMENT ON COLUMN investigation.enforcement_action.comment IS 'Comment for enforcement decision with "Unfounded" or "Unresolved" action codes.';

UPDATE investigation.enforcement_action_code
SET
    short_description = 'Violation Ticket',
    long_description = 'Violation Ticket',
    display_order = 80,
    update_user_id = 'FLYWAY',
    update_utc_timestamp = now ()
WHERE
    enforcement_action_code = 'FDVT';

UPDATE investigation.enforcement_action_code
SET
    display_order = 90,
    update_user_id = 'FLYWAY',
    update_utc_timestamp = now ()
WHERE
    enforcement_action_code = 'WARN';

UPDATE investigation.enforcement_action_code_agency_xref
SET
    active_ind = false,
    update_user_id = 'FLYWAY',
    update_utc_timestamp = now ()
WHERE
    enforcement_action_code IN ('LIAC', 'NOAC', 'PRVT');

UPDATE investigation.enforcement_action_code
SET
    active_ind = false,
    update_user_id = 'FLYWAY',
    update_utc_timestamp = now ()
WHERE
    enforcement_action_code IN ('LIAC', 'NOAC', 'PRVT');

INSERT INTO
    investigation.enforcement_action_code (
        enforcement_action_code,
        short_description,
        long_description,
        display_order,
        active_ind,
        create_user_id,
        create_utc_timestamp
    )
VALUES
    (
        'UNFD',
        'Unfounded',
        'Unfounded',
        10,
        true,
        'FLYWAY',
        now ()
    ),
    (
        'UNRS',
        'Unresolved',
        'Unresolved',
        20,
        true,
        'FLYWAY',
        now ()
    ),
    (
        'ADPN',
        'Administrative Penalty',
        'Administrative Penalty',
        30,
        true,
        'FLYWAY',
        now ()
    ),
    (
        'ADSN',
        'Administrative Sanction',
        'Administrative Sanction',
        40,
        true,
        'FLYWAY',
        now ()
    ),
    (
        'CTPR',
        'Court Prosecution',
        'Court Prosecution',
        50,
        true,
        'FLYWAY',
        now ()
    ),
    (
        'ORDR',
        'Order',
        'Order',
        60,
        true,
        'FLYWAY',
        now ()
    ),
    (
        'RJUS',
        'Restorative Justice',
        'Restorative Justice',
        70,
        true,
        'FLYWAY',
        now ()
    );

CREATE UNIQUE INDEX uq_contravention_party_xref_unknown_party ON investigation.contravention_party_xref (contravention_guid)
WHERE
    investigation_party_guid IS NULL
    AND active_ind;