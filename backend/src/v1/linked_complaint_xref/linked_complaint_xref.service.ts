import { Injectable, Logger } from "@nestjs/common";
import { CreateLinkedComplaintXrefDto } from "./dto/create-linked_complaint_xref.dto";
import { LinkedComplaintXref } from "./entities/linked_complaint_xref.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { DataSource, Repository } from "typeorm";

@Injectable()
export class LinkedComplaintXrefService {
  @InjectRepository(LinkedComplaintXref)
  private linkedComplaintXrefRepository: Repository<LinkedComplaintXref>;

  private readonly logger = new Logger(LinkedComplaintXrefService.name);

  constructor(private dataSource: DataSource) {}

  async create(createLinkedComplaintXrefDto: CreateLinkedComplaintXrefDto): Promise<LinkedComplaintXref> {
    const newLinkedComplaintXref = this.linkedComplaintXrefRepository.create(createLinkedComplaintXrefDto);
    return newLinkedComplaintXref;
  }

  async findByComplaintId(id): Promise<LinkedComplaintXref[]> {
    return this.linkedComplaintXrefRepository.find({
      where: {
        complaint_identifier: id,
        active_ind: true,
      },
      relations: {
        linked_complaint_identifier: true,
      },
    });
  }
}
