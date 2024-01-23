import { Controller, Get, Query } from '@nestjs/common';
import { CaseManangementService } from './case_management.service';
import { Roles } from '../../auth/decorators/roles.decorator';
import { Role } from '../../enum/role.enum';

@Controller('case-management')
export class CaseManangementController {
  constructor(private readonly caseManagementService: CaseManangementService) {}

  @Get('/get-hello')
  @Roles(Role.COS_OFFICER)
  findAll() {
    return this.caseManagementService.findAll();
  }

}
