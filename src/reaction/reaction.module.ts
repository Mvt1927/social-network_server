import { Module } from '@nestjs/common';
import { PostReactionService } from './reaction.service';
import { PostReactionController } from './reaction.controller';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  imports: [
    PrismaModule,
  ],
  controllers: [PostReactionController],
  providers: [PostReactionService],
})
export class ReactionModule {}
