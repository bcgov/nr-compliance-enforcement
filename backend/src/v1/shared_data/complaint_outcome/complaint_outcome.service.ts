import { Inject, Injectable, Logger, Scope } from "@nestjs/common";
import { InjectMapper } from "@automapper/nestjs";
import { Mapper } from "@automapper/core";
import { caseFileQueryFields, get, post } from "../../../external_api/shared_data";
import { ComplaintOutcomeDto } from "src/types/models/case-files/complaint-outcome";
import { REQUEST } from "@nestjs/core";
import { AxiosResponse, AxiosError } from "axios";
import { CreateNoteInput } from "../../../types/models/case-files/notes/create-note-input";
import { UpdateNoteInput } from "../../../types/models/case-files/notes/update-note-input";
import { DeleteNoteInput } from "../../../types/models/case-files/notes/delete-note-input";
import { ComplaintService } from "../../complaint/complaint.service";
import { ComplaintStatusCodeEnum } from "../../../enum/complaint_status_code.enum";
import { DeleteEquipmentDto } from "../../../types/models/case-files/equipment/delete-equipment-dto";
import { CreateWildlifeInput } from "../../../types/models/case-files/wildlife/create-wildlife-input";
import { DeleteWildlifeInput } from "../../../types/models/case-files/wildlife/delete-wildlife-outcome";
import { UpdateWildlifeInput } from "../../../types/models/case-files/wildlife/update-wildlife-input";
import { CreateDecisionInput } from "src/types/models/case-files/ceeb/decision/create-decision-input";
import { UpdateDecisionInput } from "src/types/models/case-files/ceeb/decision/update-decison-input";
import { CreateAuthorizationOutcomeInput } from "src/types/models/case-files/ceeb/site/create-authorization-outcome-input";
import { UpdateAuthorizationOutcomeInput } from "src/types/models/case-files/ceeb/site/update-authorization-outcome-input";
import { DeleteAuthorizationOutcomeInput } from "src/types/models/case-files/ceeb/site/delete-authorization-outcome-input";
import { DataSource, Repository } from "typeorm";
import { LinkedComplaintXref } from "../../linked_complaint_xref/entities/linked_complaint_xref.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { getIdirFromRequest } from "../../../common/get-idir-from-request";
import { CodeTableService } from "../../code-table/code-table.service";
import { Complaint } from "../../complaint/entities/complaint.entity";
import { CreateLinkedComplaintXrefDto } from "../../linked_complaint_xref/dto/create-linked_complaint_xref.dto";
import { ComplaintOutcomeError } from "../../../enum/complaint_outcome_error.enum";
import { CreateAssessmentInput } from "src/types/models/case-files/assessment/create-assessment-input";
import { UpdateAssessmentInput } from "src/types/models/case-files/assessment/update-assessment-input";
import { CreatePreventionInput } from "src/types/models/case-files/prevention/create-prevention-input";
import { UpdatePreventionInput } from "src/types/models/case-files/prevention/update-prevention-input";
import { DeletePreventionInput } from "src/types/models/case-files/prevention/delete-prevention-input";

@Injectable({ scope: Scope.REQUEST })
export class ComplaintOutcomeService {
  private readonly logger = new Logger(ComplaintOutcomeService.name);
  private readonly mapper: Mapper;

  constructor(
    @Inject(REQUEST) private readonly request: Request,
    @InjectMapper() mapper,
    private readonly complaintService: ComplaintService,
    private readonly _codeTableService: CodeTableService,
    private readonly dataSource: DataSource,
  ) {
    this.mapper = mapper;
  }

  find = async (complaint_id: string, token: string, req: any): Promise<ComplaintOutcomeDto> => {
    const { data, errors } = await get(token, {
      query: `{getComplaintOutcomeByComplaintId (complaintId: "${complaint_id}")
        ${caseFileQueryFields}
      }`,
    });

    if (errors) {
      this.logger.error("GraphQL errors:", errors);
      throw new Error("GraphQL errors occurred");
    }

    if (data?.getComplaintOutcomeByComplaintId?.complaintOutcomeGuid) {
      const ComplaintOutcomeDto = data.getComplaintOutcomeByComplaintId as ComplaintOutcomeDto;
      return ComplaintOutcomeDto;
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
  linkComplaintsAndRunQuery = async (token: string, assessmentInput: any, query: string) => {
    let returnValue;
    const dateLinkCreated = new Date();
    const complaintBeingLinkedId = assessmentInput.complaintId; //child complaint (A)
    let linkingToComplaintId = assessmentInput.assessment.actionLinkedComplaintIdentifier; //parent complaint (B)
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const idir = getIdirFromRequest(this.request);
      // If actionLinkedComplaintIdentifier is present the link must be created in the database
      if (linkingToComplaintId) {
        // When linking complaint "A" to complant "B", if "A" is already linked to "B" then the link is not created.
        const existingLink = await this._linkedComplaintXrefRepository.findOne({
          relations: { linked_complaint_identifier: true, complaint_identifier: true },
          where: {
            linked_complaint_identifier: { complaint_identifier: complaintBeingLinkedId },
            active_ind: true,
            link_type: "DUPLICATE",
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
            .andWhere({
              link_type: "DUPLICATE",
            })
            .returning("*")
            .execute();

          if (trailingComplaints.affected > 0) {
            trailingComplaints.raw.forEach(async (row) => {
              const linkString = this._linkedComplaintXrefRepository.create(<CreateLinkedComplaintXrefDto>{
                complaint_identifier: { complaint_identifier: linkingToComplaintId },
                linked_complaint_identifier: row.linked_complaint_identifier,
                link_type: "DUPLICATE",
                active_ind: true,
                create_user_id: idir,
                create_utc_timestamp: dateLinkCreated,
              });
              await queryRunner.manager.save(linkString);
            });
          }

          // check if complaint "B" has linked with (is a child of) other complaints
          const existingLinkOfParentComplaint = await this._linkedComplaintXrefRepository.findOne({
            relations: { linked_complaint_identifier: true, complaint_identifier: true },
            where: {
              linked_complaint_identifier: { complaint_identifier: linkingToComplaintId },
              active_ind: true,
              link_type: "DUPLICATE",
            },
          });

          //if complaint "B" is a child of complaint "C" -> link "A" directly to "C" (linkingToComplaintId now is "C")
          if (existingLinkOfParentComplaint?.complaint_identifier?.complaint_identifier) {
            linkingToComplaintId = existingLinkOfParentComplaint?.complaint_identifier?.complaint_identifier;
          }

          // Create the new link between the complaints
          let newLink = new CreateLinkedComplaintXrefDto();
          newLink = {
            ...newLink,
            complaint_identifier: <Complaint>{
              complaint_identifier: linkingToComplaintId,
            },
            linked_complaint_identifier: <Complaint>{ complaint_identifier: complaintBeingLinkedId },
            link_type: "DUPLICATE",
            active_ind: true,
            create_user_id: idir,
            create_utc_timestamp: dateLinkCreated,
          };

          const complaintLinkString = this._linkedComplaintXrefRepository.create(newLink);
          await queryRunner.manager.save(complaintLinkString);
        }
      }

      // Update the status of the complaint to "closed" if actionCloseComplaint is set to true
      if (assessmentInput.assessment.actionCloseComplaint) {
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
        variables: { input: assessmentInput },
      });
      returnValue = await this.handleAPIResponse(result, complaintBeingLinkedId);
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

  async createAssessment(token: string, model: CreateAssessmentInput): Promise<ComplaintOutcomeDto> {
    let returnValue;

    const query = `mutation CreateAssessment($input: CreateAssessmentInput!) {
          createAssessment(input: $input)
          ${caseFileQueryFields}
        }`;

    // If changes need to be made in both databases (i.e. we need to create a link or change the status of a complaint)
    // then the transactional approach is taken.
    if (model.assessment.actionLinkedComplaintIdentifier || model.assessment.actionCloseComplaint) {
      returnValue = await this.linkComplaintsAndRunQuery(token, model, query);
    } else {
      // If the assessment is not linking two complaints then simply create the new assessment in CM.
      const result = await post(token, {
        query: query,
        variables: { input: model },
      });

      returnValue = await this.handleAPIResponse(result, model.complaintId);
    }

    return returnValue?.createAssessment;
  }

  updateAssessment = async (token: string, model: UpdateAssessmentInput): Promise<ComplaintOutcomeDto> => {
    let returnValue;

    const query = `mutation UpdateAssessment($input: UpdateAssessmentInput!) {
    updateAssessment(input: $input) 
    ${caseFileQueryFields}
    }`;

    // If the assessment being updated has no action required or the justification is not duplicate, then check if there
    // was previously a link to another complaint. If there is, remove it.
    if (
      !model.assessment.actionNotRequired ||
      (model.assessment.actionJustificationCode && model.assessment.actionJustificationCode !== "DUPLICATE")
    ) {
      const existingLink = await this._linkedComplaintXrefRepository.findOne({
        relations: { linked_complaint_identifier: true, complaint_identifier: true },
        where: {
          linked_complaint_identifier: { complaint_identifier: model.complaintId },
          active_ind: true,
        },
      });

      if (existingLink) {
        existingLink.active_ind = false;
        await this._linkedComplaintXrefRepository.save(existingLink);
      }
    }
    // If changes need to be made in both databases (i.e. we need to create a link or change the status of a complaint)
    // then the transactional approach is taken.
    if (model.assessment.actionLinkedComplaintIdentifier || model.assessment.actionCloseComplaint) {
      returnValue = await this.linkComplaintsAndRunQuery(token, model, query);
    } else {
      // If the assessment is not linking two complaints then simply update the assessment in CM.
      const result = await post(token, {
        query: query,
        variables: { input: model },
      });
      returnValue = await this.handleAPIResponse(result, model.complaintId);
    }
    return returnValue?.updateAssessment;
  };

  createReview = async (token: string, model: ComplaintOutcomeDto): Promise<ComplaintOutcomeDto> => {
    const result = await post(token, {
      query: `mutation CreateReview($reviewInput: ReviewInput!) {
        createReview(reviewInput: $reviewInput) 
        ${caseFileQueryFields}
      }`,
      variables: model,
    });

    // The model reaches this function in the shape { "reviewInput": {...CaseFlieDTO} } despite that property
    // not existing in the ComplaintOutcomeDto type, which renders the CaseFile fields inside inaccessible in this scope.
    // For example, complaintId would be found in model.complaintId by the type's definition, however in this
    // scope it is at model.reviewInput.complaintId, which errors due to type violation.
    // This copies it into a new variable cast to any to allow access to the nested properties.
    let modelAsAny: any = { ...model };
    const returnValue = await this.handleAPIResponse(result, modelAsAny.reviewInput.complaintId);
    const ComplaintOutcomeDto = returnValue.createReview as ComplaintOutcomeDto;
    try {
      if (ComplaintOutcomeDto.isReviewRequired) {
        await this.complaintService.updateComplaintStatusById(
          ComplaintOutcomeDto.complaintId,
          ComplaintStatusCodeEnum.PENDING_REVIEW,
          token,
        );
      }
    } catch (error) {
      this.logger.error(error);
    }
    return ComplaintOutcomeDto;
  };

  updateReview = async (token: string, model: any): Promise<ComplaintOutcomeDto> => {
    const result = await post(token, {
      query: `mutation UpdateReview($reviewInput: ReviewInput!) {
        updateReview(reviewInput: $reviewInput) 
        ${caseFileQueryFields}
      }`,
      variables: model,
    });
    // The model reaches this function in the shape { "reviewInput": {...ComplaintOutcomeDTO} } despite that property
    // not existing in the ComplaintOutcomeDto type, which renders the CaseFile fields inside inaccessible in this scope.
    // For example, complaintId would be found in model.complaintId by the type's definition, however in this
    // scope it is at model.reviewInput.complaintId, which errors due to type violation.
    // This copies it into a new variable cast to any to allow access to the nested properties.
    let modelAsAny: any = { ...model };
    const returnValue = await this.handleAPIResponse(result, modelAsAny.reviewInput.complaintId);
    const ComplaintOutcomeDto = returnValue.updateReview as ComplaintOutcomeDto;
    try {
      if (model.reviewInput.isReviewRequired) {
        await this.complaintService.updateComplaintStatusById(
          model.reviewInput.complaintId,
          ComplaintStatusCodeEnum.PENDING_REVIEW,
          token,
        );
      } else if (!model.reviewInput.isReviewRequired) {
        await this.complaintService.updateComplaintStatusById(
          model.reviewInput.complaintId,
          ComplaintStatusCodeEnum.OPEN,
          token,
        );
      }
    } catch (error) {
      this.logger.error(error);
    }

    return ComplaintOutcomeDto;
  };

  createPrevention = async (token: string, model: CreatePreventionInput): Promise<ComplaintOutcomeDto> => {
    const result = await post(token, {
      query: `mutation CreatePrevention($input: CreatePreventionInput!) {
          createPrevention(input: $input)
          ${caseFileQueryFields}
        }`,
      variables: { input: model },
    });
    const returnValue = await this.handleAPIResponse(result, model.complaintId);
    return returnValue?.createPrevention;
  };

  updatePrevention = async (token: string, model: UpdatePreventionInput): Promise<ComplaintOutcomeDto> => {
    const result = await post(token, {
      query: `mutation UpdatePrevention($input: UpdatePreventionInput!) {
          updatePrevention(input: $input)
          ${caseFileQueryFields}
        }`,
      variables: { input: model },
    });

    const returnValue = await this.handleAPIResponse(result, model.complaintId);
    return returnValue?.updatePrevention;
  };

  deletePrevention = async (token: string, model: DeletePreventionInput): Promise<ComplaintOutcomeDto> => {
    this.logger.debug(`Deleting prevention with id ${model.id} for complaintId ${model.complaintId}`);
    const result = await post(token, {
      query: `mutation DeletePrevention($input: DeletePreventionInput!) {
          deletePrevention(input: $input)
          ${caseFileQueryFields}
        }`,
      variables: { input: model },
    });
    const returnValue = await this.handleAPIResponse(result, model.complaintId);
    return returnValue?.deletePrevention;
  };

  private readonly handleAPIResponse = async (
    result: { response: AxiosResponse; error: AxiosError },
    complaintId: string,
  ): Promise<any> => {
    if (result?.response?.data?.data) {
      // As per CE-1335 whenever the case data is updated we want to update the last updated date on the complaint table.
      // All Case Actions should call this method so this should work here.
      const ComplaintOutcomeDto = result.response.data.data;
      if (complaintId) {
        await this.complaintService.updateComplaintLastUpdatedDate(complaintId);
      }
      return ComplaintOutcomeDto;
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

  createEquipment = async (token: string, model: ComplaintOutcomeDto): Promise<ComplaintOutcomeDto> => {
    const mutationQuery = {
      query: `mutation CreateEquipment($createEquipmentInput: CreateEquipmentInput!) {
        createEquipment(createEquipmentInput: $createEquipmentInput)
          ${caseFileQueryFields}
      }`,
      variables: model,
    };

    const result = await post(token, mutationQuery);
    // The model reaches this function in the shape { "createEquipmentInput": {...CaseFlieDTO} } despite that property
    // not existing in the ComplaintOutcomeDto type, which renders the CaseFile fields inside inaccessible in this scope.
    // For example, complaintId would be found in model.complaintId by the type's definition, however in this
    // scope it is at model.createEquipmentInput.complaintId, which errors due to type violation.
    // This copies it into a new variable cast to any to allow access to the nested properties.
    let modelAsAny: any = { ...model };
    const returnValue = await this.handleAPIResponse(result, modelAsAny.createEquipmentInput.complaintId);
    return returnValue?.createEquipment;
  };

  updateEquipment = async (token: string, model: ComplaintOutcomeDto): Promise<ComplaintOutcomeDto> => {
    const result = await post(token, {
      query: `mutation UpdateEquipment($updateEquipmentInput: UpdateEquipmentInput!) {
        updateEquipment(updateEquipmentInput: $updateEquipmentInput) 
        ${caseFileQueryFields}
      }`,
      variables: model,
    });
    // The model reaches this function in the shape { "updateEquipmentInput": {...CaseFlieDTO} } despite that property
    // not existing in the ComplaintOutcomeDto type, which renders the CaseFile fields inside inaccessible in this scope.
    // For example, complaintId would be found in model.complaintId by the type's definition, however in this
    // scope it is at model.updateEquipmentInput.complaintId, which errors due to type violation.
    // This copies it into a new variable cast to any to allow access to the nested properties.
    let modelAsAny: any = { ...model };
    const returnValue = await this.handleAPIResponse(result, modelAsAny.updateEquipmentInput.complaintId);
    return returnValue?.updateEquipment;
  };

  deleteEquipment = async (token: string, model: DeleteEquipmentDto): Promise<boolean> => {
    const complaintId = model.complaintId;
    delete model.complaintId;
    const result = await post(token, {
      query: `mutation DeleteEquipment($deleteEquipmentInput: DeleteEquipmentInput!) {
        deleteEquipment(deleteEquipmentInput: $deleteEquipmentInput)
      }`,
      variables: {
        deleteEquipmentInput: model, // Ensure that the key matches the name of the variable in your mutation
      },
    });
    const returnValue = await this.handleAPIResponse(result, complaintId);
    return returnValue;
  };

  createNote = async (token: any, model: CreateNoteInput): Promise<ComplaintOutcomeDto> => {
    const result = await post(token, {
      query: `mutation CreateNote($input: CreateNoteInput!) {
        createNote(input: $input) {
          complaintOutcomeGuid
          notes { note, outcomeAgencyCode, actions { actor, date, actionCode, actionId } }
        }
      }`,
      variables: { input: model },
    });

    const returnValue = await this.handleAPIResponse(result, model.complaintId);
    return returnValue?.createNote;
  };

  updateNote = async (token: any, model: UpdateNoteInput): Promise<ComplaintOutcomeDto> => {
    const complaintId = model.complaintId;
    delete model.complaintId;
    const result = await post(token, {
      query: `mutation UpdateNote($input: UpdateNoteInput!) {
        updateNote(input: $input) {
          complaintOutcomeGuid
          notes { note, actions { actor, date, actionCode, actionId } }
        }
      }`,
      variables: { input: model },
    });

    const returnValue = await this.handleAPIResponse(result, complaintId);
    return returnValue?.updateNote;
  };

  deleteNote = async (token: any, model: DeleteNoteInput): Promise<ComplaintOutcomeDto> => {
    const complaintId = model.complaintId;
    delete model.complaintId;
    const result = await post(token, {
      query: `mutation DeleteNote($input: DeleteNoteInput!) {
        deleteNote(input: $input) {
          complaintOutcomeGuid
          notes { note, actions { actor, date, actionCode, actionId } }
        }
      }`,
      variables: { input: model },
    });
    const returnValue = await this.handleAPIResponse(result, complaintId);
    return returnValue?.deleteNote;
  };

  createWildlife = async (token: any, model: CreateWildlifeInput): Promise<ComplaintOutcomeDto> => {
    const result = await post(token, {
      query: `mutation createWildlife($input: CreateWildlifeInput!) {
        createWildlife(input: $input) {
          complaintOutcomeGuid
        }
      }`,
      variables: { input: model },
    });

    const returnValue = await this.handleAPIResponse(result, model.complaintId);
    return returnValue?.createWildlife;
  };

  updateWildlife = async (token: any, model: UpdateWildlifeInput): Promise<ComplaintOutcomeDto> => {
    const complaintId = model.complaintId;
    delete model.complaintId;
    const result = await post(token, {
      query: `mutation updateWildlife($input: UpdateWildlifeInput!) {
        updateWildlife(input: $input) {
          complaintOutcomeGuid
        }
      }`,
      variables: { input: model },
    });

    const returnValue = await this.handleAPIResponse(result, complaintId);
    return returnValue?.updateWildlife;
  };

  deleteWildlife = async (token: any, model: DeleteWildlifeInput): Promise<ComplaintOutcomeDto> => {
    const complaintId = model.complaintId;
    delete model.complaintId;
    const result = await post(token, {
      query: `mutation DeleteWildlife($input: DeleteWildlifeInput!) {
        deleteWildlife(input: $input) {
          complaintOutcomeGuid
        }
      }`,
      variables: { input: model },
    });

    const returnValue = await this.handleAPIResponse(result, complaintId);
    return returnValue?.deleteWildlife;
  };

  createDecision = async (
    token: any,
    model: CreateDecisionInput,
    req: any,
  ): Promise<ComplaintOutcomeDto | ComplaintOutcomeError> => {
    const { complaintId: leadId } = model;
    const caseFile = await this.find(leadId, token, req);

    if (caseFile?.decision?.actionTaken) {
      return ComplaintOutcomeError.DECISION_ACTION_EXIST;
    }

    const result = await post(token, {
      query: `mutation createDecision($input: CreateDecisionInput!) {
        createDecision(input: $input) {
          complaintOutcomeGuid
          decision { id }
        }
      }`,
      variables: { input: model },
    });

    const returnValue = await this.handleAPIResponse(result, leadId);
    return returnValue?.createDecision;
  };

  updateDecision = async (token: any, model: UpdateDecisionInput): Promise<ComplaintOutcomeDto> => {
    const complaintId = model.complaintId;
    delete model.complaintId;
    const result = await post(token, {
      query: `mutation updateDecision($input: UpdateDecisionInput!) {
        updateDecision(input: $input) {
          complaintOutcomeGuid
          decision { id }
        }
      }`,
      variables: { input: model },
    });

    const returnValue = await this.handleAPIResponse(result, complaintId);
    return returnValue?.updateDecision;
  };

  createAuthorizationOutcome = async (
    token: any,
    model: CreateAuthorizationOutcomeInput,
  ): Promise<ComplaintOutcomeDto> => {
    const result = await post(token, {
      query: `mutation createAuthorizationOutcome($input: CreateAuthorizationOutcomeInput!) {
        createAuthorizationOutcome(input: $input) {
          complaintOutcomeGuid,
          authorization { id }
        }
      }`,
      variables: { input: model },
    });

    const returnValue = await this.handleAPIResponse(result, model.complaintId);
    return returnValue?.createAuthorizationOutcome;
  };

  updateAuthorizationOutcome = async (
    token: any,
    model: UpdateAuthorizationOutcomeInput,
  ): Promise<ComplaintOutcomeDto> => {
    const complaintId = model.complaintId;
    delete model.complaintId;
    const result = await post(token, {
      query: `mutation updateAuthorizationOutcome($input: UpdateAuthorizationOutcomeInput!) {
        updateAuthorizationOutcome(input: $input) {
          complaintOutcomeGuid
          authorization { id }
        }
      }`,
      variables: { input: model },
    });

    const returnValue = await this.handleAPIResponse(result, complaintId);
    return returnValue?.updateAuthorizationOutcome;
  };

  deleteAuthorizationOutcome = async (
    token: any,
    model: DeleteAuthorizationOutcomeInput,
  ): Promise<ComplaintOutcomeDto> => {
    const complaintId = model.complaintId;
    delete model.complaintId;
    const result = await post(token, {
      query: `mutation deleteAuthorizationOutcome($input: DeleteAuthorizationOutcomeInput!) {
        deleteAuthorizationOutcome(input: $input) {
          complaintOutcomeGuid
          authorization { id }
        }
      }`,
      variables: { input: model },
    });

    const returnValue = await this.handleAPIResponse(result, complaintId);
    return returnValue?.deleteAuthorizationOutcome;
  };
}
