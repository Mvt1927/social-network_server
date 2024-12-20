import { Injectable } from '@nestjs/common';
import { CreateMessageDto } from './dto/create-message.dto';
import { UpdateMessageDto } from './dto/update-message.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class MessageService {
  constructor(
    // Inject PrismaService
    private readonly prismaService: PrismaService,
  ) {}

  create(createMessageDto: CreateMessageDto) {
    return 'This action adds a new message';
  }

  findAll() {
    return this.prismaService.message.findMany();
  }

  findOne(id: string) {
    return this.prismaService.message.findUnique({
      where: { id: id },
    });
  }

  update(id: number, updateMessageDto: UpdateMessageDto) {
    return `This action updates a #${id} message`;
  }

  remove(id: number) {
    return `This action removes a #${id} message`;
  }
}
