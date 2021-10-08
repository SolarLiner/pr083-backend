import { Test, TestingModule } from '@nestjs/testing';
import { RequestUserService } from './request-user.service';

describe('RequestUserService', () => {
  let service: RequestUserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RequestUserService],
    }).compile();

    service = module.get<RequestUserService>(RequestUserService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
