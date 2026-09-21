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
        'UNSL',
        'Unsolved',
        'Unsolved',
        20,
        true,
        'FLYWAY',
        now ()
    );

UPDATE investigation.enforcement_action
SET
    enforcement_action_code = 'UNSL',
    update_user_id = 'FLYWAY',
    update_utc_timestamp = now ()
WHERE
    enforcement_action_code = 'UNRS';

UPDATE investigation.enforcement_action_code_agency_xref
SET
    active_ind = false,
    update_user_id = 'FLYWAY',
    update_utc_timestamp = now ()
WHERE
    enforcement_action_code = 'UNRS';

UPDATE investigation.enforcement_action_code
SET
    active_ind = false,
    update_user_id = 'FLYWAY',
    update_utc_timestamp = now ()
WHERE
    enforcement_action_code = 'UNRS';

COMMENT ON COLUMN investigation.enforcement_action.comment IS 'Comment for enforcement decision with "Unfounded" or "Unsolved" action codes.';

COMMENT ON COLUMN investigation.enforcement_action.issuing_officer_guid_ref IS 'Cross schema foreign key (unenforced) to shared.app_user. Unique identifier for the application user that issued the enforcement action. Defaults to the primary investigator of the investigation. Not applicable to Unfounded/Unsolved decisions.';

COMMENT ON COLUMN investigation.enforcement_action.date_served IS 'The date the enforcement action was served. Defaults to the current date. Not applicable to Unfounded/Unsolved decisions.';
