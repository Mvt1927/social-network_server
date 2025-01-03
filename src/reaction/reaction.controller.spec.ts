import { Test, TestingModule } from '@nestjs/testing';
import { PostReactionController } from './reaction.controller';
import { PostReactionService } from './reaction.service';

describe('ReactionController', () => {
  let controller: PostReactionController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PostReactionController],
      providers: [PostReactionService],
    }).compile();

    controller = module.get<PostReactionController>(PostReactionController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
