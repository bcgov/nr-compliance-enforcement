ALTER TABLE complaint_outcome.prevention_education
ADD COLUMN wacn_amount SMALLINT;

COMMENT ON COLUMN complaint_outcome.prevention_education.wacn_amount IS 'The amount of Wildlife Attractant Compliance Notices are issued.';

INSERT INTO
    complaint_outcome.action_code
VALUES
    (
        'ISSUEWACN',
        'Issued Wildlife Attractant Compliance Notice',
        'Issued Wildlife Attractant Compliance Notice',
        true,
        'postgres',
        '2026-08-20 20:06:56.125214',
        'postgres',
        '2026-08-20 20:06:56.125214'
    );

INSERT INTO
    complaint_outcome.action_type_action_xref (
        action_type_code,
        action_code,
        display_order,
        active_ind,
        create_user_id,
        create_utc_timestamp,
        update_user_id,
        update_utc_timestamp
    )
VALUES
    (
        'PRKPRV&EDU',
        'ISSUEWACN',
        70,
        true,
        'postgres',
        '2026-08-20 20:06:56.183043',
        NULL,
        NULL
    );