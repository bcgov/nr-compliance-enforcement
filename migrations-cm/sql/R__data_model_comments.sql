-- Equipment Code Comments -- 

comment on table case_management.equipment_code is 'Used to track pieces of equipment that could be deployed out in the field.  For example BRSNR = "Bear Snare"';	
comment on column case_management.equipment_code.equipment_code is 'A human readable code used to identify an equipment type.';
comment on column case_management.equipment_code.short_description is 'The short description of an equipment type.';
comment on column case_management.equipment_code.long_description is 'The long description of an equipment type.';
comment on column case_management.equipment_code.display_order is 'The order in which the values of the equipment type should be displayed when presented to a user in a list.';
comment on column case_management.equipment_code.active_ind is 'A boolean indicator to determine if an equipment type is active.';
comment on column case_management.equipment_code.create_user_id is 'The id of the user that created the equipment type.';
comment on column case_management.equipment_code.create_utc_timestamp is 'The timestamp when the equipment type was created.  The timestamp is stored in UTC with no Offset.';
comment on column case_management.equipment_code.update_user_id is 'The id of the user that updated the equipment type.';
comment on column case_management.equipment_code.update_utc_timestamp is 'The timestamp when the equipment type was updated.  The timestamp is stored in UTC with no Offset.';

-- Age Code Comments -- 

comment on table case_management.age_code is 'Used to categorize wildlife into age brackets.  For example ADLT = "Adult"';	
comment on column case_management.age_code.age_code is 'A human readable code used to identify an age type.';
comment on column case_management.age_code.short_description is 'The short description of an age type.';
comment on column case_management.age_code.long_description is 'The long description of an age type.';
comment on column case_management.age_code.display_order is 'The order in which the values of the age type should be displayed when presented to a user in a list.';
comment on column case_management.age_code.active_ind is 'A boolean indicator to determine if an age type is active.';
comment on column case_management.age_code.create_user_id is 'The id of the user that created the age type.';
comment on column case_management.age_code.create_utc_timestamp is 'The timestamp when the age type was created.  The timestamp is stored in UTC with no Offset.';
comment on column case_management.age_code.update_user_id is 'The id of the user that updated the age type.';
comment on column case_management.age_code.update_utc_timestamp is 'The timestamp when the age type was updated.  The timestamp is stored in UTC with no Offset.';

-- Conflict History Comments --

comment on table case_management.conflict_history_code is 'A classification on the frequence that the target wildlife has previously had a history of human conflict.  For example L = "Low"';	
comment on column case_management.conflict_history_code.conflict_history_code is 'A human readable code used to identify a conflict history type.';
comment on column case_management.conflict_history_code.short_description is 'The short description of a conflict history type.';
comment on column case_management.conflict_history_code.long_description is 'The long description of a conflict history type.';
comment on column case_management.conflict_history_code.display_order is 'The order in which the values of the conflict history type should be displayed when presented to a user in a list.';
comment on column case_management.conflict_history_code.active_ind is 'A boolean indicator to determine if a conflict history type is active.';
comment on column case_management.conflict_history_code.create_user_id is 'The id of the user that created the conflict history type.';
comment on column case_management.conflict_history_code.create_utc_timestamp is 'The timestamp when the conflict history type was created.  The timestamp is stored in UTC with no Offset.';
comment on column case_management.conflict_history_code.update_user_id is 'The id of the user that updated the conflict history type.';
comment on column case_management.conflict_history_code.update_utc_timestamp is 'The timestamp when the conflict history type was updated.  The timestamp is stored in UTC with no Offset.';

-- Drug Code Comments --

comment on table case_management.drug_code is 'Contains the list of drugs that could be administered to wildlife.  For example ATPMZ = "Atipamezole"';	
comment on column case_management.drug_code.drug_code is 'A human readable code used to identify a drug type.';
comment on column case_management.drug_code.short_description is 'The short description of a drug type.';
comment on column case_management.drug_code.long_description is 'The long description of a drug type.';
comment on column case_management.drug_code.display_order is 'The order in which the values of the drug type should be displayed when presented to a user in a list.';
comment on column case_management.drug_code.active_ind is 'A boolean indicator to determine if a drug type is active.';
comment on column case_management.drug_code.create_user_id is 'The id of the user that created the drug type.';
comment on column case_management.drug_code.create_utc_timestamp is 'The timestamp when the drug type was created.  The timestamp is stored in UTC with no Offset.';
comment on column case_management.drug_code.update_user_id is 'The id of the user that updated the drug type.';
comment on column case_management.drug_code.update_utc_timestamp is 'The timestamp when the drug type was updated.  The timestamp is stored in UTC with no Offset.';

-- Drug Method Code Comments --

comment on table case_management.drug_method_code is 'Contains the list of drug induction methods types supported by the system.  For example DART = "Dart"';	
comment on column case_management.drug_method_code.drug_method_code is 'A human readable code used to identify a drug injection method type.';
comment on column case_management.drug_method_code.short_description is 'The short description of a drug injection method type.';
comment on column case_management.drug_method_code.long_description is 'The long description of a drug injection method type.';
comment on column case_management.drug_method_code.display_order is 'The order in which the values of the drug injection method type should be displayed when presented to a user in a list.';
comment on column case_management.drug_method_code.active_ind is 'A boolean indicator to determine if a drug injection method type is active.';
comment on column case_management.drug_method_code.create_user_id is 'The id of the user that created the drug injection method type.';
comment on column case_management.drug_method_code.create_utc_timestamp is 'The timestamp when the drug injection method type was created.  The timestamp is stored in UTC with no Offset.';	comment on column case_management.drug_method_code.update_user_id is 'The id of the user that updated the drug injection method type.';
comment on column case_management.drug_method_code.update_utc_timestamp is 'The timestamp when the drug injection method type was updated.  The timestamp is stored in UTC with no Offset.';

-- Drug Remaining Outcome Code Comments --

comment on table case_management.drug_remaining_outcome_code is 'After a drug has been induced to an animal, the fate of the remaining drug in the vial is recorded.   This table contains a list of types supported by the system.  For example DISC = "Discard"';	
comment on column case_management.drug_remaining_outcome_code.drug_remaining_outcome_code is 'A human readable code used to identify a remaining drug outcome type.';
comment on column case_management.drug_remaining_outcome_code.short_description is 'The short description of a remaining drug outcome type.';
comment on column case_management.drug_remaining_outcome_code.long_description is 'The long description of a remaining drug outcome type.';
comment on column case_management.drug_remaining_outcome_code.display_order is 'The order in which the values of the remaining drug outcome type should be displayed when presented to a user in a list.';
comment on column case_management.drug_remaining_outcome_code.active_ind is 'A boolean indicator to determine if a remaining drug outcome type is active.';
comment on column case_management.drug_remaining_outcome_code.create_user_id is 'The id of the user that created the remaining drug outcome type.';
comment on column case_management.drug_remaining_outcome_code.create_utc_timestamp is 'The timestamp when the remaining drug outcome type was created.  The timestamp is stored in UTC with no Offset.';
comment on column case_management.drug_remaining_outcome_code.update_user_id is 'The id of the user that updated the remaining drug outcome type.';
comment on column case_management.drug_remaining_outcome_code.update_utc_timestamp is 'The timestamp when the remaining drug outcome type was updated.  The timestamp is stored in UTC with no Offset.';

-- Ear Code Comments --

comment on table case_management.ear_code is 'Indicates which ear an identification tag is present on.  For example L = "Left"';	
comment on column case_management.ear_code.ear_code is 'A human readable code used to identify an ear type.';
comment on column case_management.ear_code.short_description is 'The short description of an ear type.';
comment on column case_management.ear_code.long_description is 'The long description of an ear type.';
comment on column case_management.ear_code.display_order is 'The order in which the values of the ear type should be displayed when presented to a user in a list.';
comment on column case_management.ear_code.active_ind is 'A boolean indicator to determine if an ear type is active.';
comment on column case_management.ear_code.create_user_id is 'The id of the user that created the ear type.';
comment on column case_management.ear_code.create_utc_timestamp is 'The timestamp when the ear type was created.  The timestamp is stored in UTC with no Offset.';
comment on column case_management.ear_code.update_user_id is 'The id of the user that updated the ear type.';
comment on column case_management.ear_code.update_utc_timestamp is 'The timestamp when the ear type was updated.  The timestamp is stored in UTC with no Offset.';


-- HWCR Outcome Code Comments --

comment on table case_management.hwcr_outcome_code is 'Indicates the final outcome for an animal as a result of an HWC.  For example DESTRYCOS = "Destroyed by COS"';	
comment on column case_management.hwcr_outcome_code.hwcr_outcome_code is 'A human readable code used to identify an HWCR outcome type.';
comment on column case_management.hwcr_outcome_code.short_description is 'The short description of an HWCR outcome type.';
comment on column case_management.hwcr_outcome_code.long_description is 'The long description of an HWCR outcome type.';
comment on column case_management.hwcr_outcome_code.display_order is 'The order in which the values of the HWCR outcome  type should be displayed when presented to a user in a list.';
comment on column case_management.hwcr_outcome_code.active_ind is 'A boolean indicator to determine if an HWCR outcome type is active.';
comment on column case_management.hwcr_outcome_code.create_user_id is 'The id of the user that created the HWCR outcome type.';
comment on column case_management.hwcr_outcome_code.create_utc_timestamp is 'The timestamp when the HWCR outcome type was created.  The timestamp is stored in UTC with no Offset.';
comment on column case_management.hwcr_outcome_code.update_user_id is 'The id of the user that updated the HWCR outcome type.';
comment on column case_management.hwcr_outcome_code.update_utc_timestamp is 'The timestamp when the HWCR outcome type was updated.  The timestamp is stored in UTC with no Offset.';

-- Sex Code Comments --

comment on table case_management.sex_code is 'Contains the list of biological sexes supported by the system.  For example M = "Male"';	
comment on column case_management.sex_code.sex_code is 'A human readable code used to identify a sex type.';
comment on column case_management.sex_code.short_description is 'The short description of a sex type.';
comment on column case_management.sex_code.long_description is 'The long description of a sex type.';
comment on column case_management.sex_code.display_order is 'The order in which the values of the sex type should be displayed when presented to a user in a list.';
comment on column case_management.sex_code.active_ind is 'A boolean indicator to determine if a sex type is active.';
comment on column case_management.sex_code.create_user_id is 'The id of the user that created the sex type.';
comment on column case_management.sex_code.create_utc_timestamp is 'The timestamp when the sex type was created.  The timestamp is stored in UTC with no Offset.';
comment on column case_management.sex_code.update_user_id is 'The id of the user that updated the sex type.';
comment on column case_management.sex_code.update_utc_timestamp is 'The timestamp when the sex type was updated.  The timestamp is stored in UTC with no Offset.';

-- Threat Level Comments

comment on table case_management.threat_level_code is 'A COS determination that indicates the threat level of the animal to humans.  For example 1 = "Category 1"';	
comment on column case_management.threat_level_code.threat_level_code is 'A human readable code used to identify a threat level type.';
comment on column case_management.threat_level_code.short_description is 'The short description of a threat level type.';
comment on column case_management.threat_level_code.long_description is 'The long description of a threat level type.';
comment on column case_management.threat_level_code.display_order is 'The order in which the values of the threat level type should be displayed when presented to a user in a list.';
comment on column case_management.threat_level_code.active_ind is 'A boolean indicator to determine if a threat level type is active.';
comment on column case_management.threat_level_code.create_user_id is 'The id of the user that created the threat level type.';
comment on column case_management.threat_level_code.create_utc_timestamp is 'The timestamp when the threat level type was created.  The timestamp is stored in UTC with no Offset.';
comment on column case_management.threat_level_code.update_user_id is 'The id of the user that updated the threat level type.';
comment on column case_management.threat_level_code.update_utc_timestamp is 'The timestamp when the threat level type was updated.  The timestamp is stored in UTC with no Offset.';