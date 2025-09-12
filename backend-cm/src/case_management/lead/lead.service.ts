import { Injectable } from "@nestjs/common";
import { ComplaintOutcomePrismaService } from "../../prisma/complaint_outcome/prisma.complaint_outcome.service";
import { ACTION_TYPE_CODES } from "../../common/action_type_codes";
import { ACTION_CODES } from "../../common/action_codes";
import { EQUIPMENT_STATUS_CODES } from "../../common/equipment_status_codes";

@Injectable()
export class LeadService {
  constructor(private readonly prisma: ComplaintOutcomePrismaService) {}

  async getLeadsByActionTaken(actionCode: string): Promise<string[]> {
    /**
     * Provided an action taken, returns the lead_identifier for each lead whose case_file has had that action taken
     * on it.
     * actionCode: the action_code to filter actions by
     */
    const actionCodeXrefContext = this.prisma.action_type_action_xref;
    const xrefResult = await actionCodeXrefContext.findFirst({
      where: {
        action_code: actionCode,
        // Filtering by action taken is currently exclusive to CEEB which allows us to filter on CEEBACTION type
        action_type_code: ACTION_TYPE_CODES.CEEBACTION,
      },
      select: {
        action_type_action_xref_guid: true,
      },
    });

    const actionResults = await this.prisma.action.findMany({
      where: {
        action_type_action_xref_guid: xrefResult.action_type_action_xref_guid,
      },
      select: {
        complaint_outcome_guid: true,
      },
    });

    const caseGuids: string[] = [];
    for (let action of actionResults) {
      caseGuids.push(action.complaint_outcome_guid);
    }

    const leadResults = await this.prisma.complaint_outcome.findMany({
      where: {
        complaint_outcome_guid: {
          in: caseGuids,
        },
      },
      select: {
        complaint_identifier: true,
      },
    });
    const leadIdentifiers: string[] = [];
    for (let leadId of leadResults) {
      // leadIdentifiers.push(leadId.lead_identifier);
      leadIdentifiers.push(leadId.complaint_identifier);
    }
    return leadIdentifiers;
  }

  async getLeadsByOutcomeAnimal(outcomeAnimalCode, outcomeActionedByCode, startDate, endDate): Promise<string[]> {
    let caseGuids: string[] = [];

    const hasOutcomeFilter = outcomeAnimalCode !== "undefined";
    const hasDateFilter = startDate !== "undefined";

    if (hasOutcomeFilter && hasDateFilter) {
      // Combined search: find actions within date range AND ensure the corresponding wildlife records have the specified outcome code
      const xrefResult = await this.prisma.action_type_action_xref.findFirst({
        where: {
          action_code: ACTION_CODES.RECOUTCOME,
        },
        select: {
          action_type_action_xref_guid: true,
        },
      });

      const wildlifeWhere: any = {
        hwcr_outcome_code: outcomeAnimalCode,
        active_ind: true,
      };

      if (outcomeActionedByCode !== "undefined") {
        wildlifeWhere.hwcr_outcome_actioned_by_code = outcomeActionedByCode;
      }

      const wildlifeRecords = await this.prisma.wildlife.findMany({
        where: wildlifeWhere,
        select: {
          wildlife_guid: true,
          complaint_outcome_guid: true,
        },
      });

      if (wildlifeRecords.length === 0) {
        caseGuids = [];
      } else {
        const wildlifeGuids = wildlifeRecords.map((w) => w.wildlife_guid);

        const combinedResults = await this.prisma.action.findMany({
          where: {
            action_type_action_xref_guid: xrefResult.action_type_action_xref_guid,
            action_date: {
              gte: new Date(startDate),
              lte: endDate !== "undefined" ? new Date(endDate) : new Date().toISOString(),
            },
            active_ind: true,
            wildlife_guid: {
              in: wildlifeGuids,
            },
          },
          select: {
            complaint_outcome_guid: true,
          },
        });

        caseGuids = combinedResults.map((action) => action.complaint_outcome_guid);
      }
    } else if (hasOutcomeFilter) {
      // Only outcome animal code filter
      const wildlifeWhere: any = {
        hwcr_outcome_code: outcomeAnimalCode,
        active_ind: true,
      };

      if (outcomeActionedByCode !== "undefined") {
        wildlifeWhere.hwcr_outcome_actioned_by_code = outcomeActionedByCode;
      }

      const outcomeResults = await this.prisma.wildlife.findMany({
        where: wildlifeWhere,
        select: {
          complaint_outcome_guid: true,
        },
      });

      caseGuids = outcomeResults.map((outcome) => outcome.complaint_outcome_guid);
    } else if (hasDateFilter) {
      // Only date range filter
      const xrefResult = await this.prisma.action_type_action_xref.findFirst({
        where: {
          action_code: ACTION_CODES.RECOUTCOME,
        },
        select: {
          action_type_action_xref_guid: true,
        },
      });

      const dateResults = await this.prisma.action.findMany({
        where: {
          action_type_action_xref_guid: xrefResult.action_type_action_xref_guid,
          action_date: {
            gte: new Date(startDate),
            lte: endDate !== "undefined" ? new Date(endDate) : new Date().toISOString(),
          },
          active_ind: true,
        },
        select: {
          complaint_outcome_guid: true,
        },
      });

      caseGuids = dateResults.map((action) => action.complaint_outcome_guid);
    }

    // Return empty result if no matching GUIDs found
    if (caseGuids.length === 0) {
      return [];
    }

    const leadResults = await this.prisma.complaint_outcome.findMany({
      where: {
        complaint_outcome_guid: {
          in: caseGuids,
        },
      },
      select: {
        complaint_identifier: true,
      },
    });

    const leadIdentifiers: string[] = [];
    for (let leadId of leadResults) {
      leadIdentifiers.push(leadId.complaint_identifier);
    }

    return leadIdentifiers;
  }

  async getLeadsByEquipment(equipmentStatus: string, equipmentCodes: string[]): Promise<string[]> {
    const EXCEPTIONAL_INACTIVE_EQUIPMENT_CODES = ["K9UNT", "LLTHL"]; //K9 and Less lethal are always inactive equipments
    const xrefResult = await this.prisma.action_type_action_xref.findMany({
      where: {
        OR: [{ action_code: ACTION_CODES.SETEQUIPMT }, { action_code: ACTION_CODES.REMEQUIPMT }],
      },
      select: {
        action_type_action_xref_guid: true,
      },
      orderBy: {
        action_code: "desc",
      },
    });

    const setEquipmentActionGuid = xrefResult[0].action_type_action_xref_guid;
    const removeEquipmentActionGuid = xrefResult[1].action_type_action_xref_guid;

    //Find all cases with "set equipment" actions
    const setActions = await this.prisma.action.findMany({
      where: {
        action_type_action_xref_guid: setEquipmentActionGuid,
        equipment: {
          active_ind: true, //exclude deleted equipments (active_ind = false)
        },
        active_ind: true,
      },
      select: {
        complaint_outcome_guid: true,
        equipment_guid: true,
        equipment: {
          select: {
            equipment_code: true,
          },
        },
      },
    });

    //Find all cases with "remove equipment" actions
    const removeActions = await this.prisma.action.findMany({
      where: {
        action_type_action_xref_guid: removeEquipmentActionGuid,
        equipment: {
          active_ind: true,
        },
        active_ind: true,
      },
      select: {
        complaint_outcome_guid: true,
        equipment_guid: true,
      },
    });

    //Determine active and inactive cases
    const equipmentStatusMap = new Map<string, Map<string, boolean>>();

    // Process "set" actions
    setActions.forEach((action) => {
      const caseGuid = action.complaint_outcome_guid;
      const equipmentGuid = action.equipment_guid;
      const equipmentCode = action.equipment?.equipment_code;

      if (!equipmentGuid || !equipmentCode) return; // Skip if no equipment

      if (!equipmentStatusMap.has(caseGuid)) {
        equipmentStatusMap.set(caseGuid, new Map());
      }
      const caseEquipment = equipmentStatusMap.get(caseGuid)!;
      // Mark as active unless overridden by a remove action or exceptional type
      caseEquipment.set(equipmentGuid, !EXCEPTIONAL_INACTIVE_EQUIPMENT_CODES.includes(equipmentCode));
    });

    // Process "remove" actions to mark equipment as inactive
    removeActions.forEach((action) => {
      const caseGuid = action.complaint_outcome_guid;
      const equipmentGuid = action.equipment_guid;

      if (!equipmentGuid || !equipmentStatusMap.has(caseGuid)) return;

      const caseEquipment = equipmentStatusMap.get(caseGuid)!;
      caseEquipment.set(equipmentGuid, false); // Mark as inactive
    });

    const targetCaseGuids = new Set<string>();

    if (!Array.isArray(equipmentCodes) || (Array.isArray(equipmentCodes) && equipmentCodes.length === 0)) {
      // No type filter: return all cases matching the status
      for (const [caseGuid, equipmentMap] of equipmentStatusMap) {
        const hasActive = Array.from(equipmentMap.values()).some((isActive) => isActive);
        const hasInactive = Array.from(equipmentMap.values()).some((isActive) => !isActive);

        if (
          (equipmentStatus === EQUIPMENT_STATUS_CODES.ALL_EQUIPMENT && (hasActive || hasInactive)) ||
          (equipmentStatus === EQUIPMENT_STATUS_CODES.ACTIVE_EQUIPMENT && hasActive) ||
          (equipmentStatus === EQUIPMENT_STATUS_CODES.INACTIVE_EQUIPMENT && hasInactive)
        ) {
          targetCaseGuids.add(caseGuid);
        }
      }
    } else {
      // Filter by specific equipment types and their status
      for (const [caseGuid, equipmentMap] of equipmentStatusMap) {
        let matchesCondition = false;

        for (const [equipmentGuid, isActive] of equipmentMap) {
          const equipmentCode = setActions.find(
            (a) => a.complaint_outcome_guid === caseGuid && a.equipment_guid === equipmentGuid,
          )?.equipment?.equipment_code;

          if (!equipmentCode || !equipmentCodes.includes(equipmentCode)) continue;

          if (
            (equipmentStatus === EQUIPMENT_STATUS_CODES.ACTIVE_EQUIPMENT && isActive) ||
            (equipmentStatus === EQUIPMENT_STATUS_CODES.INACTIVE_EQUIPMENT && !isActive) ||
            equipmentStatus === EQUIPMENT_STATUS_CODES.ALL_EQUIPMENT
          ) {
            matchesCondition = true;
            break;
          }
        }

        if (matchesCondition) {
          targetCaseGuids.add(caseGuid);
        }
      }
    }

    //Return lead id
    const leadResults = await this.prisma.complaint_outcome.findMany({
      where: {
        complaint_outcome_guid: {
          in: [...targetCaseGuids],
        },
      },
      select: {
        complaint_identifier: true,
      },
    });

    const leadIdentifiers: string[] = [];
    for (let leadId of leadResults) {
      leadIdentifiers.push(leadId.complaint_identifier);
    }

    return leadIdentifiers;
  }
}
