import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
} from '@nestjs/common';
import { NotificationService } from './notification.service';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { UpdateNotificationDto } from './dto/update-notification.dto';
import { Roles } from 'src/roles/decorators/roles/roles.decorator';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { Role, User } from '@prisma/client';
import { JwtAccessGuard } from 'src/auth/guards/jwt-access/jwt-access.guard';
import { RolesGuard } from 'src/roles/guards/roles/roles.guard';
import { VerifyEmailGuard } from 'src/verification/guards/verify-email/verify-email.guard';
import { GetUser } from 'src/users/decorators/get-user/get-user.decorator';
import { NotificationData, NotificationPage, NotificationUnreadCount } from './entities/notification.entity';

@Controller('notification')
@ApiTags('Notification')
@UseGuards(JwtAccessGuard, VerifyEmailGuard)
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  // SWAGGER_DOCS:BEGINS
  @ApiOperation({ summary: 'Create a new notification - ADMIN' })
  @Roles(Role.ADMIN)
  @UseGuards(RolesGuard)
  @Post()
  create(@Body() createNotificationDto: CreateNotificationDto) {
    return this.notificationService.create(createNotificationDto);
  }

  // SWAGGER_DOCS:BEGINS
  @ApiOperation({ summary: 'Get all notifications' })
  @ApiQuery({ name: 'pageSize', required: false, type: Number, example: 10 })
  @ApiQuery({ name: 'cursor', required: false, type: String })
  @ApiBearerAuth('Access Token')
  // SWAGGER_DOCS:ENDS
  @Get()
  findAll(
    @GetUser() user: User,
    @Query('pageSize') pageSize: string = '10',
    @Query('cursor') cursor: string | undefined,
    @Query() query: Record<string, any> | any,
  ): Promise<NotificationPage> {
    return this.notificationService.findAll(user, +pageSize, cursor, query);
  }

  // SWAGGER_DOCS:BEGINS
  @ApiOperation({ summary: 'Get unread notification count' })
  @ApiBearerAuth('Access Token')
  // SWAGGER_DOCS:ENDS
  @Get('unread_count')
  getUnreadCount(@GetUser() user: User): Promise<NotificationUnreadCount> {
    return this.notificationService.getUnreadCount(user);
  }

  
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.notificationService.findOne(id);
  }

  // SWAGGER_DOCS:BEGINS
  @ApiOperation({ summary: 'Update a notification by id - ADMIN' })
  @Roles(Role.ADMIN)
  @UseGuards(RolesGuard)
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateNotificationDto: UpdateNotificationDto,
  ) {
    return this.notificationService.update(id, updateNotificationDto);
  }

  // SWAGGER_DOCS:BEGINS
  @ApiOperation({ summary: 'Mark a notification as read' })
  @ApiBearerAuth('Access Token')
  @ApiParam({ name: 'id', required: true, type: String })
  // SWAGGER_DOCS:ENDS
  @Patch('read')
  markAsRead(@Param('id') id: string, @GetUser() user: User): Promise<NotificationData> {
    return this.notificationService.markAsRead(id, user);
  }

  // SWAGGER_DOCS:BEGINS
  @ApiOperation({ summary: 'Delete a notification by id - ADMIN' })
  // SWAGGER_DOCS:ENDS
  @Roles(Role.ADMIN)
  @UseGuards(JwtAccessGuard, RolesGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.notificationService.remove(id);
  }
}
