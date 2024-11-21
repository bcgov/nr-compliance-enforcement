import { Inject, Injectable, Logger, Scope } from "@nestjs/common";
import { InjectMapper } from "@automapper/nestjs";
import { Mapper } from "@automapper/core";
import { caseFileQueryFields, get, post } from "../../external_api/case_management";
import { CaseFileDto } from "src/types/models/case-files/case-file";
import { REQUEST } from "@nestjs/core";
import { AxiosResponse, AxiosError } from "axios";
import { CreateSupplementalNotesInput } from "../../types/models/case-files/supplemental-notes/create-supplemental-notes-input";
import { UpdateSupplementalNotesInput } from "../../types/models/case-files/supplemental-notes/update-supplemental-note-input";
import { DeleteSupplementalNotesInput } from "../../types/models/case-files/supplemental-notes/delete-supplemental-notes-input";
import { ComplaintService } from "../complaint/complaint.service";
import { ComplaintStatusCodeEnum } from "../../enum/complaint_status_code.enum";
import { DeleteEquipmentDto } from "../../types/models/case-files/equipment/delete-equipment-dto";
import { CreateWildlifeInput } from "../../types/models/case-files/wildlife/create-wildlife-input";
import { DeleteWildlifeInput } from "../../types/models/case-files/wildlife/delete-wildlife-outcome";
import { UpdateWildlifeInput } from "../../types/models/case-files/wildlife/update-wildlife-input";
import { CreateDecisionInput } from "src/types/models/case-files/ceeb/decision/create-decision-input";
import { UpdateDecisionInput } from "src/types/models/case-files/ceeb/decision/update-decison-input";
import { CreateAuthorizationOutcomeInput } from "src/types/models/case-files/ceeb/site/create-authorization-outcome-input";
import { UpdateAuthorizationOutcomeInput } from "src/types/models/case-files/ceeb/site/update-authorization-outcome-input";
import { DeleteAuthorizationOutcomeInput } from "src/types/models/case-files/ceeb/site/delete-authorization-outcome-input";
import { DataSource, Repository } from "typeorm";
import { LinkedComplaintXref } from "../linked_complaint_xref/entities/linked_complaint_xref.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { getIdirFromRequest } from "../../common/get-idir-from-request";
import { CodeTableService } from "../code-table/code-table.service";
import { Complaint } from "../complaint/entities/complaint.entity";
import { CreateLinkedComplaintXrefDto } from "../linked_complaint_xref/dto/create-linked_complaint_xref.dto";

@Injectable({ scope: Scope.REQUEST })
export class CaseFileService {
  private readonly logger = new Logger(CaseFileService.name);
  private mapper: Mapper;

  constructor(
    @Inject(REQUEST) private request: Request,
    @InjectMapper() mapper,
    private readonly complaintService: ComplaintService,
    private readonly _codeTableService: CodeTableService,
    private readonly dataSource: DataSource,
  ) {
    this.mapper = mapper;
  }

  find = async (complaint_id: string, token: string): Promise<CaseFileDto> => {
    const { data, errors } = await get(token, {
      query: `{getCaseFileByLeadId (leadIdentifier: "${complaint_id}")
        ${caseFileQueryFields}
      }`,
    });

    if (errors) {
      this.logger.error("GraphQL errors:", errors);
      throw new Error("GraphQL errors occurred");
    }

    if (data?.getCaseFileByLeadId?.caseIdentifier) {
      const caseFileDto = data.getCaseFileByLeadId as CaseFileDto;
      return caseFileDto;
    } else {
      this.logger.debug(`Case with complaint Id ${complaint_id} not found.`);
      return null;
    }
  };

  // The linked complaint xref and complaint repositories are needed if an assessment being created is also linking two
  // complaints. The codeTableService is needed to fetch the status used to update the closing complaint's status.
  @InjectRepository(LinkedComplaintXref)
  private readonly _linkedComplaintXrefRepository: Repository<LinkedComplaintXref>;
  @InjectRepository(Complaint)
  private readonly _complaintsRepository: Repository<Complaint>;

  /**
   * If the assessment is linking the complaint to another, the assessment (CM db) and a linked complaint xref
   * (NATCom db) both need to be created. To ensure that either both are successfully created, or neither of them
   * are, the following takes place:
   * A transaction is started in the NATCom database. If anything beyond this point fails, the transaction is
   * rolled back. With the transaction open, the db's ability to fulfill the creation of the link is confirmed.
   * Once confirmed, the assessment is created in the CM database. If this is successful, the transaction in the
   * NATCom database is commit, the connection is closed, and the new assessmentis returned.
   *
   * This process of creating the complaint links is handled here to accommodate this pseudo two phase commit
   * pattern.
   */
  linkComplaintsAndRunQuery = async (token: string, model: CaseFileDto, assessmentInput: any, query: string) => {
    let returnValue;
    const dateLinkCreated = new Date();
    const complaintBeingLinkedId = assessmentInput.leadIdentifier;
    const linkingToComplaintId = assessmentInput.assessmentDetails.actionLinkedComplaintIdentifier;
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const idir = getIdirFromRequest(this.request);
      // If actionLinkedComplaintIdentifier is present the link must be created in the database
      if (assessmentInput.assessmentDetails.actionLinkedComplaintIdentifier) {
        // When linking complaint "A" to complant "B", if "A" is already linked to "B" then the link is not created.
        const existingLink = await this._linkedComplaintXrefRepository.findOne({
          relations: { linked_complaint_identifier: true, complaint_identifier: true },
          where: {
            linked_complaint_identifier: { complaint_identifier: complaintBeingLinkedId },
            active_ind: true,
          },
        });

        // If a link already exists and it has a different complaint identifier, mark it as inactive otherwise do nothing
        if (existingLink && existingLink.complaint_identifier.complaint_identifier !== linkingToComplaintId) {
          existingLink.active_ind = false;
          await this._linkedComplaintXrefRepository.save(existingLink);
        }

        if (existingLink?.complaint_identifier?.complaint_identifier !== linkingToComplaintId) {
          // When linking complaint "A" to complaint "B", if "A" already has other complaints linked to it those links
          // are marked as inactive, and new links are created with them pointing to "B".
          const trailingComplaints = await this._linkedComplaintXrefRepository
            .createQueryBuilder()
            .update(LinkedComplaintXref)
            .set({ active_ind: false })
            .where({
              complaint_identifier: complaintBeingLinkedId,
            })
            .andWhere({
              active_ind: true,
            })
            .returning("*")
            .execute();

          if (trailingComplaints.affected > 0) {
            trailingComplaints.raw.forEach(async (row) => {
              const linkString = this._linkedComplaintXrefRepository.create(<CreateLinkedComplaintXrefDto>{
                // ...row,
                complaint_identifier: { complaint_identifier: linkingToComplaintId },
                linked_complaint_identifier: row.linked_complaint_identifier,
                active_ind: true,
                create_user_id: idir,
                create_utc_timestamp: dateLinkCreated,
              });
              await queryRunner.manager.save(linkString);
            });
          }
          // Create the new link between the complaints
          let newLink = new CreateLinkedComplaintXrefDto();
          newLink = {
            ...newLink,
            complaint_identifier: <Complaint>{
              complaint_identifier: linkingToComplaintId,
            },
            linked_complaint_identifier: <Complaint>{ complaint_identifier: complaintBeingLinkedId },
            active_ind: true,
            create_user_id: idir,
            create_utc_timestamp: dateLinkCreated,
          };

          const complaintLinkString = this._linkedComplaintXrefRepository.create(newLink);
          await queryRunner.manager.save(complaintLinkString);
        }
      }

      // Update the status of the complaint to "closed" if actionCloseComplaint is set to true
      if (assessmentInput.assessmentDetails.actionCloseComplaint) {
        const statusCode = await this._codeTableService.getComplaintStatusCodeByStatus("CLOSED");
        await this._complaintsRepository
          .createQueryBuilder("complaint")
          .update()
          .set({ complaint_status_code: statusCode, update_user_id: idir })
          .where({ complaint_identifier: complaintBeingLinkedId })
          .execute();
      }

      // Update the assessment in the Case Management database
      const result = await post(token, {
        query: query,
        variables: model,
      });
      returnValue = await this.handleAPIResponse(result);
      // If the mutation succeeded, commit the pending transaction
      await queryRunner.commitTransaction();
    } catch (err) {
      this.logger.error(err);
      await queryRunner.rollbackTransaction();
      Promise.reject(new Error("An error occurred while linking the complaints. " + err));
    } finally {
      await queryRunner.release();
    }
    return returnValue;
  };

  async createAssessment(token: string, model: CaseFileDto): Promise<CaseFileDto> {
    let returnValue;

    // The model reaches this function in the shape { "createAssessmentInput": {...CaseFlieDTO} } despite that property
    // not existing in the CaseFileDTO type, which renders the CaseFile fields inside inaccessible in this scope.
    // For example, leadIdentifier would be found in model.leadIdentifier by the type's definition, however in this
    // scope it is at model.createAssessmentInput.leadIdentifier, which errors due to type violation.
    // This copies it into a new variable cast to any to allow access to the nested properties.
    let modelAsAny: any = { ...model };

    const query = `mutation CreateAssessment($createAssessmentInput: CreateAssessmentInput!) {
          createAssessment(createAssessmentInput: $createAssessmentInput)
          ${caseFileQueryFields}
        }`;

    // If changes need to be made in both databases (i.e. we need to create a link or change the status of a complaint)
    // then the transactional approach is taken.
    if (
      modelAsAny.createAssessmentInput.assessmentDetails.actionLinkedComplaintIdentifier ||
      modelAsAny.createAssessmentInput.assessmentDetails.actionCloseComplaint
    ) {
      returnValue = await this.linkComplaintsAndRunQuery(token, model, modelAsAny.createAssessmentInput, query);
    } else {
      // If the assessment is not linking two complaints then simply create the new assessment in CM.
      const result = await post(token, {
        query: query,
        variables: model,
      });
      returnValue = await this.handleAPIResponse(result);
    }

    return returnValue?.createAssessment;
  }

  updateAssessment = async (token: string, model: CaseFileDto): Promise<CaseFileDto> => {
    let returnValue;

    // The model reaches this function in the shape { "updateAssessmentInput": {...CaseFlieDTO} } despite that property
    // not existing in the CaseFileDTO type, which renders the CaseFile fields inside inaccessible in this scope.
    // For example, leadIdentifier would be found in model.leadIdentifier by the type's definition, however in this
    // scope it is at model.updateAssessmentInput.leadIdentifier, which errors due to type violation.
    // This copies it into a new variable cast to any to allow access to the nested properties.
    let modelAsAny: any = { ...model };

    const query = `mutation UpdateAssessment($updateAssessmentInput: UpdateAssessmentInput!) {
    updateAssessment(updateAssessmentInput: $updateAssessmentInput) 
    ${caseFileQueryFields}
    }`;

    // If changes need to be made in both databases (i.e. we need to create a link or change the status of a complaint)
    // then the transactional approach is taken.
    if (
      modelAsAny.updateAssessmentInput.assessmentDetails.actionLinkedComplaintIdentifier ||
      modelAsAny.updateAssessmentInput.assessmentDetails.actionCloseComplaint
    ) {
      returnValue = await this.linkComplaintsAndRunQuery(token, model, modelAsAny.updateAssessmentInput, query);
    } else {
      // If the assessment is not linking two complaints then simply update the assessment in CM.
      const result = await post(token, {
        query: query,
        variables: model,
      });
      returnValue = await this.handleAPIResponse(result);
    }
    return returnValue?.updateAssessment;
  };

  createReview = async (token: string, model: CaseFileDto): Promise<CaseFileDto> => {
    const result = await post(token, {
      query: `mutation CreateReview($reviewInput: ReviewInput!) {
        createReview(reviewInput: $reviewInput) 
        ${caseFileQueryFields}
      }`,
      variables: model,
    });
    const returnValue = await this.handleAPIResponse(result);
    const caseFileDTO = returnValue.createReview as CaseFileDto;
    try {
      if (caseFileDTO.isReviewRequired) {
        await this.complaintService.updateComplaintStatusById(
          caseFileDTO.leadIdentifier,
          ComplaintStatusCodeEnum.PENDING_REVIEW,
        );
      }
    } catch (error) {
      this.logger.error(error);
    }
    return caseFileDTO;
  };

  updateReview = async (token: string, model: any): Promise<CaseFileDto> => {
    const result = await post(token, {
      query: `mutation UpdateReview($reviewInput: ReviewInput!) {
        updateReview(reviewInput: $reviewInput) 
        ${caseFileQueryFields}
      }`,
      variables: model,
    });
    const returnValue = await this.handleAPIResponse(result);
    const caseFileDTO = returnValue.updateReview as CaseFileDto;
    try {
      if (model.reviewInput.isReviewRequired) {
        await this.complaintService.updateComplaintStatusById(
          model.reviewInput.leadIdentifier,
          ComplaintStatusCodeEnum.PENDING_REVIEW,
        );
      } else if (!model.reviewInput.isReviewRequired) {
        await this.complaintService.updateComplaintStatusById(
          model.reviewInput.leadIdentifier,
          ComplaintStatusCodeEnum.OPEN,
        );
      }
    } catch (error) {
      this.logger.error(error);
    }

    return caseFileDTO;
  };

  createPrevention = async (token: string, model: CaseFileDto): Promise<CaseFileDto> => {
    const result = await post(token, {
      query: `mutation CreatePrevention($createPreventionInput: CreatePreventionInput!) {
        createPrevention(createPreventionInput: $createPreventionInput) 
        ${caseFileQueryFields}
      }`,
      variables: model,
    });
    const returnValue = await this.handleAPIResponse(result);
    return returnValue?.createPrevention;
  };

  updatePrevention = async (token: string, model: CaseFileDto): Promise<CaseFileDto> => {
    const result = await post(token, {
      query: `mutation UpdatePrevention($updatePreventionInput: UpdatePreventionInput!) {
        updatePrevention(updatePreventionInput: $updatePreventionInput) 
        ${caseFileQueryFields}
      }`,
      variables: model,
    });
    const returnValue = await this.handleAPIResponse(result);
    return returnValue?.updatePrevention;
  };

  private handleAPIResponse = async (result: { response: AxiosResponse; error: AxiosError }): Promise<any> => {
    if (result?.response?.data?.data) {
      const caseFileDto = result.response.data.data;
      return caseFileDto;
    } else if (result?.response?.data?.errors) {
      this.logger.error(`Error occurred. ${JSON.stringify(result.response.data.errors)}`);
      return null;
    } else if (result?.error) {
      this.logger.error(`Error occurred. ${JSON.stringify(result.error)}`);
    } else {
      this.logger.error(`Unknwown error occurred during web request`);
      return null;
    }
  };

  createEquipment = async (token: string, model: CaseFileDto): Promise<CaseFileDto> => {
    const mutationQuery = {
      query: `mutation CreateEquipment($createEquipmentInput: CreateEquipmentInput!) {
        createEquipment(createEquipmentInput: $createEquipmentInput)
          ${caseFileQueryFields}
      }`,
      variables: model,
    };

    this.logger.debug(mutationQuery);

    const result = await post(token, mutationQuery);

    const returnValue = await this.handleAPIResponse(result);
    return returnValue?.createEquipment;
  };

  updateEquipment = async (token: string, model: CaseFileDto): Promise<CaseFileDto> => {
    const result = await post(token, {
      query: `mutation UpdateEquipment($updateEquipmentInput: UpdateEquipmentInput!) {
        updateEquipment(updateEquipmentInput: $updateEquipmentInput) 
        ${caseFileQueryFields}
      }`,
      variables: model,
    });
    const returnValue = await this.handleAPIResponse(result);
    return returnValue?.updateEquipment;
  };

  deleteEquipment = async (token: string, model: DeleteEquipmentDto): Promise<boolean> => {
    const result = await post(token, {
      query: `mutation DeleteEquipment($deleteEquipmentInput: DeleteEquipmentInput!) {
        deleteEquipment(deleteEquipmentInput: $deleteEquipmentInput) 
      }`,
      variables: {
        deleteEquipmentInput: model, // Ensure that the key matches the name of the variable in your mutation
      },
    });
    const returnValue = await this.handleAPIResponse(result);
    return returnValue;
  };

  createNote = async (token: any, model: CreateSupplementalNotesInput): Promise<CaseFileDto> => {
    const result = await post(token, {
      query: `mutation CreateNote($input: CreateSupplementalNoteInput!) {
        createNote(input: $input) {
          caseIdentifier
          note { note, action { actor,date,actionCode, actionId } }
        }
      }`,
      variables: { input: model },
    });

    const returnValue = await this.handleAPIResponse(result);
    return returnValue?.createNote;
  };

  updateNote = async (token: any, model: UpdateSupplementalNotesInput): Promise<CaseFileDto> => {
    const result = await post(token, {
      query: `mutation UpdateNote($input: UpdateSupplementalNoteInput!) {
        updateNote(input: $input) {
          caseIdentifier
          note { note, action { actor,date,actionCode, actionId } }
        }
      }`,
      variables: { input: model },
    });

    const returnValue = await this.handleAPIResponse(result);
    return returnValue?.updateNote;
  };

  deleteNote = async (token: any, model: DeleteSupplementalNotesInput): Promise<CaseFileDto> => {
    const result = await post(token, {
      query: `mutation DeleteNote($input: DeleteSupplementalNoteInput!) {
        deleteNote(input: $input) {
          caseIdentifier
          note { note, action { actor,date,actionCode, actionId } }
        }
      }`,
      variables: { input: model },
    });

    const returnValue = await this.handleAPIResponse(result);
    return returnValue?.deleteNote;
  };

  createWildlife = async (token: any, model: CreateWildlifeInput): Promise<CaseFileDto> => {
    const result = await post(token, {
      query: `mutation createWildlife($input: CreateWildlifeInput!) {
        createWildlife(input: $input) {
          caseIdentifier
        }
      }`,
      variables: { input: model },
    });

    const returnValue = await this.handleAPIResponse(result);
    return returnValue?.createWildlife;
  };

  updateWildlife = async (token: any, model: UpdateWildlifeInput): Promise<CaseFileDto> => {
    const result = await post(token, {
      query: `mutation updateWildlife($input: UpdateWildlifeInput!) {
        updateWildlife(input: $input) {
          caseIdentifier
        }
      }`,
      variables: { input: model },
    });

    const returnValue = await this.handleAPIResponse(result);
    return returnValue?.updateWildlife;
  };

  deleteWildlife = async (token: any, model: DeleteWildlifeInput): Promise<CaseFileDto> => {
    const result = await post(token, {
      query: `mutation DeleteWildlife($input: DeleteWildlifeInput!) {
        deleteWildlife(input: $input) {
          caseIdentifier
        }
      }`,
      variables: { input: model },
    });

    const returnValue = await this.handleAPIResponse(result);
    return returnValue?.deleteWildlife;
  };

  createDecision = async (token: any, model: CreateDecisionInput): Promise<CaseFileDto> => {
    const result = await post(token, {
      query: `mutation createDecision($input: CreateDecisionInput!) {
        createDecision(input: $input) {
          caseIdentifier
          decision { id }
        }
      }`,
      variables: { input: model },
    });

    const returnValue = await this.handleAPIResponse(result);
    return returnValue?.createDecision;
  };

  updateDecision = async (token: any, model: UpdateDecisionInput): Promise<CaseFileDto> => {
    const result = await post(token, {
      query: `mutation updateDecision($input: UpdateDecisionInput!) {
        updateDecision(input: $input) {
          caseIdentifier
          decision { id }
        }
      }`,
      variables: { input: model },
    });

    const returnValue = await this.handleAPIResponse(result);
    return returnValue?.updateDecision;
  };

  createAuthorizationOutcome = async (token: any, model: CreateAuthorizationOutcomeInput): Promise<CaseFileDto> => {
    const result = await post(token, {
      query: `mutation createAuthorizationOutcome($input: CreateAuthorizationOutcomeInput!) {
        createAuthorizationOutcome(input: $input) {
          caseIdentifier,
          authorization { id }
        }
      }`,
      variables: { input: model },
    });

    const returnValue = await this.handleAPIResponse(result);
    return returnValue?.createAuthorizationOutcome;
  };

  updateAuthorizationOutcome = async (token: any, model: UpdateAuthorizationOutcomeInput): Promise<CaseFileDto> => {
    const result = await post(token, {
      query: `mutation updateAuthorizationOutcome($input: UpdateAuthorizationOutcomeInput!) {
        updateAuthorizationOutcome(input: $input) {
          caseIdentifier
          authorization { id }
        }
      }`,
      variables: { input: model },
    });

    const returnValue = await this.handleAPIResponse(result);
    return returnValue?.updateAuthorizationOutcome;
  };

  deleteAuthorizationOutcome = async (token: any, model: DeleteAuthorizationOutcomeInput): Promise<CaseFileDto> => {
    const result = await post(token, {
      query: `mutation deleteAuthorizationOutcome($input: DeleteAuthorizationOutcomeInput!) {
        deleteAuthorizationOutcome(input: $input) {
          caseIdentifier
          authorization { id }
        }
      }`,
      variables: { input: model },
    });

    const returnValue = await this.handleAPIResponse(result);
    return returnValue?.deleteAuthorizationOutcome;
  };
}
