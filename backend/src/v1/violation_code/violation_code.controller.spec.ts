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
  
  it('should return 201 when a POST is called successfully', () => {

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

  it('should return 200 when a GET is called successfully', async () => {
    let response = await request(app.getHttpServer()).get('/violation-code/AINVSPC/');

    expect(response.statusCode).toBe(200);

    response = await request(app.getHttpServer()).get('/violation-code/');

    expect(response.statusCode).toBe(200);
  });

  it('should return 200 when a PATCH is called successfully', () => {

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

  it('should return 201 when a DELETE is called successfully', () => {
     return request(app.getHttpServer())
      .delete('/violation-code/AINVSPC/')
      .expect(200)
  });

});
