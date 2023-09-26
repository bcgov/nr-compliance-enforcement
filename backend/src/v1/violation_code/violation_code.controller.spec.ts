import { Test, TestingModule } from '@nestjs/testing';
import { ViolationCodeController } from './violation_code.controller';
import { ViolationCodeService } from './violation_code.service';
import { ViolationCode } from './entities/violation_code.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ViolationCodeRepositoryMockFactory } from '../../../test/mocks/violationCodeRepositoryMockFactory';
import { authGuardMock } from '../../../test/mocks/authGuardMock';
import { roleGuardMock } from '../../../test/mocks/roleGuardMock';
import { JwtAuthGuard } from '../../auth/jwtauth.guard'
import { JwtRoleGuard } from '../../auth/jwtrole.guard'
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';

describe('ViolationCodeController', () => {
  let app: INestApplication;
  let controller: ViolationCodeController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ViolationCodeController],
      providers: [ViolationCodeService,
        {
          provide: getRepositoryToken(ViolationCode), 
          useFactory: ViolationCodeRepositoryMockFactory,
        },
      ],
    })
    .overrideGuard(JwtAuthGuard)
    .useValue( {authGuardMock} )
    .overrideGuard(JwtRoleGuard)
    .useValue({ roleGuardMock }).compile();

    app = module.createNestApplication();
    await app.init();
    controller = module.get<ViolationCodeController>(ViolationCodeController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should fetch all violation codes', () => {
    return request(app.getHttpServer())
      .get('/violation-code/')
      .expect(200)
  });

  it('should create a violation code', () => {

    const violationCodeDto = { 
                                violation_code: "NEWCODE",
                                short_description: "New description",
                                long_description: "New long description",
                                display_order: "10",
                                active_ind: "Y"
                              };

    return request(app.getHttpServer())
      .post('/violation-code/')
      .send({violationCodeDto})
      .expect(201)
  });

  it('should fetch a single violation codes', () => {
    return request(app.getHttpServer())
      .get('/violation-code/AINVSPC/')
      .expect(200)
  });

  it('should update a violation code', () => {

    const violationCodeDto = { 
                                violation_code: "NEWCODE",
                                short_description: "New description",
                                long_description: "New long description",
                                display_order: "10",
                                active_ind: "Y"
                              };

    return request(app.getHttpServer())
      .patch('/violation-code/AINVSPC/')
      .send({violationCodeDto})
      .expect(200)
  });

  it('should remove a single violation codes', () => {
    return request(app.getHttpServer())
      .delete('/violation-code/AINVSPC/')
      .expect(200)
  });

});
