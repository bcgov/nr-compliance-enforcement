alter table if exists case_management.action_type_action_xref
    add constraint "UK_action_type_action_xref__action_type_code__action_code" unique (action_type_code, action_code);