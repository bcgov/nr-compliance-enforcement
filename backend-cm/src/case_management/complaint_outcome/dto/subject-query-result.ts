export interface SubjectQueryResult {
  wildlife: {
    action: {
      action_type_action_xref: {
        action_code_action_type_action_xref_action_codeToaction_code: {
          action_code: string;
          short_description: string;
          long_description: string;
          active_ind: boolean;
        };
      };
      active_ind: boolean;
      action_guid: string;
      actor_guid: string;
      action_date: Date;
    }[];
    wildlife_guid: string;
    threat_level_code_wildlife_threat_level_codeTothreat_level_code: {
      threat_level_code: string;
      short_description: string;
    };
    identifying_features: string;
    sex_code_wildlife_sex_codeTosex_code: {
      sex_code: string;
      short_description: string;
    };
    age_code_wildlife_age_codeToage_code: {
      age_code: string;
      short_description: string;
    };
    hwcr_outcome_code_wildlife_hwcr_outcome_codeTohwcr_outcome_code: {
      hwcr_outcome_code: string;
      short_description: string;
    };
    hwcr_outcome_actioned_by_code_wildlife_hwcr_outcome_actioned_by_codeTohwcr_outcome_actioned_by_code: {
      hwcr_outcome_actioned_by_code: string;
      short_description: string;
    };
    species_code: string;
    create_utc_timestamp: Date;
    drug_administered: {
      drug_administered_guid: string;
      wildlife_guid: string;
      drug_code_drug_administered_drug_codeTodrug_code: {
        drug_code: string;
        short_description: string;
      };
      drug_method_code_drug_administered_drug_method_codeTodrug_method_code: {
        drug_method_code: string;
        short_description: string;
      };
      drug_remaining_outcome_code_drug_administered_drug_remaining_outcome_codeTodrug_remaining_outcome_code: {
        drug_remaining_outcome_code: string;
        short_description: string;
      };
      vial_number: string;
      drug_used_amount: string;
      additional_comments_text: string;
      create_utc_timestamp: Date;
    }[];
    ear_tag: {
      ear_tag_guid: string;
      wildlife_guid: string;
      ear_code_ear_tag_ear_codeToear_code: {
        ear_code: string;
        short_description: string;
      };
      ear_tag_identifier: string;
      create_utc_timestamp: Date;
    }[];
  }[];
}
