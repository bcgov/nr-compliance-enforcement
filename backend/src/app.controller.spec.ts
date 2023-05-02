import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { JwtAuthGuard } from './auth/jwtauth.guard';
import { JwtRoleGuard } from './auth/jwtrole.guard';
import { ROUTE_ARGS_METADATA } from '@nestjs/common/constants';

describe('AppController', () => {
  let appController: AppController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [AppService],
    }).compile();

    appController = app.get<AppController>(AppController);
  });

  describe('root', () => {
    it('should return "Hello Backend!"', () => {
      expect(appController.getHello()).toBe('Hello Backend!');
    });

    it('should ensure the JwtRoleGuard is applied to the app class', async () => {
      const guards = Reflect.getMetadata('__guards__', AppController);
      const guard = new (guards[0]);
    
      expect(guard).toBeInstanceOf(JwtRoleGuard);
    });

  });
});
