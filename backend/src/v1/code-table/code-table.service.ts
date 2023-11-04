import { Injectable, Logger } from "@nestjs/common";
import CodeTable, { Agency } from "../../types/models/code-tables";
import { InjectRepository } from "@nestjs/typeorm";
import { AgencyCode } from "../agency_code/entities/agency_code.entity";
import { Repository } from "typeorm";

@Injectable()
export class CodeTableService {
  private readonly logger = new Logger(CodeTableService.name);

  @InjectRepository(AgencyCode)
  private _agencyRepository: Repository<AgencyCode>;

  getCodeTableByName = async (table: string): Promise<CodeTable[]> => {
    switch (table) {
      case "agency": {
        const data = await this._agencyRepository.find();
        let results = data.map(({agency_code, short_description, long_description, display_order, active_ind }) => { 
          let table: Agency = { 
              agencyCode: agency_code,
              shortDescription: short_description,
              longDescription: long_description,
              displayOrder: display_order,
              isActive: active_ind
          }
          return table
        })

        return results;
      }
    }
  };
}
