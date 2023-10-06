import { BadRequestException, Injectable, Logger } from "@nestjs/common";
import { CreatePersonComplaintXrefDto } from "./dto/create-person_complaint_xref.dto";
import { PersonComplaintXref } from "./entities/person_complaint_xref.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { DataSource, QueryRunner, Repository } from "typeorm";

@Injectable()
export class PersonComplaintXrefService {
  constructor(private dataSource: DataSource) {}
  @InjectRepository(PersonComplaintXref)
  private personComplaintXrefRepository: Repository<PersonComplaintXref>;

  private readonly logger = new Logger(PersonComplaintXrefService.name);

  async create(
    createPersonComplaintXrefDto: CreatePersonComplaintXrefDto
  ): Promise<PersonComplaintXref> {
    const newPersonComplaintXref = this.personComplaintXrefRepository.create(
      createPersonComplaintXrefDto
    );
    return newPersonComplaintXref;
  }

  async findAll(): Promise<PersonComplaintXref[]> {
    return this.personComplaintXrefRepository.find({
      relations: {
        person_guid: true,
        complaint_identifier: true,
      },
    });
  }

  async findOne(person_complaint_xref_guid: any): Promise<PersonComplaintXref> {
    return this.personComplaintXrefRepository.findOne({
      where: { personComplaintXrefGuid: person_complaint_xref_guid },
      relations: {
        person_guid: true,
        complaint_identifier: true,
      },
    });
  }

  async findByComplaint(
    complaint_identifier: any
  ): Promise<PersonComplaintXref> {
    return this.personComplaintXrefRepository.findOne({
      where: { complaint_identifier: complaint_identifier, active_ind: true },
      relations: {
        person_guid: true,
        complaint_identifier: true,
      },
    });
  }

  async findAssigned(
    person_guid: string,
    complaint_identifier: string
  ): Promise<PersonComplaintXref> {
    return this.personComplaintXrefRepository.createQueryBuilder('personComplaintXref')
    .leftJoinAndSelect('personComplaintXref.person_guid', 'person_guid')
    .leftJoinAndSelect('personComplaintXref.complaint_identifier','complaint_identifier')
    .where('personComplaintXref.person_guid = :person_guid', {person_guid})
    .andWhere('personComplaintXref.complaint_identifier = :complaint_identifier', {complaint_identifier})
    .andWhere('personComplaintXref.person_complaint_xref_code = :person_complaint_xref_code', {person_complaint_xref_code: "ASSIGNEE"})
    .andWhere('personComplaintXref.active_ind = :active_ind', {active_ind: true})
    .getOne();
  }

  async update(
    //queryRunner: QueryRunner, 
    person_complaint_xref_guid: any,
    updatePersonComplaintXrefDto
  ): Promise<PersonComplaintXref> {
    const updatedValue = await this.personComplaintXrefRepository.update(
      person_complaint_xref_guid,
      updatePersonComplaintXrefDto
    );
    //queryRunner.manager.save(updatedValue);
    return this.findOne(person_complaint_xref_guid);
  }

  /**
   * Assigns an officer to a complaint.  This will perform one of two operations.
   * If the existing complaint is not yet assigned to an officer, then this will create a new complaint/officer cross reference.
   * As such, this exists as a queryRunner transaction.  If there's an exception, the entire transcation is rolled back.
   *
   * If the complaint is already assigned to an officer and the intention is to reassign the complaint to another officer, then first deactivate the first assignment and then
   * create a new cross reference between the complaint and officer.
   */
  async assignOfficer(
    complaintIdentifier: string,
    createPersonComplaintXrefDto: CreatePersonComplaintXrefDto
  ): Promise<PersonComplaintXref> {
    this.logger.debug(`Assigning Complaint ${complaintIdentifier}`);
    const queryRunner = this.dataSource.createQueryRunner();
    let newPersonComplaintXref: PersonComplaintXref;
    let unassignedPersonComplaintXref: PersonComplaintXref;

    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // unassign complaint if it's already assigned to an officer
      unassignedPersonComplaintXref = await this.findByComplaint(
        complaintIdentifier
      );
      if (unassignedPersonComplaintXref) {
        this.logger.debug(
          `Unassigning existing person from complaint ${unassignedPersonComplaintXref?.complaint_identifier?.complaint_identifier}`
        );
        unassignedPersonComplaintXref.active_ind = false;
        await queryRunner.manager.save(unassignedPersonComplaintXref);
      }
      // create a new complaint assignment record
      newPersonComplaintXref = await this.create(createPersonComplaintXrefDto);
      this.logger.debug(
        `Updating assignment on complaint ${complaintIdentifier}`
      );

      // save the transaction
      await queryRunner.manager.save(newPersonComplaintXref);
      await queryRunner.commitTransaction();
      this.logger.debug(
        `Successfully assigned person to complaint ${complaintIdentifier}`
      );
    } catch (err) {
      this.logger.error(err);
      this.logger.error(
        `Rolling back assignment on complaint ${complaintIdentifier}`
      );
      await queryRunner.rollbackTransaction();
      throw new BadRequestException(err);
    } finally {
      await queryRunner.release();
    }
    return newPersonComplaintXref;
  }

  remove(id: string) {
    return `This action removes a #${id} personComplaintXref`;
  }
}
