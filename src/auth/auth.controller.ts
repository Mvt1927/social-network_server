import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { ApiBody, ApiOperation, ApiParam, ApiQuery, ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { RegisterAuthDto, SignInAuthWithUsernameDto } from './dto/auth.dto';
import { User } from '@prisma/client';

type AuthResponse = any;

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @ApiOperation({ summary: 'Sign in with username or email' })
  @ApiQuery({ type: SignInAuthWithUsernameDto })
  @ApiBody({ type: SignInAuthWithUsernameDto })
  @UseGuards(LocalAuthGuard)
  @HttpCode(HttpStatus.OK)
  @Post('signin')
  async signinWithUsername(
    @Request() req: { user: User },
  ): Promise<AuthResponse> {
    return this.authService.signin(req.user);
  }

  @ApiOperation({ summary: 'Register a new user' })
  @ApiQuery({ type: RegisterAuthDto })
  @Post('signup')
  async signup(@Body() dto: RegisterAuthDto): Promise<any> {
    return this.authService.register(dto);
  }

  // @Get(':id')
  // async getUser(@Param() param: any): Promise<any> {
  //   return this.authService.test(param.id);
  // }
}
