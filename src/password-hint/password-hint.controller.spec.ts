import { Test, TestingModule } from '@nestjs/testing';
import { PasswordHintController } from './password-hint.controller';
import { PasswordHintService } from './password-hint.service';

describe('PasswordHintController', () => {
  let controller: PasswordHintController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PasswordHintController],
      providers: [PasswordHintService],
    }).compile();

    controller = module.get<PasswordHintController>(PasswordHintController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
