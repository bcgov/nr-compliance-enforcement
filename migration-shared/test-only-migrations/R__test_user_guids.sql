-- Hard code app_user_guid for test user so it can be reliably used in other test data.
-- Shared runs before the complaint copy to shared.app_user, which then skips this user on auth_user_guid
INSERT INTO
  app_user (
    app_user_guid,
    auth_user_guid,
    user_id,
    first_name,
    last_name,
    coms_enrolled_ind,
    deactivate_ind,
    agency_code_ref,
    office_guid,
    create_user_id,
    create_utc_timestamp,
    update_user_id,
    update_utc_timestamp
  )
VALUES
  (
    '63f8bda9-7cdc-42d5-a405-81f6bdb554f6'::uuid,
    '0cf857a2-28a3-4867-af0f-d59449243057'::uuid,
    'ENCETST1',
    'ENV',
    'TestAcct',
    true,
    false,
    'COS',
    '79fe321b-7716-413f-b878-c5fd6100317d'::uuid,
    'nr-compliance-enforcement',
    now (),
    'nr-compliance-enforcement',
    now ()
  ) ON CONFLICT DO NOTHING;
