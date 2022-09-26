import { Test, TestingModule } from '@nestjs/testing';
import { PasswordHintService } from './password-hint.service';

describe('PasswordHintService', () => {
  let service: PasswordHintService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PasswordHintService],
    }).compile();

    service = module.get<PasswordHintService>(PasswordHintService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
