import { Injectable, Logger } from "@nestjs/common";
import {
  CreateAssessmentInput,
  CreateComplaintOutcomeInput,
  CreatePreventionInput,
} from "./dto/create-case_file.input";
import { UpdateAssessmentInput, UpdateEquipmentInput, UpdatePreventionInput } from "./dto/update-case_file.input";
import { ComplaintOutcomePrismaService } from "../../prisma/complaint_outcome/prisma.complaint_outcome.service";
import { ComplaintOutcome } from "./entities/complaint_outcome.entity";
import { GraphQLError } from "graphql";
import { ACTION_CODES } from "../../common/action_codes";
import { CreateNoteInput } from "./dto/note/create-note.input";
import { UpdateNoteInput } from "./dto/note/update-note.input";
import { DeleteNoteInput } from "./dto/note/delete-note.input";
import { ACTION_TYPE_CODES } from "../../common/action_type_codes";
import { ReviewInput } from "./dto/review-input";
import { CaseFileActionService } from "../case_file_action/case_file_action.service";
import { Equipment } from "./entities/equipment.entity";
import { DeleteEquipmentInput } from "./dto/equipment/delete-equipment.input";
import { action, Prisma, PrismaClient } from ".prisma/complaint_outcome";
import { DefaultArgs } from "@prisma/client/runtime/library";
import { CreateWildlifeInput } from "./dto/wildlife/create-wildlife-input";
import { WildlifeInput } from "./dto/wildlife/wildlife-input";
import { EarTagInput } from "./dto/wildlife/ear-tag-input";
import { DrugInput } from "./dto/wildlife/drug-input";
import { WildlifeAction } from "./dto/wildlife/wildlife-action";
import { Wildlife } from "./entities/wildlife-entity";
import { SubjectQueryResult } from "./dto/subject-query-result";
import { DeleteWildlifeInput } from "./dto/wildlife/delete-wildlife-input";
import { UpdateWildlifeInput } from "./dto/wildlife/update-wildlife-input";
import { CreateDecisionInput } from "./dto/ceeb/decision/create-decsion-input";
import { DecisionInput } from "./dto/ceeb/decision/decision-input";
import { randomUUID } from "crypto";
import { Decision } from "./entities/decision-entity";
import { UpdateDecisionInput } from "./dto/ceeb/decision/update-decsion-input";
import { CreateAuthorizationOutcomeInput } from "./dto/ceeb/authorization-outcome/create-authorization-outcome-input";
import { AuthorizationOutcomeSearchResults } from "./dto/ceeb/authorization-outcome/authorization-outcome-search-results";
import { AuthorizationOutcome } from "./entities/authorization-outcome.entity";
import { UpdateAuthorizationOutcomeInput } from "./dto/ceeb/authorization-outcome/update-authorization-outcome-input";
import { DeleteAuthorizationOutcomeInput } from "./dto/ceeb/authorization-outcome/delete-authorization-outcome-input";
import { ActionInput } from "./dto/action-input";
import { Note } from "./entities/note.entity";
import { Prevention } from "./entities/prevention.entity";
import { DeletePreventionInput } from "./dto/delete-prevention.input";

@Injectable()
export class ComplaintOutcomeService {
  constructor(
    private readonly prisma: ComplaintOutcomePrismaService,
    private readonly caseFileActionService: CaseFileActionService,
  ) {}

  private readonly logger = new Logger(ComplaintOutcomeService.name);

  //--
  //-- creates an initial case_file and lead element for the
  //-- selected complaint
  //--
  async createComplaintOutcome(
    db: Omit<
      PrismaClient<Prisma.PrismaClientOptions, never, DefaultArgs>,
      "$connect" | "$disconnect" | "$on" | "$transaction" | "$use" | "$extends"
    >,
    input: CreateComplaintOutcomeInput,
  ): Promise<string> {
    let complaintOutcomeGuid: string;

    try {
      const caseRecord = {
        owned_by_agency_code: input.outcomeAgencyCode,
        complaint_identifier: input.complaintId,
        create_user_id: input.createUserId,
        update_user_id: input.createUserId,
        create_utc_timestamp: new Date(),
        update_utc_timestamp: new Date(),
      };

      const case_file = await db.complaint_outcome.create({
        data: caseRecord,
      });

      complaintOutcomeGuid = case_file.complaint_outcome_guid;
    } catch (exception) {
      this.logger.warn(exception);
      throw new GraphQLError("Exception occurred. See server log for details", exception);
    }
    return complaintOutcomeGuid;
  }

  //------------------
  //-- assessments
  //------------------
  async createAssessment(model: CreateAssessmentInput): Promise<ComplaintOutcome> {
    let complaintOutcomeGuid: string;
    let complaintOutcomeOutput: ComplaintOutcome;

    try {
      await this.prisma.$transaction(async (db) => {
        let assessmentId: string;
        let case_file: any;

        if (!model.complaintOutcomeGuid) {
          case_file = await db.complaint_outcome.create({
            data: {
              agency_code: {
                connect: {
                  outcome_agency_code: model.outcomeAgencyCode,
                },
              },
              complaint_identifier: model.complaintId,
              create_user_id: model.createUserId,
              create_utc_timestamp: new Date(),
            },
          });

          complaintOutcomeGuid = case_file.complaint_outcome_guid;

          this.logger.log(`Case file created with complaint_outcome_guid: ${complaintOutcomeGuid}`);
          this.logger.log(`Lead created with lead_identifier: ${case_file.complaint_identifier}`);
        } else {
          complaintOutcomeGuid = model.complaintOutcomeGuid;
        }

        this.logger.log(`Creating assessment for case file: ${complaintOutcomeGuid}`);

        const assessment = await db.assessment.create({
          data: {
            complaint_outcome: {
              connect: {
                complaint_outcome_guid: complaintOutcomeGuid,
              },
            },
            outcome_agency_code_assessment_outcome_agency_codeTooutcome_agency_code: {
              connect: {
                outcome_agency_code: model.outcomeAgencyCode,
              },
            },
            inaction_reason_code_assessment_inaction_reason_codeToinaction_reason_code: model.assessment
              .actionJustificationCode
              ? {
                  connect: {
                    inaction_reason_code: model.assessment.actionJustificationCode,
                  },
                }
              : undefined,
            create_user_id: model.createUserId,
            create_utc_timestamp: new Date(),
            action_not_required_ind: model.assessment.actionNotRequired,
            complainant_contacted_ind: model.assessment.contactedComplainant,
            attended_ind: model.assessment.attended,
            case_location_code_assessment_case_location_codeTocase_location_code: model.assessment.locationType
              ? {
                  connect: {
                    case_location_code: model.assessment.locationType.value,
                  },
                }
              : undefined,
            conflict_history_code: model.assessment.conflictHistory
              ? {
                  connect: {
                    conflict_history_code: model.assessment.conflictHistory.value,
                  },
                }
              : undefined,
            threat_level_code: model.assessment.categoryLevel
              ? {
                  connect: {
                    threat_level_code: model.assessment.categoryLevel.value,
                  },
                }
              : undefined,
          },
        });

        assessmentId = assessment.assessment_guid;

        this.logger.log(`Assessment created with assessment_guid: ${assessmentId}`);

        let action_codes_objects = await db.action_type_action_xref.findMany({
          where: { action_type_code: ACTION_TYPE_CODES.COMPASSESS },
          select: { action_code: true },
        });
        let action_codes: Array<string> = [];
        for (const action_code_object of action_codes_objects) {
          action_codes.push(action_code_object.action_code);
        }
        for (const action of model.assessment.actions) {
          if (action_codes.indexOf(action.actionCode) === -1) {
            throw "Some action code values where not passed from the client";
          }
        }

        for (const action of model.assessment.actions) {
          let actionTypeActionXref = await db.action_type_action_xref.findFirstOrThrow({
            where: {
              action_type_code: ACTION_TYPE_CODES.COMPASSESS,
              action_code: action.actionCode,
            },
            select: {
              action_type_action_xref_guid: true,
            },
          });
          await db.action.create({
            data: {
              complaint_outcome_guid: complaintOutcomeGuid,
              assessment_guid: assessmentId,
              action_type_action_xref_guid: actionTypeActionXref.action_type_action_xref_guid,
              actor_guid: action.actor,
              action_date: action.date,
              active_ind: action.activeIndicator,
              create_user_id: model.createUserId,
              create_utc_timestamp: new Date(),
            },
          });
        }

        //Add category 1 actions
        let cat1Action_codes_objects = await db.action_type_action_xref.findMany({
          where: { action_type_code: ACTION_TYPE_CODES.CAT1ASSESS },
          select: { action_code: true, action_type_action_xref_guid: true },
        });

        let cat1Action_codes: Array<string> = [];
        for (const action_code_object of cat1Action_codes_objects) {
          cat1Action_codes.push(action_code_object.action_code);
        }

        for (const cat1Action of model.assessment.actions) {
          if (action_codes.indexOf(cat1Action.actionCode) === -1) {
            throw "Some action code values where not passed from the client";
          }
        }
        for (const action of model.assessment.cat1Actions) {
          let actionTypeActionXref = await db.action_type_action_xref.findFirstOrThrow({
            where: {
              action_type_code: ACTION_TYPE_CODES.CAT1ASSESS,
              action_code: action.actionCode,
            },
            select: {
              action_type_action_xref_guid: true,
            },
          });
          await db.action.create({
            data: {
              complaint_outcome_guid: complaintOutcomeGuid,
              assessment_guid: assessmentId,
              action_type_action_xref_guid: actionTypeActionXref.action_type_action_xref_guid,
              actor_guid: action.actor,
              action_date: action.date,
              active_ind: action.activeIndicator,
              create_user_id: model.createUserId,
              create_utc_timestamp: new Date(),
            },
          });
        }

        this.logger.log(`Actions created for assessment: ${assessmentId}`);
      });
      this.logger.log(`Transaction completed successfully, returning updated case file`);
      complaintOutcomeOutput = await this.findOne(complaintOutcomeGuid);
    } catch (exception) {
      throw new GraphQLError(
        `Exception occurred. See server log for details: ${exception.message}, ${JSON.stringify(exception)}`,
        {},
      );
    }
    return complaintOutcomeOutput;
  }

  findOne = async (id: string): Promise<ComplaintOutcome> => {
    const result = await this.find([id]);
    if (result.length === 0) {
      throw new GraphQLError("Case file not found", {});
    }
    return result[0];
  };

  find = async (ids: string[]): Promise<ComplaintOutcome[]> => {
    const queryResults = await this.prisma.complaint_outcome.findMany({
      where: { complaint_outcome_guid: { in: ids } },
      select: {
        complaint_outcome_guid: true,
        review_required_ind: true,
        complaint_identifier: true,
        assessment: {
          select: {
            assessment_guid: true,
            outcome_agency_code: true,
            inaction_reason_code: true,
            inaction_reason_code_assessment_inaction_reason_codeToinaction_reason_code: {
              select: {
                short_description: true,
                long_description: true,
                active_ind: true,
              },
            },
            action_not_required_ind: true,
            complainant_contacted_ind: true,
            attended_ind: true,
            case_location_code_assessment_case_location_codeTocase_location_code: {
              select: {
                case_location_code: true,
                short_description: true,
              },
            },
            conflict_history_code: {
              select: {
                conflict_history_code: true,
                short_description: true,
              },
            },
            threat_level_code: {
              select: {
                threat_level_code: true,
                short_description: true,
              },
            },
          },
          orderBy: {
            create_utc_timestamp: "asc",
          },
        },
        action: {
          select: {
            actor_guid: true,
            action_date: true,
            active_ind: true,
            action_type_action_xref: {
              select: {
                action_code_action_type_action_xref_action_codeToaction_code: {
                  select: {
                    action_code: true,
                    short_description: true,
                    long_description: true,
                    active_ind: true,
                  },
                },
                action_type_code_action_type_action_xref_action_type_codeToaction_type_code: {
                  select: {
                    action_type_code: true,
                    short_description: true,
                    long_description: true,
                    active_ind: true,
                  },
                },
              },
            },
          },
        },
        wildlife: {
          where: { active_ind: true },
          select: {
            wildlife_guid: true,
            species_code: true,
            age_code_wildlife_age_codeToage_code: {
              select: {
                age_code: true,
                short_description: true,
              },
            },
            sex_code_wildlife_sex_codeTosex_code: {
              select: {
                sex_code: true,
                short_description: true,
              },
            },
            identifying_features: true,
            threat_level_code: true,
            threat_level_code_wildlife_threat_level_codeTothreat_level_code: {
              select: {
                threat_level_code: true,
                short_description: true,
              },
            },
            hwcr_outcome_code_wildlife_hwcr_outcome_codeTohwcr_outcome_code: {
              select: {
                hwcr_outcome_code: true,
                short_description: true,
              },
            },
            hwcr_outcome_actioned_by_code_wildlife_hwcr_outcome_actioned_by_codeTohwcr_outcome_actioned_by_code: {
              select: {
                hwcr_outcome_actioned_by_code: true,
                short_description: true,
              },
            },
            create_utc_timestamp: true,
            drug_administered: {
              select: {
                drug_administered_guid: true,
                wildlife_guid: true,
                drug_code_drug_administered_drug_codeTodrug_code: {
                  select: {
                    drug_code: true,
                    short_description: true,
                  },
                },
                drug_method_code_drug_administered_drug_method_codeTodrug_method_code: {
                  select: {
                    drug_method_code: true,
                    short_description: true,
                  },
                },
                drug_remaining_outcome_code_drug_administered_drug_remaining_outcome_codeTodrug_remaining_outcome_code:
                  {
                    select: {
                      drug_remaining_outcome_code: true,
                      short_description: true,
                    },
                  },
                vial_number: true,
                drug_used_amount: true,
                additional_comments_text: true,
                create_utc_timestamp: true,
              },
              where: {
                active_ind: true,
              },
            },
            ear_tag: {
              select: {
                ear_tag_guid: true,
                wildlife_guid: true,
                ear_code_ear_tag_ear_codeToear_code: {
                  select: {
                    ear_code: true,
                    short_description: true,
                  },
                },
                ear_tag_identifier: true,
                create_utc_timestamp: true,
              },
              where: {
                active_ind: true,
              },
            },
            action: {
              where: {
                active_ind: true,
              },
              select: {
                action_guid: true,
                actor_guid: true,
                action_date: true,
                active_ind: true,
                action_type_action_xref: {
                  select: {
                    action_code_action_type_action_xref_action_codeToaction_code: {
                      select: {
                        action_code: true,
                        short_description: true,
                        long_description: true,
                        active_ind: true,
                      },
                    },
                  },
                },
              },
            },
          },
        },
        decision: {
          where: { active_ind: true },
          select: {
            decision_guid: true,
            discharge_code_decision_discharge_codeTodischarge_code: {
              select: {
                discharge_code: true,
                long_description: true,
              },
            },
            rationale_text: true,
            inspection_number: true,
            outcome_agency_code_decision_outcome_agency_codeTooutcome_agency_code: {
              select: {
                outcome_agency_code: true,
                long_description: true,
              },
            },
            non_compliance_decision_matrix_code_decision_non_compliance_decision_matrix_codeTonon_compliance_decision_matrix_code:
              {
                select: {
                  non_compliance_decision_matrix_code: true,
                  long_description: true,
                },
              },
            ipm_auth_category_code_decision_ipm_auth_category_codeToipm_auth_category_code: {
              select: {
                ipm_auth_category_code: true,
                long_description: true,
              },
            },
            schedule_sector_xref: {
              select: {
                schedule_code_schedule_sector_xref_schedule_codeToschedule_code: {
                  select: {
                    schedule_code: true,
                    long_description: true,
                  },
                },
                sector_code_schedule_sector_xref_sector_codeTosector_code: {
                  select: {
                    sector_code: true,
                    long_description: true,
                  },
                },
              },
            },
          },
        },
        authorization_permit: {
          where: {
            active_ind: true,
          },
          select: {
            authorization_permit_guid: true,
            authorization_permit_id: true,
          },
        },
        site: {
          where: {
            active_ind: true,
          },
          select: {
            site_guid: true,
            site_id: true,
          },
        },
      },
    });

    const results: ComplaintOutcome[] = [];
    for (const queryResult of queryResults) {
      const {
        complaint_outcome_guid: complaintOutcomeGuid,
        complaint_identifier: complaintId,
        review_required_ind: isReviewRequired,
      } = queryResult;

      const equipmentDetails = await this.findEquipmentDetails(complaintOutcomeGuid);
      const caseNotes = await this.findCaseNotes(complaintOutcomeGuid);
      const preventions = await this.findPreventions(complaintOutcomeGuid);
      const reviewCompleteAction = await this.caseFileActionService.findActionByCaseIdAndCaseCode(
        complaintOutcomeGuid,
        ACTION_CODES.COMPLTREVW,
      );

      let caseFile: ComplaintOutcome = {
        complaintOutcomeGuid: complaintOutcomeGuid,
        complaintId: complaintId ?? "",
        prevention: preventions,
        isReviewRequired: isReviewRequired,
        reviewComplete: reviewCompleteAction ?? null,
        notes: caseNotes,
        equipment: equipmentDetails,
      };

      if (queryResult.wildlife) {
        caseFile.subject = await this._getCaseFileSubjects(queryResult);
      }

      if (queryResult.assessment && queryResult.assessment.length !== 0) {
        const assessments = [];
        for (const assessment of queryResult.assessment) {
          const {
            assessment_guid: id,
            outcome_agency_code: outcomeAgencyCode,
            inaction_reason_code: actionJustificationCode,
            inaction_reason_code_assessment_inaction_reason_codeToinaction_reason_code: reason,
            action_not_required_ind: actionNotRequired,
            complainant_contacted_ind: contactedComplainant,
            attended_ind: attended,
            case_location_code_assessment_case_location_codeTocase_location_code: locationType,
            conflict_history_code: conflictHistory,
            threat_level_code: categoryLevel,
          } = assessment;

          const actions = await this.caseFileActionService.findActionsByAssessmentIdAndType(
            id,
            ACTION_TYPE_CODES.COMPASSESS,
          );
          const cat1Actions = await this.caseFileActionService.findActionsByAssessmentIdAndType(
            id,
            ACTION_TYPE_CODES.CAT1ASSESS,
          );

          assessments.push({
            id,
            complaintOutcomeGuid: complaintOutcomeGuid,
            outcomeAgencyCode,
            actionNotRequired,
            actionJustificationCode,
            actionJustificationShortDescription: reason?.short_description ?? null,
            actionJustificationLongDescription: reason?.long_description ?? null,
            actionJustificationActiveIndicator: reason?.active_ind ?? null,
            actions,
            cat1Actions,
            contactedComplainant,
            attended,
            conflictHistory: {
              key: conflictHistory?.short_description ?? "",
              value: conflictHistory?.conflict_history_code ?? "",
            },
            locationType: {
              key: locationType?.short_description ?? "",
              value: locationType?.case_location_code ?? "",
            },
            categoryLevel: {
              key: categoryLevel?.short_description ?? "",
              value: categoryLevel?.threat_level_code ?? "",
            },
          });
        }
        caseFile.assessment = assessments;
      }

      if (queryResult.decision && queryResult.decision.length !== 0) {
        const { decision } = queryResult;
        const action = await this.caseFileActionService.findActiveActionsByCaseIdAndType(
          complaintOutcomeGuid,
          ACTION_TYPE_CODES.CEEBACTION,
        );

        let record: Decision = {
          id: decision[0].decision_guid,
          schedule:
            decision[0].schedule_sector_xref.schedule_code_schedule_sector_xref_schedule_codeToschedule_code
              .schedule_code,
          scheduleLongDescription:
            decision[0].schedule_sector_xref.schedule_code_schedule_sector_xref_schedule_codeToschedule_code
              .long_description,
          sector:
            decision[0].schedule_sector_xref.sector_code_schedule_sector_xref_sector_codeTosector_code.sector_code,
          sectorLongDescription:
            decision[0].schedule_sector_xref.sector_code_schedule_sector_xref_sector_codeTosector_code.long_description,
          discharge: decision[0].discharge_code_decision_discharge_codeTodischarge_code.discharge_code,
          dischargeLongDescription: decision[0].discharge_code_decision_discharge_codeTodischarge_code.long_description,
          nonCompliance:
            decision[0]
              ?.non_compliance_decision_matrix_code_decision_non_compliance_decision_matrix_codeTonon_compliance_decision_matrix_code
              ?.non_compliance_decision_matrix_code,
          nonComplianceLongDescription:
            decision[0]
              ?.non_compliance_decision_matrix_code_decision_non_compliance_decision_matrix_codeTonon_compliance_decision_matrix_code
              ?.long_description,
          ipmAuthCategory:
            decision[0]?.ipm_auth_category_code_decision_ipm_auth_category_codeToipm_auth_category_code
              ?.ipm_auth_category_code,
          ipmAuthCategoryLongDescription:
            decision[0]?.ipm_auth_category_code_decision_ipm_auth_category_codeToipm_auth_category_code
              ?.long_description,
          rationale: decision[0]?.rationale_text,
          assignedTo: action[0]?.actor,
          actionTaken: action[0]?.actionCode,
          actionTakenLongDescription: action[0]?.longDescription,
          actionTakenDate: action[0]?.date,
        };

        if (decision[0].inspection_number) {
          record = { ...record, inspectionNumber: decision[0].inspection_number.toString() };
        }
        if (decision[0].outcome_agency_code_decision_outcome_agency_codeTooutcome_agency_code) {
          record = {
            ...record,
            leadAgency:
              decision[0].outcome_agency_code_decision_outcome_agency_codeTooutcome_agency_code.outcome_agency_code,
          };
          record = {
            ...record,
            leadAgencyLongDescription:
              decision[0].outcome_agency_code_decision_outcome_agency_codeTooutcome_agency_code.long_description,
          };
        }
        caseFile.decision = record;
      }

      caseFile.authorization = this._getAuthorizationOutcome(queryResult as AuthorizationOutcomeSearchResults);
      results.push(caseFile);
    }
    return results;
  };

  async findOneByLeadId(complaintId: string) {
    //TODO: optimize this one later, not to query case_file 2 times
    let complaintOutcomeOutput: ComplaintOutcome = new ComplaintOutcome();
    const caseIdRecord = await this.prisma.complaint_outcome.findFirst({
      where: {
        complaint_identifier: complaintId,
      },
      select: {
        complaint_outcome_guid: true,
      },
    });
    if (caseIdRecord?.complaint_outcome_guid) {
      complaintOutcomeOutput = await this.findOne(caseIdRecord.complaint_outcome_guid);
    }
    return complaintOutcomeOutput;
  }

  async findManyByLeadId(complaintId: string[]) {
    const outcomeRecords = await this.prisma.complaint_outcome.findMany({
      where: {
        complaint_identifier: {
          in: complaintId,
        },
      },
      select: {
        complaint_outcome_guid: true,
      },
    });

    const complaintOutcomeGuids = outcomeRecords.map((record) => record.complaint_outcome_guid);

    if (complaintOutcomeGuids.length === 0) {
      return [];
    }

    const results = await this.find(complaintOutcomeGuids);
    return results;
  }

  async findManyBySearchString(complaintType: string, searchString: string) {
    let complaintOutcomeOutput: Array<ComplaintOutcome> = [];
    let caseIdRecords;
    if (complaintType === "HWCR") {
      caseIdRecords = await this.prisma.complaint_outcome.findMany({
        where: {
          OR: [
            {
              wildlife: {
                some: {
                  ear_tag: {
                    some: {
                      ear_tag_identifier: {
                        contains: searchString,
                      },
                      active_ind: true,
                    },
                  },
                },
              },
            },
          ],
        },
        select: {
          complaint_identifier: true,
          complaint_outcome_guid: true,
        },
      });
    } else if (complaintType === "ERS") {
      const complaintOutcomeIds = await this.prisma.complaint_outcome.findMany({
        where: {
          OR: [
            {
              authorization_permit: {
                some: {
                  authorization_permit_id: {
                    contains: searchString,
                  },
                  active_ind: true,
                },
              },
            },
            {
              site: {
                some: {
                  site_id: {
                    contains: searchString,
                  },
                  active_ind: true,
                },
              },
            },
          ],
        },
        select: {
          complaint_identifier: true,
          complaint_outcome_guid: true,
        },
      });

      //Search for inspection_number using rawSQL to do partial match
      //Because inspection_number stored as an integer, and can only do exact match if we're using prisma
      const rawResults = await this.prisma.$queryRaw<
        { complaint_identifier: string; complaint_outcome_guid: string }[]
      >`
        SELECT co.complaint_identifier, co.complaint_outcome_guid
        FROM complaint_outcome co
        INNER JOIN decision d ON co.complaint_outcome_guid = d.complaint_outcome_guid
        WHERE CAST(d.inspection_number AS TEXT) LIKE ${`%${searchString}%`}
        AND d.active_ind = true
      `;
      caseIdRecords = [
        ...complaintOutcomeIds,
        ...rawResults.map((record) => ({
          complaint_identifier: record.complaint_identifier,
          complaint_outcome_guid: record.complaint_outcome_guid,
        })),
      ];
    }
    for (const caseIdRecord of caseIdRecords) {
      complaintOutcomeOutput.push({
        complaintOutcomeGuid: caseIdRecord.complaint_outcome_guid,
        complaintId: caseIdRecord.complaint_identifier,
      });
    }
    return complaintOutcomeOutput;
  }

  async updateAssessment(model: UpdateAssessmentInput) {
    let complaintOutcomeOutput: ComplaintOutcome;

    try {
      await this.prisma.$transaction(async (db) => {
        await db.assessment.update({
          where: { assessment_guid: model.assessment.id },
          data: {
            ...(model.outcomeAgencyCode && {
              outcome_agency_code_assessment_outcome_agency_codeTooutcome_agency_code: {
                connect: {
                  outcome_agency_code: model.outcomeAgencyCode,
                },
              },
            }),
            inaction_reason_code_assessment_inaction_reason_codeToinaction_reason_code: model.assessment
              .actionJustificationCode
              ? {
                  connect: {
                    inaction_reason_code: model.assessment.actionJustificationCode,
                  },
                }
              : {
                  disconnect: true,
                },
            action_not_required_ind: model.assessment.actionNotRequired,
            complainant_contacted_ind: model.assessment.contactedComplainant,
            attended_ind: model.assessment.attended,
            case_location_code_assessment_case_location_codeTocase_location_code: model.assessment.locationType
              ? {
                  connect: {
                    case_location_code: model.assessment.locationType.value,
                  },
                }
              : {
                  disconnect: true,
                },
            conflict_history_code: model.assessment.conflictHistory
              ? {
                  connect: {
                    conflict_history_code: model.assessment.conflictHistory.value,
                  },
                }
              : {
                  disconnect: true,
                },
            threat_level_code: model.assessment.categoryLevel
              ? {
                  connect: {
                    threat_level_code: model.assessment.categoryLevel.value,
                  },
                }
              : {
                  disconnect: true,
                },
            update_user_id: model.updateUserId,
            update_utc_timestamp: new Date(),
          },
        });

        for (const action of model.assessment.actions) {
          let actionTypeActionXref = await this.prisma.action_type_action_xref.findFirstOrThrow({
            where: {
              action_type_code: ACTION_TYPE_CODES.COMPASSESS,
              action_code: action.actionCode,
            },
            select: {
              action_type_action_xref_guid: true,
              action_code: true,
              action_type_code: true,
            },
          });

          let actionXref = await this.prisma.action.findFirst({
            where: {
              action_type_action_xref_guid: actionTypeActionXref.action_type_action_xref_guid,
              assessment_guid: model.assessment.id,
            },
            select: {
              action_type_action_xref_guid: true,
            },
          });

          if (actionXref) {
            await db.action.updateMany({
              where: {
                assessment_guid: model.assessment.id,
                action_type_action_xref_guid: actionTypeActionXref.action_type_action_xref_guid,
              },
              data: {
                actor_guid: action.actor,
                action_date: action.date,
                active_ind: action.activeIndicator,
                update_user_id: model.updateUserId,
                update_utc_timestamp: new Date(),
              },
            });
          } else {
            await db.action.create({
              data: {
                complaint_outcome_guid: model.complaintOutcomeGuid,
                action_type_action_xref_guid: actionTypeActionXref.action_type_action_xref_guid,
                actor_guid: action.actor,
                action_date: action.date,
                active_ind: action.activeIndicator,
                create_user_id: model.updateUserId,
                create_utc_timestamp: new Date(),
              },
            });
          }
        }

        //Handle cat1actions
        for (const action of model.assessment.cat1Actions) {
          let actionTypeActionXref = await this.prisma.action_type_action_xref.findFirstOrThrow({
            where: {
              action_type_code: ACTION_TYPE_CODES.CAT1ASSESS,
              action_code: action.actionCode,
            },
            select: {
              action_type_action_xref_guid: true,
              action_code: true,
              action_type_code: true,
            },
          });

          await db.action.updateMany({
            where: {
              assessment_guid: model.assessment.id,
              action_type_action_xref_guid: actionTypeActionXref.action_type_action_xref_guid,
            },
            data: {
              actor_guid: action.actor,
              action_date: action.date,
              active_ind: action.activeIndicator,
              update_user_id: model.updateUserId,
              update_utc_timestamp: new Date(),
            },
          });
        }
      });

      complaintOutcomeOutput = await this.findOne(model.complaintOutcomeGuid);
    } catch (exception) {
      throw new GraphQLError("Exception occurred. See server log for details", {});
    }
    return complaintOutcomeOutput;
  }

  //--------------------------
  //-- prevention & education
  //--------------------------

  findPreventions = async (complaintOutcomeGuid: string): Promise<Array<Prevention>> => {
    const queryResult = await this.prisma.prevention_education.findMany({
      where: {
        complaint_outcome_guid: complaintOutcomeGuid,
        active_ind: true,
      },
      select: {
        prevention_education_guid: true,
        outcome_agency_code: true,
        update_user_id: true,
        update_utc_timestamp: true,
        action: {
          select: {
            action_guid: true,
            actor_guid: true,
            action_date: true,
            active_ind: true,
            action_type_action_xref: {
              select: {
                display_order: true,
                action_code_action_type_action_xref_action_codeToaction_code: {
                  select: {
                    action_code: true,
                    short_description: true,
                    long_description: true,
                    active_ind: true,
                  },
                  // where active_ind is true
                },
              },
            },
          },
          orderBy: {
            action_date: "asc",
          },
        },
      },
      orderBy: {
        create_utc_timestamp: "asc",
      },
    });

    const preventions: Array<Prevention> = queryResult.map((prevention) => {
      return {
        id: prevention.prevention_education_guid,
        outcomeAgencyCode: prevention.outcome_agency_code,
        actions: prevention.action
          .sort(
            (left, right) => left.action_type_action_xref.display_order - right.action_type_action_xref.display_order,
          )
          .map((action) => {
            return {
              actionId: action.action_guid,
              actor: action.actor_guid,
              date: action.action_date,
              activeIndicator: action.active_ind,
              actionCode:
                action.action_type_action_xref.action_code_action_type_action_xref_action_codeToaction_code.action_code,
              shortDescription:
                action.action_type_action_xref.action_code_action_type_action_xref_action_codeToaction_code
                  .short_description,
              longDescription:
                action.action_type_action_xref.action_code_action_type_action_xref_action_codeToaction_code
                  .long_description,
            };
          }),
      };
    });
    return preventions;
  };

  async createPrevention(model: CreatePreventionInput): Promise<ComplaintOutcome> {
    let complaintOutcomeGuid: string;
    let complaintOutcomeOutput: ComplaintOutcome;

    await this.prisma.$transaction(async (db) => {
      let case_file: any;

      if (!model.complaintOutcomeGuid) {
        case_file = await db.complaint_outcome.create({
          data: {
            agency_code: {
              connect: {
                outcome_agency_code: model.outcomeAgencyCode,
              },
            },
            complaint_identifier: model.complaintId,
            create_user_id: model.createUserId,
            create_utc_timestamp: new Date(),
          },
        });

        complaintOutcomeGuid = case_file.complaint_outcome_guid;

        this.logger.log(`Case file created with complaint_outcome_guid: ${complaintOutcomeGuid}`);
        this.logger.log(`Lead created with lead_identifier: ${case_file.complaint_identifier}`);
      } else {
        complaintOutcomeGuid = model.complaintOutcomeGuid;
      }

      this.logger.log(`Creating prevention for case file: ${complaintOutcomeGuid}`);

      const prevention = await db.prevention_education.create({
        data: {
          outcome_agency_code: model.outcomeAgencyCode,
          complaint_outcome_guid: complaintOutcomeGuid,
          create_user_id: model.createUserId,
          create_utc_timestamp: new Date(),
        },
      });

      this.logger.log(`Creating actions for prevention: ${prevention.prevention_education_guid}`);

      //Validate that the actions passed in are all valid
      let action_codes_objects = await this.prisma.action_type_action_xref.findMany({
        where: {
          action_type_code: {
            in: [ACTION_TYPE_CODES.COSPRVANDEDU, ACTION_TYPE_CODES.PRKPRVANDEDU],
          },
        },
        select: { action_code: true },
      });
      let action_codes: Array<string> = [];
      for (const action_code_object of action_codes_objects) {
        action_codes.push(action_code_object.action_code);
      }
      for (const action of model.prevention.actions) {
        if (action_codes.indexOf(action.actionCode) === -1) {
          throw new Error("Some action code values where not passed from the client");
        }
      }

      for (const action of model.prevention.actions) {
        let actionTypeActionXref = await this.prisma.action_type_action_xref.findFirstOrThrow({
          where: {
            action_code: action.actionCode,
            action_type_code:
              model.outcomeAgencyCode === "COS" ? ACTION_TYPE_CODES.COSPRVANDEDU : ACTION_TYPE_CODES.PRKPRVANDEDU,
          },
          select: {
            action_type_action_xref_guid: true,
          },
        });
        await db.action.create({
          data: {
            complaint_outcome_guid: complaintOutcomeGuid,
            prevention_education_guid: prevention.prevention_education_guid,
            action_type_action_xref_guid: actionTypeActionXref.action_type_action_xref_guid,
            actor_guid: action.actor,
            action_date: action.date,
            active_ind: action.activeIndicator,
            create_user_id: model.createUserId,
            create_utc_timestamp: new Date(),
          },
        });
      }
    });
    complaintOutcomeOutput = await this.findOne(complaintOutcomeGuid);
    return complaintOutcomeOutput;
  }

  async updatePrevention(model: UpdatePreventionInput) {
    let complaintOutcomeOutput: ComplaintOutcome;

    await this.prisma.$transaction(async (db) => {
      await db.prevention_education.update({
        where: { prevention_education_guid: model.prevention.id },
        data: {
          update_user_id: model.updateUserId,
          update_utc_timestamp: new Date(),
        },
      });

      for (const action of model.prevention.actions) {
        let actionTypeActionXref = await this.prisma.action_type_action_xref.findFirstOrThrow({
          where: {
            action_code: action.actionCode,
            action_type_code:
              model.outcomeAgencyCode === "COS" ? ACTION_TYPE_CODES.COSPRVANDEDU : ACTION_TYPE_CODES.PRKPRVANDEDU,
          },
          select: {
            action_type_action_xref_guid: true,
            action_code: true,
            action_type_code: true,
          },
        });

        let actionXref = await this.prisma.action.findFirst({
          where: {
            action_type_action_xref_guid: actionTypeActionXref.action_type_action_xref_guid,
            complaint_outcome_guid: model.complaintOutcomeGuid,
            prevention_education_guid: model.prevention.id,
          },
          select: {
            action_type_action_xref_guid: true,
          },
        });

        if (actionXref) {
          await db.action.updateMany({
            where: {
              complaint_outcome_guid: model.complaintOutcomeGuid,
              prevention_education_guid: model.prevention.id,
              action_type_action_xref_guid: actionTypeActionXref.action_type_action_xref_guid,
            },
            data: {
              actor_guid: action.actor,
              action_date: action.date,
              active_ind: action.activeIndicator,
              update_user_id: model.updateUserId,
              update_utc_timestamp: new Date(),
            },
          });
        } else {
          await db.action.create({
            data: {
              complaint_outcome_guid: model.complaintOutcomeGuid,
              prevention_education_guid: model.prevention.id,
              action_type_action_xref_guid: actionTypeActionXref.action_type_action_xref_guid,
              actor_guid: action.actor,
              action_date: action.date,
              active_ind: action.activeIndicator,
              create_user_id: model.updateUserId,
              create_utc_timestamp: new Date(),
            },
          });
        }
      }
      let preventionCount: number = model.prevention.actions.length;
      if (preventionCount === 0) {
        await db.action.updateMany({
          where: { complaint_outcome_guid: model.complaintOutcomeGuid },
          data: { active_ind: false },
        });
      }
    });
    complaintOutcomeOutput = await this.findOne(model.complaintOutcomeGuid);
    return complaintOutcomeOutput;
  }

  async deletePrevention(model: DeletePreventionInput) {
    let complaintOutcomeOutput: ComplaintOutcome;
    let complaintOutcomeGuid: string;
    await this.prisma.$transaction(async (db) => {
      let caseFile = await this.findOneByLeadId(model.complaintId);
      complaintOutcomeGuid = caseFile.complaintOutcomeGuid;

      await db.action.updateMany({
        where: {
          prevention_education_guid: model.id,
          complaint_outcome_guid: complaintOutcomeGuid,
        },
        data: {
          active_ind: false,
          update_user_id: model.updateUserId,
          update_utc_timestamp: new Date(),
        },
      });

      await db.prevention_education.update({
        where: { prevention_education_guid: model.id },
        data: {
          active_ind: false,
          update_user_id: model.updateUserId,
          update_utc_timestamp: new Date(),
        },
      });
    });
    complaintOutcomeOutput = await this.findOne(complaintOutcomeGuid);
    return complaintOutcomeOutput;
  }

  //------------------
  //-- file review
  //------------------
  async createReview(reviewInput: ReviewInput): Promise<ComplaintOutcome> {
    const _createReviewCase = async (
      db: Omit<
        PrismaClient<Prisma.PrismaClientOptions, never, DefaultArgs>,
        "$connect" | "$disconnect" | "$on" | "$transaction" | "$use" | "$extends"
      >,
      reviewInput: ReviewInput,
    ): Promise<string> => {
      try {
        let caseFileId: string;
        await this.prisma.$transaction(async (db) => {
          //create case
          const caseFile = await db.complaint_outcome.create({
            data: {
              agency_code: {
                connect: {
                  outcome_agency_code: reviewInput.outcomeAgencyCode,
                },
              },
              complaint_identifier: reviewInput.complaintId,
              create_user_id: reviewInput.userId,
              create_utc_timestamp: new Date(),
              review_required_ind: true,
            },
          });
          caseFileId = caseFile.complaint_outcome_guid;
        });
        return caseFileId;
      } catch (err) {
        this.logger.error(err);
        throw new GraphQLError("Error in createReviewCase", {});
      }
    };

    const _createReviewComplete = async (
      db: Omit<
        PrismaClient<Prisma.PrismaClientOptions, never, DefaultArgs>,
        "$connect" | "$disconnect" | "$on" | "$transaction" | "$use" | "$extends"
      >,
      reviewInput: ReviewInput,
    ): Promise<string> => {
      try {
        let actionId: string;

        let actionTypeActionXref = await this.prisma.action_type_action_xref.findFirstOrThrow({
          where: {
            action_type_code: ACTION_TYPE_CODES.CASEACTION,
            action_code: ACTION_CODES.COMPLTREVW,
          },
          select: {
            action_type_action_xref_guid: true,
          },
        });
        const reviewAction = await db.action.create({
          data: {
            complaint_outcome_guid: reviewInput.complaintOutcomeGuid,
            action_type_action_xref_guid: actionTypeActionXref.action_type_action_xref_guid,
            actor_guid: reviewInput.reviewComplete.actor,
            action_date: reviewInput.reviewComplete.date,
            active_ind: true, //True: review complete, false: review not complete
            create_user_id: reviewInput.userId,
            create_utc_timestamp: new Date(),
          },
        });
        return reviewAction.action_guid;
      } catch (err) {
        this.logger.error(err);
        throw new GraphQLError("Error in createReviewComplete", {});
      }
    };

    try {
      let result = {
        ...reviewInput,
      };

      await this.prisma.$transaction(async (db) => {
        //If case is not exists -> create case
        if (!reviewInput.complaintOutcomeGuid) {
          const caseFileId = await _createReviewCase(db, reviewInput);
          result.complaintOutcomeGuid = caseFileId;
          result.isReviewRequired = true;
        }
        //Else update review_required_ind
        else {
          const caseFile = await db.complaint_outcome.update({
            where: {
              complaint_outcome_guid: reviewInput.complaintOutcomeGuid,
            },
            data: {
              review_required_ind: reviewInput.isReviewRequired,
            },
          });
          result.isReviewRequired = caseFile.review_required_ind;

          //if isReviewRequired && reviewComplete, create reviewComplete action
          if (reviewInput.isReviewRequired && reviewInput.reviewComplete && !reviewInput.reviewComplete.actionId) {
            const actionId = await _createReviewComplete(db, reviewInput);
            reviewInput.reviewComplete.actionId = actionId;
          }
        }
      });
      return result;
    } catch (err) {
      this.logger.error(err);
      throw new GraphQLError("Error in createReview", {});
    }
  }

  async updateReview(reviewInput: ReviewInput): Promise<ComplaintOutcome> {
    try {
      const { isReviewRequired, complaintOutcomeGuid, reviewComplete, complaintId } = reviewInput;
      await this.prisma.$transaction(async (db) => {
        // Update review_required_ind in table case_file
        await db.complaint_outcome.update({
          where: {
            complaint_outcome_guid: complaintOutcomeGuid,
          },
          data: {
            review_required_ind: isReviewRequired,
          },
        });

        // If reviewComplete is provided, update the corresponding action
        if (reviewComplete && reviewComplete.actionId) {
          const { actionId, activeIndicator } = reviewComplete;

          await db.action.update({
            where: {
              action_guid: actionId,
            },
            data: {
              active_ind: activeIndicator,
            },
          });
        }
      });

      return this.findOneByLeadId(complaintId);
    } catch (err) {
      this.logger.error(err);
      throw new GraphQLError("Error in updateReview", {});
    }
  }

  //----------------------
  //--  notes
  //----------------------

  findCaseNotes = async (complaintOutcomeGuid: string): Promise<Array<Note>> => {
    const queryResult = await this.prisma.case_note.findMany({
      where: {
        complaint_outcome_guid: complaintOutcomeGuid,
        active_ind: true,
      },
      select: {
        case_note_guid: true,
        case_note: true,
        update_user_id: true,
        update_utc_timestamp: true,
        outcome_agency_code: true,
        action: {
          select: {
            action_guid: true,
            actor_guid: true,
            action_date: true,
            active_ind: true,
            action_type_action_xref: {
              select: {
                action_code_action_type_action_xref_action_codeToaction_code: {
                  select: {
                    action_code: true,
                    short_description: true,
                    long_description: true,
                    active_ind: true,
                  },
                  // where active_ind is true
                },
              },
            },
          },
          orderBy: {
            action_date: "asc",
          },
        },
      },
      orderBy: {
        create_utc_timestamp: "asc",
      },
    });

    const notes: Array<Note> = queryResult.map((note) => {
      return {
        id: note.case_note_guid,
        note: note.case_note,
        outcomeAgencyCode: note.outcome_agency_code,
        actions: note.action.map((action) => {
          return {
            actionId: action.action_guid,
            actor: action.actor_guid,
            date: action.action_date,
            activeIndicator: action.active_ind,
            actionCode:
              action.action_type_action_xref.action_code_action_type_action_xref_action_codeToaction_code.action_code,
            shortDescription:
              action.action_type_action_xref.action_code_action_type_action_xref_action_codeToaction_code
                .short_description,
            longDescription:
              action.action_type_action_xref.action_code_action_type_action_xref_action_codeToaction_code
                .long_description,
          };
        }),
      };
    });
    return notes;
  };

  createNote = async (model: CreateNoteInput): Promise<ComplaintOutcome> => {
    let complaintOutcomeGuid = "";

    try {
      let result: ComplaintOutcome;

      await this.prisma.$transaction(async (db) => {
        const { complaintId, note, createUserId, actor, outcomeAgencyCode } = model;
        const caseFile = await this.findOneByLeadId(complaintId);

        if (caseFile && caseFile?.complaintOutcomeGuid) {
          complaintOutcomeGuid = caseFile.complaintOutcomeGuid;
        } else {
          const caseInput: CreateComplaintOutcomeInput = { ...model };
          complaintOutcomeGuid = await this.createComplaintOutcome(db, caseInput);
        }

        await this._upsertNote(db, complaintOutcomeGuid, note, actor, createUserId, outcomeAgencyCode);
      });

      result = await this.findOne(complaintOutcomeGuid);

      return result;
    } catch (error) {
      this.logger.error("exception: unable to create  note", error);
      throw new GraphQLError("Exception occurred. See server log for details", {});
    }
  };

  updateNote = async (model: UpdateNoteInput): Promise<ComplaintOutcome> => {
    const { complaintOutcomeGuid, id, actor, note, updateUserId } = model;

    try {
      let result: ComplaintOutcome;

      await this.prisma.$transaction(async (db) => {
        await this._upsertNote(db, complaintOutcomeGuid, note, actor, updateUserId, null, id);

        // Return updated case, not just the note
        result = await this.findOne(complaintOutcomeGuid);
      });

      return result;
    } catch (error) {
      this.logger.error("exception: unable to update  note", error);
      throw new GraphQLError("Exception occurred. See server log for details", {});
    }
  };

  private readonly _upsertNote = async (
    db: Omit<
      PrismaClient<Prisma.PrismaClientOptions, never, DefaultArgs>,
      "$connect" | "$disconnect" | "$on" | "$transaction" | "$use" | "$extends"
    >,
    complaintOutcomeGuid: string,
    note: string,
    actor: string,
    userId: string,
    agencyCode: string,
    id: string = "",
  ): Promise<string> => {
    const _getNoteActionXref = async (): Promise<string> => {
      const query = await this.prisma.action_type_action_xref.findFirst({
        where: {
          action_code: ACTION_CODES.UPDATENOTE,
          action_type_code: ACTION_TYPE_CODES.CASEACTION,
        },
        select: {
          action_type_action_xref_guid: true,
        },
      });

      return query.action_type_action_xref_guid;
    };

    try {
      const current = new Date();
      const xrefId = await _getNoteActionXref();

      // Upsert the note
      if (!id) {
        const case_note = await db.case_note.create({
          data: {
            complaint_outcome_guid: complaintOutcomeGuid,
            case_note: note,
            create_user_id: userId,
            create_utc_timestamp: current,
            update_user_id: userId,
            update_utc_timestamp: current,
            outcome_agency_code: agencyCode,
          },
        });
        id = case_note.case_note_guid;
      } else {
        await db.case_note.update({
          where: {
            case_note_guid: id,
          },
          data: {
            case_note: note,
            update_user_id: userId,
            update_utc_timestamp: current,
          },
        });
      }

      // Create the update note action record
      await db.action.create({
        data: {
          complaint_outcome_guid: complaintOutcomeGuid,
          case_note_guid: id,
          action_type_action_xref_guid: xrefId,
          actor_guid: actor,
          active_ind: true,
          action_date: current,
          create_user_id: userId,
          create_utc_timestamp: current,
          update_user_id: userId,
          update_utc_timestamp: current,
        },
      });
      return id;
    } catch (error) {
      this.logger.error("exception: unable to create  note", error);
      throw new GraphQLError("Exception occurred. See server log for details", {});
    }
  };

  deleteNote = async (model: DeleteNoteInput): Promise<ComplaintOutcome> => {
    const _getNoteActionXref = async (): Promise<string> => {
      const query = await this.prisma.action_type_action_xref.findFirst({
        where: {
          action_code: ACTION_CODES.UPDATENOTE,
          action_type_code: ACTION_TYPE_CODES.CASEACTION,
        },
        select: {
          action_type_action_xref_guid: true,
        },
      });

      return query.action_type_action_xref_guid;
    };

    try {
      const { complaintOutcomeGuid, id, updateUserId: userId, actor } = model;
      const current = new Date();
      const xrefId = await _getNoteActionXref();

      await this.prisma.$transaction(async (db) => {
        if (!complaintOutcomeGuid) {
          throw new Error(`Unable to delete note for note id: ${id}`);
        }

        await db.case_note.update({
          where: {
            case_note_guid: id,
          },
          data: {
            active_ind: false,
            update_user_id: userId,
            update_utc_timestamp: current,
          },
        });

        await db.action.create({
          data: {
            complaint_outcome_guid: complaintOutcomeGuid,
            case_note_guid: id,
            action_type_action_xref_guid: xrefId,
            actor_guid: actor,
            active_ind: true,
            action_date: current,
            create_user_id: userId,
            create_utc_timestamp: current,
            update_user_id: userId,
            update_utc_timestamp: current,
          },
        });
      });

      return await this.findOne(complaintOutcomeGuid);
    } catch (error) {
      this.logger.error("exception: unable to delete  note", error);
      throw new GraphQLError("Exception occurred. See server log for details", {});
    }
  };

  //------------------
  //-- equipment
  //------------------
  async createEquipment(createEquipmentInput: CreateComplaintOutcomeInput): Promise<ComplaintOutcome> {
    let complaintOutcomeOutput: ComplaintOutcome;
    let complaintOutcomeGuid;
    try {
      await this.prisma.$transaction(async (db) => {
        let caseFile = await this.findOneByLeadId(createEquipmentInput.complaintId);

        if (caseFile?.complaintOutcomeGuid) {
          complaintOutcomeGuid = caseFile.complaintOutcomeGuid;
        } else {
          complaintOutcomeGuid = await this.createComplaintOutcome(db, createEquipmentInput);
        }

        const createdDate = new Date();

        const newEquipmentJSON = {
          active_ind: true,
          create_user_id: createEquipmentInput.createUserId,
          create_utc_timestamp: createdDate,
          update_user_id: createEquipmentInput.createUserId,
          update_utc_timestamp: createdDate,
          equipment_code: createEquipmentInput.equipment[0].typeCode,
          equipment_location_desc: createEquipmentInput.equipment[0].address,
          was_animal_captured: createEquipmentInput.equipment[0].wasAnimalCaptured,
          quantity: createEquipmentInput.equipment[0].quantity,
          // exclude equipment_geometry_point because prisma can't handle this =gracefully
        };

        this.logger.debug(`Creating equipment: ${JSON.stringify(newEquipmentJSON)}`);

        // create the equipment record
        const newEquipment = await db.equipment.create({
          data: newEquipmentJSON,
        });

        // constructing a geometry type to update the equipment record with
        // prisma doesn't handle geometry types, so we have to create this as a string and insert it
        const xCoordinate = createEquipmentInput.equipment[0].xCoordinate;
        const yCoordinate = createEquipmentInput.equipment[0].yCoordinate;

        if (xCoordinate && yCoordinate) {
          const pointWKT = `POINT(${xCoordinate} ${yCoordinate})`;

          // update the equipment record to set the coordinates
          // using raw query because prisma can't handle the awesomeness
          await this.prisma.$executeRaw`SET search_path TO public, complaint_outcome`;
          const geometryUpdateQuery = `
          UPDATE complaint_outcome.equipment
          SET equipment_geometry_point = public.ST_GeomFromText($1, 4326)
          WHERE equipment_guid = $2::uuid;
        `;

          // Execute the update with safe parameter binding
          try {
            await db.$executeRawUnsafe(
              geometryUpdateQuery,
              pointWKT, // WKT string for the POINT
              newEquipment.equipment_guid, // UUID of the equipment
            );
            this.logger.debug(`Updated geometry for equipment GUID: ${newEquipment.equipment_guid}`);
          } catch (error) {
            this.logger.error("An error occurred during the geometry update:", error);
            throw new Error("Failed to update equipment geometry due to a database error.");
          }
        }

        this.logger.debug(`New Equipment: ${JSON.stringify(newEquipment)}`);

        // we can only create one equipment at a time, so just grab the first one.
        const equipmentDetailsInstance = createEquipmentInput.equipment[0];
        const actions = equipmentDetailsInstance.actions.filter((action) => action.activeIndicator === true);

        // get the actions associated with the creation of the equipment.  We may be setting an equipment, or setting and removing an equipment
        for (const action of actions) {
          let actionTypeActionXref = await db.action_type_action_xref.findFirstOrThrow({
            where: {
              action_type_code: ACTION_TYPE_CODES.EQUIPMENT,
              action_code: action.actionCode,
            },
            select: {
              action_type_action_xref_guid: true,
            },
          });

          // create the action records (this may either be setting an equipment or removing an equipment)
          const data = {
            complaint_outcome_guid: complaintOutcomeGuid,
            action_type_action_xref_guid: actionTypeActionXref.action_type_action_xref_guid,
            actor_guid: action.actor,
            action_date: action.date,
            active_ind: action.activeIndicator,
            create_user_id: createEquipmentInput.createUserId,
            create_utc_timestamp: new Date(),
            equipment_guid: newEquipment.equipment_guid,
          };

          this.logger.debug(`Creating new action record for equipment: ${JSON.stringify(data)}`);
          await db.action.create({
            data: data,
          });
        }
      });
      complaintOutcomeOutput = await this.findOne(complaintOutcomeGuid);
    } catch (exception) {
      this.logger.error("An error occurred during equipment creation:", exception);
      throw new GraphQLError("An error occurred during equipment creation. See server log for details");
    }
    return complaintOutcomeOutput;
  }

  async updateEquipment(updateEquipmentInput: UpdateEquipmentInput): Promise<ComplaintOutcome> {
    let complaintOutcomeOutput: ComplaintOutcome;

    let caseFile = await this.findOneByLeadId(updateEquipmentInput.complaintId);

    try {
      await this.prisma.$transaction(async (db) => {
        // we're updating a single equipment record, so only one equipment was provided.
        const equipmentRecord = updateEquipmentInput.equipment[0];
        const equipmentGuid = equipmentRecord.id;
        const existingEquipment = await db.equipment.findUnique({
          where: { equipment_guid: equipmentGuid },
        });

        if (!existingEquipment) {
          throw new Error("Equipment not found");
        }

        const data = {
          equipment_code: equipmentRecord.typeCode,
          equipment_location_desc: equipmentRecord.address,
          active_ind: equipmentRecord.actionEquipmentTypeActiveIndicator,
          was_animal_captured: equipmentRecord.wasAnimalCaptured,
          quantity: equipmentRecord.quantity,
        };

        // Update the equipment record
        await db.equipment.update({
          where: { equipment_guid: equipmentGuid },
          data: data,
        });

        // constructing a geometry type to update the equipment record with
        // prisma doesn't handle geometry types, so we have to create this as a string and insert it
        const xCoordinate = updateEquipmentInput.equipment[0].xCoordinate;
        const yCoordinate = updateEquipmentInput.equipment[0].yCoordinate;
        const pointWKT = xCoordinate && yCoordinate ? `POINT(${xCoordinate} ${yCoordinate})` : null;

        // update the equipment record to set the coordinates
        // using raw query because prisma can't handle the awesomeness
        await this.prisma.$executeRaw`SET search_path TO public, complaint_outcome`;
        const geometryUpdateQuery = `
          UPDATE complaint_outcome.equipment
          SET equipment_geometry_point = public.ST_GeomFromText($1, 4326)
          WHERE equipment_guid = $2::uuid;
        `;

        // Execute the update with safe parameter binding
        try {
          await db.$executeRawUnsafe(
            geometryUpdateQuery,
            pointWKT, // WKT string for the POINT
            equipmentGuid, // UUID of the equipment
          );
          this.logger.debug(`Updated geometry for equipment GUID: ${equipmentGuid}`);
        } catch (error) {
          this.logger.error("An error occurred during the geometry update:", error);
          throw new Error("Failed to update equipment geometry due to a database error.");
        }

        // Check for updated or added actions
        const actions = equipmentRecord.actions;
        for (const action of actions) {
          if (action.actionGuid) {
            this.logger.debug(`Updating equipment action: ${JSON.stringify(action)}`);
            // If actionGuid exists, it means the action already exists and needs to be updated
            await db.action.update({
              where: { action_guid: action.actionGuid },
              data: {
                action_date: action.date,
                actor_guid: action.actor,
                update_utc_timestamp: new Date(),
              },
            });
          } else {
            // we're adding a new action, so find the action type action xref needed for this
            this.logger.debug(`Creating new equipment action: ${JSON.stringify(action)}`);
            let actionTypeActionXref = await db.action_type_action_xref.findFirstOrThrow({
              where: {
                action_type_code: ACTION_TYPE_CODES.EQUIPMENT,
                action_code: action.actionCode,
              },
              select: {
                action_type_action_xref_guid: true,
              },
            });

            this.logger.debug(`Found action xref`);
            const complaintOutcomeGuid = caseFile.complaintOutcomeGuid;
            if (action.actor && action.date) {
              // create the action records (this may either be setting an equipment or removing an equipment)
              const data = {
                complaint_outcome_guid: complaintOutcomeGuid,
                action_type_action_xref_guid: actionTypeActionXref.action_type_action_xref_guid,
                actor_guid: action.actor,
                action_date: action.date,
                active_ind: action.activeIndicator,
                create_user_id: updateEquipmentInput.updateUserId,
                create_utc_timestamp: new Date(),
                equipment_guid: equipmentGuid,
              };

              this.logger.debug(`Adding new equipment action as part of an update: ${JSON.stringify(data)}`);

              await db.action.create({
                data: data,
              });
            } else if (action.actionCode == "REMEQUIPMT" && action.activeIndicator === false) {
              // user tries to clear equipment removal info
              this.logger.debug(
                `Inactivate equipment removal action for complaint_outcome_guid: ${complaintOutcomeGuid}`,
              );
              await db.action.updateMany({
                where: {
                  complaint_outcome_guid: complaintOutcomeGuid,
                  action_type_action_xref_guid: actionTypeActionXref.action_type_action_xref_guid,
                },
                data: {
                  active_ind: false,
                  update_utc_timestamp: new Date(),
                  update_user_id: updateEquipmentInput.updateUserId,
                },
              });
            }
          }
        }
      });

      const complaintOutcomeGuid = caseFile.complaintOutcomeGuid;
      complaintOutcomeOutput = await this.findOne(complaintOutcomeGuid);
    } catch (error) {
      this.logger.error("An error occurred during equipment update:", error);
      throw new GraphQLError("An error occurred during equipment update. See server log for details", error);
    }
    return complaintOutcomeOutput;
  }

  async deleteEquipment(deleteEquipmentInput: DeleteEquipmentInput): Promise<boolean> {
    try {
      // Find the equipment record by its ID
      const equipment = await this.prisma.equipment.findUnique({
        where: {
          equipment_guid: deleteEquipmentInput.id,
        },
      });

      if (!equipment) {
        throw new Error(`Equipment with ID ${deleteEquipmentInput.id} not found.`);
      }

      // Update the active_ind field to false
      await this.prisma.equipment.update({
        where: {
          equipment_guid: deleteEquipmentInput.id,
        },
        data: {
          active_ind: false,
          update_user_id: deleteEquipmentInput.updateUserId,
          update_utc_timestamp: new Date(),
        },
      });

      this.logger.debug(`Equipment with ID ${deleteEquipmentInput.id} has been updated successfully.`);
      return true;
    } catch (error) {
      this.logger.error("Error deleting equipment:", error);
      return false;
    } finally {
      await this.prisma.$disconnect();
    }
  }

  // find all equipment records, and their respective actions, for a given case
  // Since we want to list the equipment related to a case, rather than the actions for a case, which may contain equipment, let's
  // transform the actions with equipment to equipment with actions.
  private findEquipmentDetails = async (complaintOutcomeGuid: string): Promise<Equipment[]> => {
    const actions = await this.prisma.action.findMany({
      where: { complaint_outcome_guid: complaintOutcomeGuid },
      select: {
        action_type_action_xref_guid: true,
        action_guid: true,
        actor_guid: true,
        action_date: true,
        active_ind: true,
        equipment: {
          select: {
            equipment_guid: true,
            active_ind: true,
            equipment_code: true,
            equipment_location_desc: true,
            create_utc_timestamp: true,
            was_animal_captured: true,
            quantity: true,
            equipment_code_equipment_equipment_codeToequipment_code: {
              select: {
                short_description: true,
              },
            },
          },
        },
      },
    });

    // Initialize a map to hold equipment details keyed by equipment_guid
    const equipmentDetailsMap = new Map();

    // get all the action codes, we're looking for the action codes matching the action performed on the equipment
    const actionCodes = await this.prisma.action_type_action_xref.findMany({
      where: {
        action_type_action_xref_guid: {
          in: actions.map((item) => item.action_type_action_xref_guid),
        },
      },
      select: {
        action_code: true,
        action_type_action_xref_guid: true,
        action_code_action_type_action_xref_action_codeToaction_code: {
          select: {
            short_description: true,
            long_description: true,
            active_ind: true,
          },
        },
      },
    });

    // construct the equipmentDetails list
    for (const action of actions.filter((record) => record.active_ind === true)) {
      const equipment = action.equipment;

      // get the action xref for the action
      let actionData = actionCodes.find(
        (element) => element.action_type_action_xref_guid === action.action_type_action_xref_guid,
      );

      if (equipment && equipment.active_ind) {
        // prisma doesn't support the geometry type, for now, it's just treated as a string
        // Parse the geometry string into a GeoJSON object

        // Correctly setting the search path using Prisma
        await this.prisma.$executeRaw`SET search_path TO public, complaint_outcome`;

        // get the latitude and longitude using a raw query
        const result = await this.prisma.$queryRaw<{ longitude: number; latitude: number }[]>`
            SELECT 
              public.st_x(equipment_geometry_point::geometry) AS longitude, 
              public.st_y(equipment_geometry_point::geometry) AS latitude
            FROM 
              ${Prisma.raw("complaint_outcome.equipment")}
            WHERE 
              equipment_guid = ${Prisma.raw(`'${equipment.equipment_guid}'::uuid`)}
          `;

        const { longitude, latitude } = result[0];

        const longitudeString = longitude?.toString() ?? null;
        const latitudeString = latitude?.toString() ?? null;
        const create_utc_timestamp = equipment.create_utc_timestamp;

        let equipmentDetail =
          equipmentDetailsMap.get(equipment.equipment_guid) ||
          ({
            id: equipment.equipment_guid,
            typeCode: equipment.equipment_code,
            typeDescription: equipment.equipment_code_equipment_equipment_codeToequipment_code.short_description,
            activeIndicator: equipment.active_ind,
            address: equipment.equipment_location_desc,
            xCoordinate: longitudeString,
            yCoordinate: latitudeString,
            createDate: create_utc_timestamp,
            actions: [],
            wasAnimalCaptured: equipment.was_animal_captured,
            quantity: equipment.quantity,
          } as Equipment);

        // Append the action to this equipment's list of actions
        equipmentDetail.actions.push({
          actionId: action.action_guid,
          actor: action.actor_guid,
          date: action.action_date,
          activeIndicator: action.active_ind,
          actionCode: actionData.action_code,
        });

        equipmentDetailsMap.set(equipment.equipment_guid, equipmentDetail);
      }
    }
    const equipmentDetails = Array.from(equipmentDetailsMap.values()) as Equipment[];

    // Sort the equipmentDetails by createDate in ascending order
    equipmentDetails.sort((a, b) => {
      return new Date(a.createDate).getTime() - new Date(b.createDate).getTime();
    });

    return equipmentDetails;
  };

  //-- get all of the subjects (outcome animal) for the case files, this can be wildlife as well
  //-- as people <future state>
  private _getCaseFileSubjects = async (query: SubjectQueryResult): Promise<Wildlife[]> => {
    let result: Array<Wildlife>;

    if (query?.wildlife) {
      const { wildlife } = query;

      result = wildlife
        .sort((a, b) => a.create_utc_timestamp.getTime() - b.create_utc_timestamp.getTime())
        .map((item, idx) => {
          const {
            wildlife_guid: id,
            species_code: species,
            sex_code_wildlife_sex_codeTosex_code: sexObject,
            age_code_wildlife_age_codeToage_code: ageObject,
            threat_level_code_wildlife_threat_level_codeTothreat_level_code: categoryLevelObject,
            identifying_features: identifyingFeatures,
            hwcr_outcome_code_wildlife_hwcr_outcome_codeTohwcr_outcome_code: outcomeObject,
            hwcr_outcome_actioned_by_code_wildlife_hwcr_outcome_actioned_by_codeTohwcr_outcome_actioned_by_code:
              actionedByObject,
            ear_tag,
            drug_administered,
            action,
          } = item;

          const sex = sexObject?.sex_code;
          const sexDescription = sexObject?.short_description;

          const age = ageObject?.age_code;
          const ageDescription = ageObject?.short_description;

          const categoryLevel = categoryLevelObject?.threat_level_code;
          const categoryLevelDescription = categoryLevelObject?.short_description;

          const outcome = outcomeObject?.hwcr_outcome_code;
          const outcomeDescription = outcomeObject?.short_description;

          const outcomeActionedBy = actionedByObject?.hwcr_outcome_actioned_by_code;
          const outcomeActionedByDescription = actionedByObject?.short_description;

          const tags = ear_tag
            .sort((a, b) => a.create_utc_timestamp.getTime() - b.create_utc_timestamp.getTime())
            .map(
              (
                { ear_tag_guid: id, ear_code_ear_tag_ear_codeToear_code: earObject, ear_tag_identifier: identifier },
                idx,
              ) => {
                const ear = earObject?.ear_code;
                const earDescription = earObject?.short_description;
                return {
                  id,
                  ear,
                  earDescription,
                  identifier,
                  order: idx + 1,
                };
              },
            );

          const drugs = drug_administered
            .sort((a, b) => a.create_utc_timestamp.getTime() - b.create_utc_timestamp.getTime())
            .map(
              (
                {
                  drug_administered_guid: id,
                  vial_number: vial,
                  drug_code_drug_administered_drug_codeTodrug_code: drugObject,
                  drug_method_code_drug_administered_drug_method_codeTodrug_method_code: drugMethodObject,
                  drug_remaining_outcome_code_drug_administered_drug_remaining_outcome_codeTodrug_remaining_outcome_code:
                    drugRemainingObject,
                  drug_used_amount: amountUsed,
                  additional_comments_text: additionalComments,
                },
                idx,
              ) => {
                const drug = drugObject?.drug_code;
                const drugDescription = drugObject?.short_description;
                const injectionMethod = drugMethodObject?.drug_method_code;
                const injectionMethodDescription = drugMethodObject?.short_description;
                const remainingUse = drugRemainingObject?.drug_remaining_outcome_code;
                const remainingUseDescription = drugRemainingObject?.short_description;
                return {
                  id,
                  vial,
                  drug,
                  drugDescription,
                  amountUsed,
                  injectionMethod,
                  injectionMethodDescription,
                  remainingUse,
                  remainingUseDescription,
                  additionalComments,
                  order: idx + 1,
                };
              },
            );

          const actions = action.map(
            ({ action_guid: actionId, actor_guid: actor, action_date: date, action_type_action_xref: xref }) => {
              //-- the xref contains the action code
              const {
                action_code_action_type_action_xref_action_codeToaction_code: {
                  short_description: shortDescription,
                  long_description: longDescription,
                  active_ind: activeIndicator,
                  action_code: actionCode,
                },
              } = xref;
              return {
                actionId,
                actor,
                activeIndicator,
                actionCode,
                date,
                shortDescription,
                longDescription,
              };
            },
          );

          let record: Wildlife = {
            id,
            species,
            sex,
            sexDescription,
            age,
            ageDescription,
            categoryLevel,
            categoryLevelDescription,
            identifyingFeatures,
            outcome,
            outcomeDescription,
            outcomeActionedBy,
            outcomeActionedByDescription,
            order: idx + 1,
          };

          if (tags && tags.length !== 0) {
            record = { ...record, tags };
          }

          if (drugs && drugs.length !== 0) {
            record = { ...record, drugs };
          }

          if (actions && actions.length !== 0) {
            record = { ...record, actions };
          }

          return record;
        });
    }

    return result;
  };

  //----------------------
  //-- animal outcomes
  //----------------------
  createWildlife = async (model: CreateWildlifeInput): Promise<ComplaintOutcome> => {
    let caseFileId = "";

    //--
    //-- creates a new wildlife record and returns the wildlife_guid
    //--
    const _addWildlife = async (
      db: Omit<
        PrismaClient<Prisma.PrismaClientOptions, never, DefaultArgs>,
        "$connect" | "$disconnect" | "$on" | "$transaction" | "$use" | "$extends"
      >,
      caseId: string,
      wildlife: WildlifeInput,
      userId: string,
    ): Promise<any> => {
      try {
        const { species } = wildlife;

        let record: any = {
          complaint_outcome_guid: caseId,
          species_code: species,
          active_ind: true,
          create_user_id: userId,
          update_user_id: userId,
          create_utc_timestamp: new Date(),
          update_utc_timestamp: new Date(),
        };

        if (wildlife.sex) {
          record = { ...record, sex_code: wildlife.sex };
        }

        if (wildlife.age) {
          record = { ...record, age_code: wildlife.age };
        }

        if (wildlife.categoryLevel) {
          record = { ...record, threat_level_code: wildlife.categoryLevel };
        }

        if (wildlife.identifyingFeatures) {
          record = { ...record, identifying_features: wildlife.identifyingFeatures };
        }

        if (wildlife.outcome) {
          record = { ...record, hwcr_outcome_code: wildlife.outcome };
        }
        if (wildlife.outcomeActionedBy) {
          record = { ...record, hwcr_outcome_actioned_by_code: wildlife.outcomeActionedBy };
        }

        const result = await db.wildlife.create({
          data: record,
        });

        return result?.wildlife_guid;
      } catch (exception) {
        throw new GraphQLError("Exception occurred. See server log for details", exception);
      }
    };

    //--
    //-- creates a new ear-tag record for each item tags collection
    //--
    const _addEarTags = async (
      db: Omit<
        PrismaClient<Prisma.PrismaClientOptions, never, DefaultArgs>,
        "$connect" | "$disconnect" | "$on" | "$transaction" | "$use" | "$extends"
      >,
      wildlifeId: string,
      tags: Array<EarTagInput>,
      userId: string,
    ) => {
      if (tags && tags.length !== 0) {
        try {
          const records = tags.map(({ ear, identifier }) => {
            return {
              wildlife_guid: wildlifeId,
              ear_code: ear,
              ear_tag_identifier: identifier,
              active_ind: true,
              create_user_id: userId,
              update_user_id: userId,
              create_utc_timestamp: new Date(),
              update_utc_timestamp: new Date(),
            };
          });
          let result = await db.ear_tag.createMany({
            data: records,
          });
        } catch (exception) {
          throw new GraphQLError("Exception occurred. See server log for details", exception);
        }
      }
    };

    //--
    //-- creates a new drug-used record for each item in drugs collection
    //--
    const _addDrugsUsed = async (
      db: Omit<
        PrismaClient<Prisma.PrismaClientOptions, never, DefaultArgs>,
        "$connect" | "$disconnect" | "$on" | "$transaction" | "$use" | "$extends"
      >,
      wildlifeId: string,
      drugs: Array<DrugInput>,
      userId: string,
    ) => {
      if (drugs && drugs.length !== 0) {
        try {
          const records = drugs.map(
            ({
              vial: vial_number,
              drug: drug_code,
              amountUsed: drug_used_amount,
              injectionMethod: drug_method_code,

              remainingUse: drug_remaining_outcome_code,
              additionalComments: additional_comments_text,
            }) => {
              return {
                wildlife_guid: wildlifeId,
                drug_code,
                drug_method_code,
                drug_remaining_outcome_code: drug_remaining_outcome_code === "" ? null : drug_remaining_outcome_code,
                vial_number,
                drug_used_amount,
                additional_comments_text,
                active_ind: true,
                create_user_id: userId,
                update_user_id: userId,
                create_utc_timestamp: new Date(),
                update_utc_timestamp: new Date(),
              };
            },
          );
          let result = await db.drug_administered.createMany({
            data: records,
          });
        } catch (error) {
          console.log(`exception: unable to add drug-used for wildlife record: ${wildlifeId}`, error);
          throw new GraphQLError("Exception occurred. See server log for details", error);
        }
      }
    };

    //--
    //-- adds new actions for the wildlife record
    //--
    const _applyActions = async (
      db: Omit<
        PrismaClient<Prisma.PrismaClientOptions, never, DefaultArgs>,
        "$connect" | "$disconnect" | "$on" | "$transaction" | "$use" | "$extends"
      >,
      caseId: string,
      wildlifeId: string,
      actions: Array<WildlifeAction>,
      userId: string,
    ) => {
      if (actions && actions.length !== 0) {
        try {
          const xrefs = await db.action_type_action_xref.findMany({
            where: {
              action_type_code: ACTION_TYPE_CODES.WILDLIFE,
            },
            select: {
              action_type_action_xref_guid: true,
              action_code: true,
            },
          });

          const records = actions.map(({ actor: actor_guid, date: action_date, action }) => {
            const xref = xrefs.find((item) => item.action_code === action);

            return {
              complaint_outcome_guid: caseId,
              wildlife_guid: wildlifeId,
              action_type_action_xref_guid: xref.action_type_action_xref_guid,
              actor_guid,
              action_date,
              active_ind: true,
              create_user_id: userId,
              update_user_id: userId,
              create_utc_timestamp: new Date(),
              update_utc_timestamp: new Date(),
            };
          });
          let result = await db.action.createMany({
            data: records,
          });
        } catch (exception) {
          throw new GraphQLError("Exception occurred. See server log for details", exception);
        }
      }
    };

    try {
      let result: ComplaintOutcome;

      await this.prisma.$transaction(async (db) => {
        const { complaintId, createUserId, wildlife } = model;
        const { tags, drugs, actions } = wildlife;

        const caseFile = await this.findOneByLeadId(complaintId);

        if (caseFile && caseFile?.complaintOutcomeGuid) {
          caseFileId = caseFile.complaintOutcomeGuid;
        } else {
          const caseInput: CreateComplaintOutcomeInput = { ...model };
          caseFileId = await this.createComplaintOutcome(db, caseInput);
        }

        //-- add wildlife items
        const wildlifeId = await _addWildlife(db, caseFileId, wildlife, createUserId);

        if (wildlifeId) {
          //-- create ear-tags, dru-used and action records
          await _addEarTags(db, wildlifeId, tags, createUserId);
          await _addDrugsUsed(db, wildlifeId, drugs, createUserId);
          await _applyActions(db, caseFileId, wildlifeId, actions, createUserId);
        }
      });

      result = await this.findOne(caseFileId);

      return result;
    } catch (error) {
      console.log("exception: unable to create wildlife ", error);
      throw new GraphQLError("Exception occurred. See server log for details", {});
    }
  };

  updateWildlife = async (model: UpdateWildlifeInput): Promise<ComplaintOutcome> => {
    const { complaintOutcomeGuid, updateUserId, wildlife } = model;
    const { id: wildlifeId } = wildlife;

    let result: ComplaintOutcome;
    const current = new Date();

    //--
    //-- apply updates to the base wildlife record
    //--
    const _updateWildlife = async (
      db: Omit<
        PrismaClient<Prisma.PrismaClientOptions, never, DefaultArgs>,
        "$connect" | "$disconnect" | "$on" | "$transaction" | "$use" | "$extends"
      >,
      input: WildlifeInput,
      userId: string,
      date: Date,
    ) => {
      try {
        const { id, species, sex, age, categoryLevel, identifyingFeatures, outcome, outcomeActionedBy } = input;

        //-- create a new data record to update based on the input provided
        let data = {
          species_code: species,
          sex_code: sex || null,
          age_code: age || null,
          threat_level_code: categoryLevel || null,
          identifying_features: identifyingFeatures || null,
          hwcr_outcome_code: outcome || null,
          hwcr_outcome_actioned_by_code: outcomeActionedBy || null,
          update_user_id: userId,
          update_utc_timestamp: date,
        };

        const result = await db.wildlife.update({
          where: { wildlife_guid: id },
          data,
        });

        return result;
      } catch (error) {
        console.log(`exception: unable to update wildlife record: ${wildlifeId}`, error);
        throw new GraphQLError("Exception occurred. See server log for details", {});
      }
    };

    //--
    //-- add, delete and update any ear-tags
    //--
    const _upsertEarTags = async (
      db: Omit<
        PrismaClient<Prisma.PrismaClientOptions, never, DefaultArgs>,
        "$connect" | "$disconnect" | "$on" | "$transaction" | "$use" | "$extends"
      >,
      wildlifeId: string,
      tags: Array<EarTagInput>,
      userId: string,
      date: Date,
    ) => {
      try {
        const current = await db.ear_tag.findMany({
          where: {
            wildlife_guid: wildlifeId,
            active_ind: true,
          },
        });

        //-- if there are no ear-tags add them
        if (!current || (current.length === 0 && tags && tags.length !== 0)) {
          const newTags = tags.map(({ ear: ear_code, identifier: ear_tag_identifier }) => {
            return {
              wildlife_guid: wildlifeId,
              ear_code,
              ear_tag_identifier,
              active_ind: true,
              create_user_id: userId,
              update_user_id: userId,
              create_utc_timestamp: date,
              update_utc_timestamp: date,
            };
          });

          await db.ear_tag.createMany({ data: newTags });
        } else if (current && current.length !== 0 && tags && tags.length !== 0) {
          let updates = [];
          let remove = [];
          let add = [];

          tags.forEach((tag) => {
            const { id } = tag;
            if (current.find((item) => item.ear_tag_guid === id)) {
              updates = [...updates, tag];
            } else if (!current.find((item) => item.ear_tag_guid === id)) {
              add = [...add, tag];
            }
          });

          current.forEach((tag) => {
            const { ear_tag_guid: id } = tag;
            if (!tags.find((item) => item.id === id)) {
              remove = [...remove, tag];
            }
          });

          if (updates.length !== 0) {
            updates.forEach(async ({ id, ear, identifier }) => {
              await db.ear_tag.update({
                where: {
                  ear_tag_guid: id,
                },
                data: {
                  ear_code: ear,
                  ear_tag_identifier: identifier,
                  update_user_id: userId,
                  update_utc_timestamp: date,
                },
              });
            });
          }

          if (remove.length !== 0) {
            remove.forEach(async ({ ear_tag_guid }) => {
              await db.ear_tag.update({
                where: {
                  ear_tag_guid,
                },
                data: {
                  active_ind: false,
                  update_user_id: userId,
                  update_utc_timestamp: date,
                },
              });
            });
          }

          if (add.length !== 0) {
            const newTags = add.map(({ ear: ear_code, identifier: ear_tag_identifier }) => {
              return {
                wildlife_guid: wildlifeId,
                ear_code,
                ear_tag_identifier,
                active_ind: true,
                create_user_id: userId,
                update_user_id: userId,
                create_utc_timestamp: date,
                update_utc_timestamp: date,
              };
            });

            await db.ear_tag.createMany({ data: newTags });
          }
        } else if (current && current.length !== 0 && tags && tags.length === 0) {
          //-- remove any tags that are currently on the wildlife record
          await db.ear_tag.updateMany({
            where: {
              wildlife_guid: wildlifeId,
            },
            data: {
              active_ind: false,
              update_user_id: userId,
              update_utc_timestamp: date,
            },
          });
        }
      } catch (error) {
        console.log(`exception: unable to update ear-tags for wildlife record: ${wildlifeId}`, error);
        throw new GraphQLError("Exception occurred. See server log for details", {});
      }
    };

    //--
    //-- add, delete and update any drugs administered
    //--
    const _upsertDrugs = async (
      db: Omit<
        PrismaClient<Prisma.PrismaClientOptions, never, DefaultArgs>,
        "$connect" | "$disconnect" | "$on" | "$transaction" | "$use" | "$extends"
      >,
      wildlifeId: string,
      drugs: Array<DrugInput>,
      userId: string,
      date: Date,
    ) => {
      try {
        const current = await db.drug_administered.findMany({
          where: {
            wildlife_guid: wildlifeId,
            active_ind: true,
          },
        });

        if (!current || (current.length === 0 && drugs && drugs.length !== 0)) {
          const newDrugs = drugs.map(
            ({
              vial: vial_number,
              drug: drug_code,
              amountUsed: drug_used_amount,
              injectionMethod: drug_method_code,
              remainingUse: drug_remaining_outcome_code,
              additionalComments: additional_comments_text,
            }) => {
              return {
                wildlife_guid: wildlifeId,

                vial_number,
                drug_code,
                drug_used_amount,
                drug_method_code,
                drug_remaining_outcome_code,
                additional_comments_text,

                active_ind: true,
                create_user_id: userId,
                update_user_id: userId,
                create_utc_timestamp: date,
                update_utc_timestamp: date,
              };
            },
          );

          await db.drug_administered.createMany({ data: newDrugs });
        } else if (current && current.length !== 0 && drugs && drugs.length !== 0) {
          let updates = [];
          let remove = [];
          let add = [];

          //-- get find new, updatebale, and deletable drugs
          drugs.forEach((drug) => {
            const { id } = drug;
            if (current.find((item) => item.drug_administered_guid === id)) {
              updates = [...updates, drug];
            } else if (!current.find((item) => item.drug_administered_guid === id)) {
              add = [...add, drug];
            }
          });

          current.forEach((tag) => {
            const { drug_administered_guid: id } = tag;
            if (!drugs.find((item) => item.id === id)) {
              remove = [...remove, tag];
            }
          });

          //-- apply changes
          if (updates.length !== 0) {
            updates.forEach(
              async ({
                id,
                vial: vial_number,
                drug: drug_code,
                amountUsed: drug_used_amount,
                injectionMethod: drug_method_code,
                remainingUse: drug_remaining_outcome_code,
                additionalComments: additional_comments_text,
              }) => {
                drug_remaining_outcome_code = drug_remaining_outcome_code === "" ? null : drug_remaining_outcome_code;
                await db.drug_administered.update({
                  where: {
                    drug_administered_guid: id,
                  },
                  data: {
                    vial_number,
                    drug_code,
                    drug_method_code,
                    drug_remaining_outcome_code,
                    drug_used_amount,
                    additional_comments_text,
                    update_user_id: userId,
                    update_utc_timestamp: date,
                  },
                });
              },
            );
          }

          if (remove.length !== 0) {
            remove.forEach(async ({ drug_administered_guid }) => {
              await db.drug_administered.update({
                where: {
                  drug_administered_guid,
                },
                data: {
                  active_ind: false,
                  update_user_id: userId,
                  update_utc_timestamp: date,
                },
              });
            });
          }

          if (add.length !== 0) {
            const newDrugs = add.map(
              ({
                vial: vial_number,
                drug: drug_code,
                amountUsed: drug_used_amount,
                injectionMethod: drug_method_code,
                remainingUse: drug_remaining_outcome_code,
                additionalComments: additional_comments_text,
              }) => {
                return {
                  wildlife_guid: wildlifeId,

                  vial_number,
                  drug_code,
                  drug_used_amount,
                  drug_method_code,
                  drug_remaining_outcome_code,
                  additional_comments_text,

                  active_ind: true,
                  create_user_id: userId,
                  update_user_id: userId,
                  create_utc_timestamp: date,
                  update_utc_timestamp: date,
                };
              },
            );

            await db.drug_administered.createMany({ data: newDrugs });
          }
        } else if (current && current.length !== 0 && drugs && drugs.length === 0) {
          //-- remove any tags that are currently on the wildlife record
          await db.drug_administered.updateMany({
            where: {
              wildlife_guid: wildlifeId,
            },
            data: {
              active_ind: false,
              update_user_id: userId,
              update_utc_timestamp: date,
            },
          });
        }
      } catch (error) {
        console.log(`exception: unable to update drug-used for wildlife record: ${wildlifeId}`, error);
        throw new GraphQLError("Exception occurred. See server log for details", {});
      }
    };

    //--
    //-- determines what type of action to apply to the actions
    //--
    const _applyAction = async (
      db: Omit<
        PrismaClient<Prisma.PrismaClientOptions, never, DefaultArgs>,
        "$connect" | "$disconnect" | "$on" | "$transaction" | "$use" | "$extends"
      >,
      action: string,
      current: action[],
      incoming: WildlifeAction[],
      xrefs: { action_code: string; action_type_action_xref_guid: string }[],
      complaintOutcomeGuid: string,
      wildlifeId: string,
      userId: string,
      date: Date,
    ) => {
      const reference = xrefs.find((item) => item.action_code === action).action_type_action_xref_guid;

      if (
        current.map((item) => item.action_type_action_xref_guid).includes(reference) &&
        incoming.map((item) => item.action).includes(action)
      ) {
        const source = current.find((item) => item.action_type_action_xref_guid === reference);
        const update = incoming.find((item) => item.action === action);

        await db.action.update({
          where: {
            action_guid: source.action_guid,
          },
          data: {
            actor_guid: update.actor,
            action_date: update.date,
            update_user_id: userId,
            update_utc_timestamp: date,
          },
        });
      } else if (
        !current.map((item) => item.action_type_action_xref_guid).includes(reference) &&
        incoming.map((item) => item.action).includes(action)
      ) {
        const data = incoming.find((item) => item.action === action);

        await db.action.create({
          data: {
            complaint_outcome_guid: complaintOutcomeGuid,
            wildlife_guid: wildlifeId,
            action_type_action_xref_guid: reference,
            actor_guid: data.actor,
            action_date: data.date,
            active_ind: true,
            create_user_id: userId,
            create_utc_timestamp: date,
            update_user_id: userId,
            update_utc_timestamp: date,
          },
        });
      } else if (
        current.map((item) => item.action_type_action_xref_guid).includes(reference) &&
        !incoming.map((item) => item.action).includes(action)
      ) {
        const source = current.find((item) => item.action_type_action_xref_guid === reference);

        await db.action.update({
          where: {
            action_guid: source.action_guid,
          },
          data: {
            active_ind: false,
            update_user_id: userId,
            update_utc_timestamp: date,
          },
        });
      }
    };

    //--
    //-- update the actions for the seelcted wildlife
    //-- record, depending on the drugs and outcome
    //-- actions may need to be updated, removed, or added
    //--
    const _upsertActions = async (
      db: Omit<
        PrismaClient<Prisma.PrismaClientOptions, never, DefaultArgs>,
        "$connect" | "$disconnect" | "$on" | "$transaction" | "$use" | "$extends"
      >,
      complaintOutcomeGuid: string,
      wildlifeId: string,
      actions: Array<WildlifeAction>,
      userId: string,
      date: Date,
    ) => {
      try {
        //-- if there are no actions present then remove all
        //-- actions that are associated with the wildlifeId and complaintOutcomeGuid
        if (!actions || actions?.length === 0) {
          await db.action.updateMany({
            where: {
              complaint_outcome_guid: complaintOutcomeGuid,
              wildlife_guid: wildlifeId,
            },
            data: {
              active_ind: false,
              update_user_id: userId,
              create_utc_timestamp: date,
            },
          });
        } else {
          //-- compare the current actions and the actions provided
          //-- to determine what needs to be removed and added

          //-- get the xrefs for wildlife records
          const xrefs = await db.action_type_action_xref.findMany({
            where: {
              action_type_code: ACTION_TYPE_CODES.WILDLIFE,
            },
            select: {
              action_type_action_xref_guid: true,
              action_code: true,
            },
          });

          //-- get the actions associated with the complaintOutcomeGuid
          const current = await db.action.findMany({
            where: {
              wildlife_guid: wildlifeId,
              active_ind: true,
            },
          });

          //-- there are no existing actions,
          if ((!current && actions?.length !== 0) || (current?.length === 0 && actions?.length !== 0)) {
            //-- add new actions

            const items = actions.map(({ actor: actor_guid, date: action_date, action }) => {
              const xref = xrefs.find((item) => item.action_code === action);

              return {
                complaint_outcome_guid: complaintOutcomeGuid,
                wildlife_guid: wildlifeId,
                action_type_action_xref_guid: xref.action_type_action_xref_guid,
                actor_guid,
                action_date,
                active_ind: true,
                create_user_id: userId,
                update_user_id: userId,
                create_utc_timestamp: date,
                update_utc_timestamp: date,
              };
            });

            await db.action.createMany({ data: items });
          } else {
            await _applyAction(
              db,
              ACTION_CODES.ADMNSTRDRG,
              current,
              actions,
              xrefs,
              complaintOutcomeGuid,
              wildlifeId,
              userId,
              date,
            );
            await _applyAction(
              db,
              ACTION_CODES.RECOUTCOME,
              current,
              actions,
              xrefs,
              complaintOutcomeGuid,
              wildlifeId,
              userId,
              date,
            );
          }
        }
      } catch (error) {
        console.log(`exception: unable to update actions for wildlife record: ${wildlifeId}`, error);
        throw new GraphQLError("Exception occurred. See server log for details", {});
      }
    };

    try {
      await this.prisma.$transaction(async (db) => {
        //-- find the wildlife record first, if there is a record,
        //-- apply updates to it
        const source = await db.wildlife.findUnique({
          where: {
            complaint_outcome_guid: complaintOutcomeGuid,
            wildlife_guid: wildlifeId,
          },
        });

        if (source) {
          //-- apply any changes to the wildlife record first
          let wildlifeUpdate = await _updateWildlife(db, wildlife, updateUserId, current);

          //-- if the wildlife record was updated start applying the remainder of the
          //-- updates, make sure to remove items as needed
          if (wildlifeUpdate) {
            const { tags, drugs, actions } = wildlife;

            const tagsResult = await _upsertEarTags(db, wildlifeId, tags, updateUserId, current);
            const drugsResult = await _upsertDrugs(db, wildlifeId, drugs, updateUserId, current);
            const actionsResult = await _upsertActions(
              db,
              complaintOutcomeGuid,
              wildlifeId,
              actions,
              updateUserId,
              current,
            );
          }
        }
      });

      result = await this.findOne(complaintOutcomeGuid);

      return result;
    } catch (error) {
      console.log("exception: unable to update wildlife ", error);
      throw new GraphQLError("Exception occurred. See server log for details", {});
    }
  };

  deleteWildlife = async (model: DeleteWildlifeInput): Promise<ComplaintOutcome> => {
    const { complaintOutcomeGuid, wildlifeId, actor, updateUserId: userId } = model;
    const current = new Date();

    const softDeleteFragment = { active_ind: false, update_user_id: userId, update_utc_timestamp: current };

    try {
      await this.prisma.$transaction(async (db) => {
        //-- find the wildlife entry to delete
        const wildlife = await db.wildlife.findUnique({
          where: {
            complaint_outcome_guid: complaintOutcomeGuid,
            wildlife_guid: wildlifeId,
          },
        });

        if (!wildlife) {
          throw new Error(`Wildlife with ID ${wildlifeId} not found.`);
        }

        //-- soft delete ear_tags
        const tags = await db.ear_tag.findMany({ where: { wildlife_guid: wildlifeId } });
        if (tags && tags.length !== 0) {
          await db.ear_tag.updateMany({
            where: { wildlife_guid: wildlifeId },
            data: softDeleteFragment,
          });
        }

        //-- soft delete drugs_administered
        const drugs = await db.drug_administered.findMany({ where: { wildlife_guid: wildlifeId } });
        if (drugs && drugs.length !== 0) {
          await db.drug_administered.updateMany({
            where: { wildlife_guid: wildlifeId },
            data: softDeleteFragment,
          });
        }

        //-- soft delete wildlife record
        await db.wildlife.update({ where: { wildlife_guid: wildlifeId }, data: softDeleteFragment });

        //-- if there are actions perform soft delete
        const actions = await db.action.findMany({
          where: { complaint_outcome_guid: complaintOutcomeGuid, wildlife_guid: wildlifeId },
        });
        if (actions && actions.length !== 0) {
          await db.wildlife.updateMany({
            where: { wildlife_guid: wildlifeId },
            data: softDeleteFragment,
          });
        }
      });

      return await this.findOne(complaintOutcomeGuid);
    } catch (error) {
      console.log("exception: unable to delete wildlife", error);
      throw new GraphQLError("Exception occurred. See server log for details", {});
    }
  };

  //--
  //-- decision outcomes
  //--
  createDecision = async (model: CreateDecisionInput): Promise<ComplaintOutcome> => {
    let caseFileId = "";

    //--
    //-- creates a new decision record and returns the decision_guid
    //--
    const _addDecision = async (
      db: Omit<
        PrismaClient<Prisma.PrismaClientOptions, never, DefaultArgs>,
        "$connect" | "$disconnect" | "$on" | "$transaction" | "$use" | "$extends"
      >,
      caseId: string,
      decision: DecisionInput,
      scheduleSectorXref: string,
      userId: string,
    ): Promise<any> => {
      try {
        let { discharge, nonCompliance, ipmAuthCategory, rationale } = decision;

        //don't try and insert empty into the code tables.
        if (rationale === "" || rationale === undefined) {
          rationale = null;
        }

        if (nonCompliance === "" || nonCompliance === undefined) {
          nonCompliance = null;
        }

        if (ipmAuthCategory === "" || ipmAuthCategory === undefined) {
          ipmAuthCategory = null;
        }

        let record: any = {
          decision_guid: randomUUID(),
          complaint_outcome_guid: caseId,
          schedule_sector_xref_guid: scheduleSectorXref,
          discharge_code: discharge,
          rationale_text: rationale,
          non_compliance_decision_matrix_code: nonCompliance,
          ipm_auth_category_code: ipmAuthCategory,
          active_ind: true,
          create_user_id: userId,
          update_user_id: userId,
          create_utc_timestamp: new Date(),
          update_utc_timestamp: new Date(),
        };

        if (decision.inspectionNumber) {
          record = { ...record, inspection_number: parseInt(decision.inspectionNumber) };
        }

        if (decision.leadAgency) {
          record = { ...record, outcome_agency_code: decision.leadAgency };
        }

        const result = await db.decision.create({
          data: record,
        });

        return result?.decision_guid;
      } catch (error) {
        throw new Error("Exception occurred in _addDecision. See server log for details", error);
      }
    };

    //--
    //-- finds a schedule/sector xref record and returns the schedule_sector_xref_guid
    //--
    const _findWdrXref = async (
      db: Omit<
        PrismaClient<Prisma.PrismaClientOptions, never, DefaultArgs>,
        "$connect" | "$disconnect" | "$on" | "$transaction" | "$use" | "$extends"
      >,
      decision: DecisionInput,
      userId: string,
    ): Promise<any> => {
      try {
        const { sector, schedule } = decision;

        let scheduleSectorXref = await this.prisma.schedule_sector_xref.findFirstOrThrow({
          where: {
            schedule_code: schedule,
            sector_code: sector,
          },
          select: {
            schedule_sector_xref_guid: true,
          },
        });

        return scheduleSectorXref;
      } catch (exception) {
        const { message } = exception;
        throw new Error("Exception occurred in _findWdrXref. See server log for details", message);
      }
    };

    try {
      let result: ComplaintOutcome;

      await this.prisma.$transaction(async (db) => {
        const { complaintId, createUserId, decision } = model;

        const caseFile = await this.findOneByLeadId(complaintId);

        if (caseFile && caseFile?.complaintOutcomeGuid) {
          caseFileId = caseFile.complaintOutcomeGuid;
        } else {
          const caseInput: CreateComplaintOutcomeInput = { ...model };
          caseFileId = await this.createComplaintOutcome(db, caseInput);
        }

        //-- find the sector/schedule xref entry
        const xref = await _findWdrXref(db, decision, createUserId);

        //-- add decision
        const decsionId = await _addDecision(db, caseFileId, decision, xref.schedule_sector_xref_guid, createUserId);

        //-- apply action
        if (decision.actionTaken && decision.assignedTo) {
          let action: ActionInput = {
            actionTaken: decision.actionTaken,
            actor: decision.assignedTo,
            date: decision.actionTakenDate,
          };
          await this._addAction(db, caseFileId, decsionId, action, createUserId);
        }
      });

      result = await this.findOne(caseFileId);

      return result;
    } catch (error) {
      console.log(error);
      throw new Error("Exception occurred in _findWdrXref. See server log for details", error);
    }
  };

  //--
  //-- returns the action_type_action_xref_guid for a action_code/action_type_code pair
  //--
  _getActionXref = async (
    db: Omit<
      PrismaClient<Prisma.PrismaClientOptions, never, DefaultArgs>,
      "$connect" | "$disconnect" | "$on" | "$transaction" | "$use" | "$extends"
    >,
    actionCode: string,
    actionTypeCode: string,
  ): Promise<any> => {
    const query = await this.prisma.action_type_action_xref.findFirst({
      where: {
        action_code: actionCode,
        action_type_code: actionTypeCode,
      },
      select: {
        action_type_action_xref_guid: true,
      },
    });

    return query.action_type_action_xref_guid;
  };

  updateDecision = async (model: UpdateDecisionInput): Promise<ComplaintOutcome> => {
    const { complaintOutcomeGuid, updateUserId, decision } = model;
    const { id: decisonId } = decision;

    //--
    //-- updates an existing decision record and returns the decision
    //--
    const _updateDecision = async (
      db: Omit<
        PrismaClient<Prisma.PrismaClientOptions, never, DefaultArgs>,
        "$connect" | "$disconnect" | "$on" | "$transaction" | "$use" | "$extends"
      >,
      decision: DecisionInput,
      updateUserId: string,
      current: Date,
    ): Promise<any> => {
      try {
        const { id, discharge, rationale, nonCompliance, ipmAuthCategory, leadAgency, inspectionNumber, actionTaken } =
          decision;

        let data: any = {
          discharge_code: discharge,
          rationale_text: rationale,
          non_compliance_decision_matrix_code: nonCompliance,
          ipm_auth_category_code: ipmAuthCategory !== "" ? ipmAuthCategory : null,
          update_user_id: updateUserId,
          update_utc_timestamp: current,
        };

        if (actionTaken === "FWDLEADAGN") {
          data = { ...data, inspection_number: null, outcome_agency_code: leadAgency };
        }

        if (actionTaken === "RESPREC") {
          data = { ...data, outcome_agency_code: null, inspection_number: parseInt(inspectionNumber) };
        }

        if (actionTaken !== "RESPREC" && actionTaken !== "FWDLEADAGN") {
          data = { ...data, inspection_number: null, outcome_agency_code: null };
        }

        const result = await db.decision.update({
          where: { decision_guid: id },
          data,
        });
        return result;
      } catch (exception) {
        this.logger.error(exception);
        throw new GraphQLError("Exception occurred. See server log for details", exception);
      }
    };

    //--
    //-- updates an existing decision with new sector/schedule xref guid
    //--
    const _updateWdrXref = async (
      db: Omit<
        PrismaClient<Prisma.PrismaClientOptions, never, DefaultArgs>,
        "$connect" | "$disconnect" | "$on" | "$transaction" | "$use" | "$extends"
      >,
      id: string,
      decision: DecisionInput,
      updateUserId: string,
      current: Date,
    ): Promise<any> => {
      try {
        const { sector, schedule } = decision;

        let data: any = {
          decision_guid: id,
          update_user_id: updateUserId,
          update_utc_timestamp: current,
        };

        let scheduleSectorXref = await this.prisma.schedule_sector_xref.findFirstOrThrow({
          where: {
            schedule_code: decision.schedule,
            sector_code: decision.sector,
          },
          select: {
            schedule_sector_xref_guid: true,
          },
        });

        if (scheduleSectorXref) {
          data = { ...data, schedule_sector_xref_guid: scheduleSectorXref.schedule_sector_xref_guid };
        }
        const result = db.decision.update({
          where: { decision_guid: id },
          data,
        });

        return result;
      } catch (exception) {
        throw new GraphQLError("Exception occurred. See server log for details", exception);
      }
    };

    //--
    //-- updates an existing action record and returns the result
    //--
    const _updateAction = async (
      db: Omit<
        PrismaClient<Prisma.PrismaClientOptions, never, DefaultArgs>,
        "$connect" | "$disconnect" | "$on" | "$transaction" | "$use" | "$extends"
      >,
      caseIdentifier: string,
      decisionId: string,
      decision: DecisionInput,
      updateUserId: string,
      current: Date,
    ): Promise<any> => {
      try {
        const { actionTaken, actionTakenDate, assignedTo } = decision;
        if (actionTaken === "") {
          await db.action.updateMany({
            where: {
              decision_guid: decisionId,
              complaint_outcome_guid: caseIdentifier,
            },
            data: {
              active_ind: false,
              update_user_id: updateUserId,
              update_utc_timestamp: current,
            },
          });
        } else {
          //-- get the action_type_action xref
          const xref = await this._getActionXref(db, actionTaken, ACTION_TYPE_CODES.CEEBACTION);

          const source = await db.action.findFirst({
            where: {
              complaint_outcome_guid: caseIdentifier,
              decision_guid: decisionId,
              active_ind: true,
            },
            select: {
              action_guid: true, //comment
            },
          });

          let data: any = {
            action_type_action_xref_guid: xref,
            actor_guid: assignedTo,
            action_date: actionTakenDate,
            update_user_id: updateUserId,
            update_utc_timestamp: current,
          };

          const result = db.action.update({
            where: { action_guid: source.action_guid },
            data,
          });

          return result;
        }
      } catch (exception) {
        throw new GraphQLError("Exception occurred. See server log for details", exception);
      }
    };

    try {
      let results: ComplaintOutcome;
      const current = new Date();

      await this.prisma.$transaction(async (db) => {
        //-- find the decision record first, if there is a record,
        //-- apply updates to it
        const source = await db.decision.findUnique({
          where: {
            complaint_outcome_guid: complaintOutcomeGuid,
            decision_guid: decisonId,
          },
        });

        if (source) {
          let update = await _updateDecision(db, decision, updateUserId, current);

          //-- if the update was successful update the sector/schedule xref
          //-- and action taken
          const xrefResult = await _updateWdrXref(db, update.decision_guid, decision, updateUserId, current);

          //-- make sure that there is an action to update first
          //-- otherwise create a new action
          const currentAction = await db.action.findFirst({
            where: { complaint_outcome_guid: complaintOutcomeGuid, decision_guid: decisonId, active_ind: true },
          });

          if (!currentAction && decision.actionTaken && decision.assignedTo && decision.actionTakenDate) {
            const action: ActionInput = {
              actionTaken: decision.actionTaken,
              actor: decision.assignedTo,
              date: decision.actionTakenDate,
            };
            await this._addAction(db, complaintOutcomeGuid, decisonId, action, updateUserId);
          } else if (currentAction && decision.assignedTo) {
            await _updateAction(db, complaintOutcomeGuid, decisonId, decision, updateUserId, current);
          }
        }
      });

      results = await this.findOne(complaintOutcomeGuid);

      return results;
    } catch (error) {
      console.log("exception: unable to update decision", error);
      throw new GraphQLError("Exception occurred. See server log for details", {});
    }
  };

  //--
  //-- authorization outcome
  //--
  private _addAuthorizationOutcome = async (
    db: Omit<
      PrismaClient<Prisma.PrismaClientOptions, never, DefaultArgs>,
      "$connect" | "$disconnect" | "$on" | "$transaction" | "$use" | "$extends"
    >,
    caseId: string,
    type: "permit" | "site",
    value: string,
    userId: string,
  ): Promise<any> => {
    try {
      let record: any = {
        complaint_outcome_guid: caseId,
        create_user_id: userId,
        update_user_id: userId,
        create_utc_timestamp: new Date(),
        update_utc_timestamp: new Date(),
      };

      if (type === "permit") {
        record = { ...record, authorization_permit_id: value };

        const result = await db.authorization_permit.create({
          data: record,
        });

        return result?.authorization_permit_guid;
      } else {
        record = { ...record, site_id: value };

        const result = await db.site.create({
          data: record,
        });

        return result.site_guid;
      }
    } catch (exception) {
      let { message } = exception;
      this.logger.error(
        `Unable to create new ${type === "permit" ? "authorization_permit" : "site"}  record: `,
        message,
      );
      throw new GraphQLError("Exception occurred. See server log for details", exception);
    }
  };

  private _removeAuthorizationOutcome = async (
    db: Omit<
      PrismaClient<Prisma.PrismaClientOptions, never, DefaultArgs>,
      "$connect" | "$disconnect" | "$on" | "$transaction" | "$use" | "$extends"
    >,
    id: string,
    type: "permit" | "site",
    userId: string,
    current: Date,
  ): Promise<any> => {
    const softDeleteFragment = { active_ind: false, update_user_id: userId, update_utc_timestamp: current };

    try {
      if (type === "permit") {
        const result = await db.authorization_permit.update({
          where: { authorization_permit_guid: id },
          data: softDeleteFragment,
        });
      } else {
        const result = await db.site.update({
          where: { site_guid: id },
          data: softDeleteFragment,
        });
      }
    } catch (exception) {
      let { message } = exception;
      this.logger.error(
        `Unable to create new ${type === "permit" ? "authorization_permit" : "site"}  record: `,
        message,
      );
      throw new GraphQLError("Exception occurred. See server log for details", exception);
    }
  };

  private _updateAuthorizationOutcome = async (
    db: Omit<
      PrismaClient<Prisma.PrismaClientOptions, never, DefaultArgs>,
      "$connect" | "$disconnect" | "$on" | "$transaction" | "$use" | "$extends"
    >,
    id: string,
    type: "permit" | "site",
    value: string,
    userId: string,
    current: Date,
  ): Promise<any> => {
    const record = {
      update_user_id: userId,
      update_utc_timestamp: current,
      ...(type === "permit" && { authorization_permit_id: value }),
      ...(type === "site" && { site_id: value }),
    };

    try {
      if (type === "permit") {
        const result = await db.authorization_permit.update({
          where: { authorization_permit_guid: id },
          data: record,
        });
      } else {
        const result = await db.site.update({
          where: { site_guid: id },
          data: record,
        });
      }
    } catch (exception) {
      let { message } = exception;
      this.logger.error(
        `Unable to update existing ${type === "permit" ? "authorization_permit" : "site"}  record: `,
        message,
      );
      throw new GraphQLError("Exception occurred. See server log for details", exception);
    }
  };

  private _getAuthorizationOutcome = (query: AuthorizationOutcomeSearchResults): AuthorizationOutcome => {
    const { authorization_permit: permit, site } = query;

    if (permit.length !== 0) {
      return { id: permit[0].authorization_permit_guid, type: "permit", value: permit[0].authorization_permit_id };
    }

    if (site.length !== 0) {
      return { id: site[0].site_guid, type: "site", value: site[0].site_id };
    }

    return null;
  };

  createAuthorizationOutcome = async (model: CreateAuthorizationOutcomeInput): Promise<ComplaintOutcome> => {
    let caseFileId = "";

    try {
      let result: ComplaintOutcome;

      await this.prisma.$transaction(async (db) => {
        const { complaintId, createUserId, input } = model;

        const caseFile = await this.findOneByLeadId(complaintId);

        if (caseFile && caseFile?.complaintOutcomeGuid) {
          caseFileId = caseFile.complaintOutcomeGuid;
        } else {
          const caseInput: CreateComplaintOutcomeInput = { ...model };
          caseFileId = await this.createComplaintOutcome(db, caseInput);
        }

        //-- create a new authorized_permit or site record depending on the type
        //-- of authorization is provided
        const { type, value } = input;

        const outcome = await this._addAuthorizationOutcome(db, caseFileId, type, value, createUserId);
      });

      return await this.findOne(caseFileId);
    } catch (error) {
      console.log("exception: unable to create authorization outcome ", error);
      throw new GraphQLError("Exception occurred. See server log for details", {});
    }
  };

  updateAuthorizationOutcome = async (model: UpdateAuthorizationOutcomeInput): Promise<ComplaintOutcome> => {
    const { complaintOutcomeGuid, updateUserId, input } = model;
    const timestamp = new Date();

    try {
      let result: ComplaintOutcome;

      await this.prisma.$transaction(async (db) => {
        //-- get the current case file and compare the current
        //-- authorization outcome to the submited outcome if the
        //-- outcome is a different type, remove the old outcome
        //-- and add a new one or update the type if the same
        const caseFile = await this.findOne(complaintOutcomeGuid);
        const { authorization: current } = caseFile;

        const { type, value } = input;
        if (current.type === type) {
          await this._updateAuthorizationOutcome(db, current.id, type, value, updateUserId, timestamp);
        } else {
          await this._removeAuthorizationOutcome(db, current.id, current.type, updateUserId, timestamp);
          await this._addAuthorizationOutcome(db, complaintOutcomeGuid, type, value, updateUserId);
        }
      });

      return await this.findOne(complaintOutcomeGuid);
    } catch (error) {
      console.log("exception: unable to create authorization outcome ", error);
      throw new GraphQLError("Exception occurred. See server log for details", {});
    }
  };

  deleteAuthorizationOutcome = async (model: DeleteAuthorizationOutcomeInput): Promise<ComplaintOutcome> => {
    const { complaintOutcomeGuid, updateUserId, id } = model;
    const timestamp = new Date();

    try {
      await this.prisma.$transaction(async (db) => {
        const caseFile = await this.findOne(complaintOutcomeGuid);

        if (caseFile) {
          const {
            authorization: { type },
          } = caseFile;

          await this._removeAuthorizationOutcome(db, id, type, updateUserId, timestamp);
        }
      });

      return await this.findOne(complaintOutcomeGuid);
    } catch (error) {
      console.log("exception: unable to delete authorization outcome ", error);
      throw new GraphQLError("Exception occurred. See server log for details", {});
    }
  };

  private readonly _addAction = async (
    db: Omit<
      PrismaClient<Prisma.PrismaClientOptions, never, DefaultArgs>,
      "$connect" | "$disconnect" | "$on" | "$transaction" | "$use" | "$extends"
    >,
    caseFileId: string,
    decisionId: string,
    input: ActionInput,
    userId: string,
  ): Promise<any> => {
    try {
      const { actionTaken, actor, date } = input;

      //-- get the action_type_action xref
      const xref = await this._getActionXref(db, actionTaken, ACTION_TYPE_CODES.CEEBACTION);

      let record: any = {
        action_guid: randomUUID(),
        complaint_outcome_guid: caseFileId,
        action_type_action_xref_guid: xref,
        decision_guid: decisionId,
        actor_guid: actor,
        action_date: date,
        active_ind: true,
        create_user_id: userId,
        update_user_id: userId,
        create_utc_timestamp: new Date(),
        update_utc_timestamp: new Date(),
      };
      const test = 0;
      const result = await db.action.create({
        data: record,
      });

      return result?.action_guid;
    } catch (exception) {
      throw new GraphQLError("Exception occurred. See server log for details", exception);
    }
  };

  //--
  //-- not implemented
  //--
  findAll() {
    return `This action returns all caseFile`;
  }

  remove(id: number) {
    return `This action removes a #${id} caseFile`;
  }
}
