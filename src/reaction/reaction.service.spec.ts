import { Test, TestingModule } from '@nestjs/testing';
import { PostReactionService } from './reaction.service';

describe('ReactionService', () => {
  let service: PostReactionService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PostReactionService],
    }).compile();

    service = module.get<PostReactionService>(PostReactionService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
