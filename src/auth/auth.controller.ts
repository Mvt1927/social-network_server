import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiHeader, ApiHeaders, ApiOperation, ApiParam, ApiQuery, ApiSecurity, ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { LoginAuthDto, RegisterAuthDto } from './dto/auth.dto';
import { User } from '@prisma/client';
import { JwtAccessGuard } from './guards/jwt-access/jwt-access.guard';
import { GetUser } from 'src/users/decorators/get-user/get-user.decorator';
import { UserHiddenAttributesType, UserWithoutHiddenAttributes } from 'src/users/types';

type AuthResponse = any;
// SWAGGER_DOCS:BEGINS
@ApiTags('Authentication')
@Controller('auth')
// SWAGGER_DOCS:ENDS
export class AuthController {
  constructor(private authService: AuthService) {}
  
  // SWAGGER_DOCS:BEGINS
  @ApiOperation({ summary: 'Sign in with username or email' })
  @ApiQuery({ type: LoginAuthDto })
  @ApiBody({ type: LoginAuthDto })
  // SWAGGER_DOCS:ENDS
  
  @HttpCode(HttpStatus.OK)
  @Post('signin')
  async signin(@Body() dto: LoginAuthDto ): Promise<AuthResponse> {
    return this.authService.signin(dto);
  }

  // SWAGGER_DOCS:BEGINS
  @ApiOperation({ summary: 'Register a new user' })
  @ApiQuery({ type: RegisterAuthDto })
  @ApiBody({ type: RegisterAuthDto })
  // SWAGGER_DOCS:ENDS

  @HttpCode(HttpStatus.CREATED)
  @Post('signup')
  async signup(@Body() dto: RegisterAuthDto): Promise<any> {
    return this.authService.register(dto);
  }

  // SWAGGER_DOCS:BEGINS
  @ApiOperation({ summary: 'Get user profile' })
  @ApiHeader({ name: 'Authorization', description: 'Bearer token' })
  @ApiBearerAuth()
  // SWAGGER_DOCS:ENDS

  @HttpCode(HttpStatus.OK)
  @Get('profile')
  @UseGuards(JwtAccessGuard)
  async profile(@GetUser() user: UserWithoutHiddenAttributes ): Promise<any> {
    return this.authService.profile(user);
  }
}
