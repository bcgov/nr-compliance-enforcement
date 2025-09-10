insert into
    case_management.action_type_code (
        action_type_code,
        short_description,
        long_description,
        active_ind,
        create_user_id,
        create_utc_timestamp
    )
values
    (
        'COMPASSESS',
        'Complaint Assessment',
        'Complaint Assessment',
        'Y',
        CURRENT_USER,
        CURRENT_TIMESTAMP
    ),
    (
        'COSPRV&EDU',
        'Prevention and Education',
        'Prevention and Education',
        'Y',
        CURRENT_USER,
        CURRENT_TIMESTAMP
    ) on conflict do nothing;

insert into
    case_management.action_code (
        action_code,
        short_description,
        long_description,
        active_ind,
        create_user_id,
        create_utc_timestamp
    )
values
    (
        'ASSESSRISK',
        'Assessed public safety risk',
        'Assessed public safety risk',
        'Y',
        CURRENT_USER,
        CURRENT_TIMESTAMP
    ),
    (
        'ASSESSHLTH',
        'Assessed health as per animal welfare guidelines',
        'Assessed health as per animal welfare guidelines',
        'Y',
        CURRENT_USER,
        CURRENT_TIMESTAMP
    ),
    (
        'ASSESSHIST',
        'Assessed known conflict history',
        'Assessed known conflict history',
        'Y',
        CURRENT_USER,
        CURRENT_TIMESTAMP
    ),
    (
        'CNFRMIDENT',
        'Confirmed identification of offending animal(s)',
        'Confirmed identification of offending animal(s)',
        'Y',
        CURRENT_USER,
        CURRENT_TIMESTAMP
    ),
    (
        'PROVSFTYIN',
        'Provided safety information to the public',
        'Provided safety information to the public',
        'Y',
        CURRENT_USER,
        CURRENT_TIMESTAMP
    ),
    (
        'PROVAMHSIN',
        'Provided attractant management and husbandry information to the public',
        'Provided attractant management and husbandry information to the public',
        'Y',
        CURRENT_USER,
        CURRENT_TIMESTAMP
    ),
    (
        'CDCTMEDREL',
        'Conducted media release to educate the community',
        'Conducted media release to educate the community',
        'Y',
        CURRENT_USER,
        CURRENT_TIMESTAMP
    ),
    (
        'CNTCTGROUP',
        'Contacted WildSafeBC or local interest group to deliver education to the public',
        'Contacted WildSafeBC or local interest group to deliver education to the public',
        'Y',
        CURRENT_USER,
        CURRENT_TIMESTAMP
    ),
    (
        'CNTCTBYLAW',
        'Contacted bylaw to assist with managing attractants',
        'Contacted bylaw to assist with managing attractants',
        'Y',
        CURRENT_USER,
        CURRENT_TIMESTAMP
    ) on conflict do nothing;

insert into
    case_management.action_type_action_xref (
        action_type_code,
        action_code,
        display_order,
        active_ind,
        create_user_id,
        create_utc_timestamp
    )
values
    (
        'COMPASSESS',
        'ASSESSRISK',
        1,
        'Y',
        CURRENT_USER,
        CURRENT_TIMESTAMP
    ),
    (
        'COMPASSESS',
        'ASSESSHLTH',
        2,
        'Y',
        CURRENT_USER,
        CURRENT_TIMESTAMP
    ),
    (
        'COMPASSESS',
        'ASSESSHIST',
        3,
        'Y',
        CURRENT_USER,
        CURRENT_TIMESTAMP
    ),
    (
        'COMPASSESS',
        'CNFRMIDENT',
        4,
        'Y',
        CURRENT_USER,
        CURRENT_TIMESTAMP
    ),
    (
        'COSPRV&EDU',
        'PROVSFTYIN',
        1,
        'Y',
        CURRENT_USER,
        CURRENT_TIMESTAMP
    ),
    (
        'COSPRV&EDU',
        'PROVAMHSIN',
        2,
        'Y',
        CURRENT_USER,
        CURRENT_TIMESTAMP
    ),
    (
        'COSPRV&EDU',
        'CDCTMEDREL',
        3,
        'Y',
        CURRENT_USER,
        CURRENT_TIMESTAMP
    ),
    (
        'COSPRV&EDU',
        'CNTCTGROUP',
        4,
        'Y',
        CURRENT_USER,
        CURRENT_TIMESTAMP
    ),
    (
        'COSPRV&EDU',
        'CNTCTBYLAW',
        5,
        'Y',
        CURRENT_USER,
        CURRENT_TIMESTAMP
    ) on conflict do nothing;

insert into
    case_management.outcome_agency_code (
        outcome_agency_code,
        short_description,
        long_description,
        active_ind,
        create_user_id,
        create_utc_timestamp
    )
values
    (
        'COS',
        'Conservation Officer Service',
        'Conservation Officer Service',
        'Y',
        CURRENT_USER,
        CURRENT_TIMESTAMP
    ) on conflict do nothing;

insert into
    case_management.inaction_reason_code (
        inaction_reason_code,
        outcome_agency_code,
        short_description,
        long_description,
        active_ind,
        create_user_id,
        create_utc_timestamp
    )
values
    (
        'NOPUBSFTYC',
        'COS',
        'No public safety concern',
        'No public safety concern',
        'Y',
        CURRENT_USER,
        CURRENT_TIMESTAMP
    ),
    (
        'OTHOPRPRTY',
        'COS',
        'Other operational priorities',
        'Other operational priorities',
        'Y',
        CURRENT_USER,
        CURRENT_TIMESTAMP
    ) on conflict do nothing;

insert into
    case_management.action_type_code (
        action_type_code,
        short_description,
        long_description,
        active_ind,
        create_user_id,
        create_utc_timestamp
    )
values
    (
        'EQUIPMENT',
        'Equipment',
        'Equipment',
        'Y',
        CURRENT_USER,
        CURRENT_TIMESTAMP
    ) on conflict do nothing;

insert into
    case_management.action_code (
        action_code,
        short_description,
        long_description,
        active_ind,
        create_user_id,
        create_utc_timestamp
    )
values
    (
        'SETEQUIPMT',
        'Equipment set by an officer',
        'Equipment set by an officer',
        'Y',
        CURRENT_USER,
        CURRENT_TIMESTAMP
    ),
    (
        'REMEQUIPMT',
        'Equipment removed by an officer',
        'Equipment removed by an officer',
        'Y',
        CURRENT_USER,
        CURRENT_TIMESTAMP
    ) on conflict do nothing;

insert into
    case_management.action_type_action_xref (
        action_type_code,
        action_code,
        display_order,
        active_ind,
        create_user_id,
        create_utc_timestamp
    )
values
    (
        'EQUIPMENT',
        'SETEQUIPMT',
        1,
        'Y',
        CURRENT_USER,
        CURRENT_TIMESTAMP
    ),
    (
        'EQUIPMENT',
        'REMEQUIPMT',
        2,
        'Y',
        CURRENT_USER,
        CURRENT_TIMESTAMP
    ) on conflict do nothing;

-- Fix for missing display order
update case_management.inaction_reason_code
set
    display_order = 1
where
    inaction_reason_code = 'NOPUBSFTYC';

update case_management.inaction_reason_code
set
    display_order = 2
where
    inaction_reason_code = 'OTHOPRPRTY';