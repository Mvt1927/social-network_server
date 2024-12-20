import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { LoginAuthDto, RegisterAuthDto } from './dto/auth.dto';
import { JwtAccessGuard } from './guards/jwt-access/jwt-access.guard';
import { GetUser } from 'src/users/decorators/get-user/get-user.decorator';
import { UserWithoutHiddenAttributes } from 'src/users/types';
import { GetTokenPayload } from 'src/jwt/decorators/get-token-payload/get-token-payload.decorator';
import { GetToken } from 'src/jwt/decorators/get-token/get-token.decorator';
import { LogoutDto } from './dto/logout.dto';
import { JwtConfirmGuard } from './guards/jwt-confirm/jwt-confirm.guard';
import { email } from '@snaplet/copycat/dist/email';
import { VerifyEmailGuard } from 'src/verification/guards/verify-email/verify-email.guard';
import { User } from '@prisma/client';
import { JwtRefreshGuard } from './guards/jwt-refresh/jwt-refresh.guard';

type AuthResponse = any;
// SWAGGER_DOCS:BEGINS
@ApiTags('Authentication')
@Controller('auth')
// SWAGGER_DOCS:ENDS
export class AuthController {
  constructor(private authService: AuthService) {}

  // SWAGGER_DOCS:BEGINS
  @ApiOperation({ summary: 'Sign in with username or email' })
  @ApiBody({ type: LoginAuthDto })
  // SWAGGER_DOCS:ENDS
  @HttpCode(HttpStatus.OK)
  @Post('signin')
  async signin(@Body() dto: LoginAuthDto): Promise<AuthResponse> {
    return this.authService.signin(dto);
  }

  // SWAGGER_DOCS:BEGINS
  @ApiOperation({ summary: 'Refresh access token' })
  @ApiBearerAuth('Refresh Token')
  // SWAGGER_DOCS:ENDS
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtRefreshGuard)
  @Get('signin/refresh')
  async refresh(@GetUser() user: User,  @GetToken() token: string): Promise<AuthResponse> {
    return this.authService.refresh(user, token);
  }

  // SWAGGER_DOCS:BEGINS
  @ApiOperation({ summary: 'Register a new user' })
  @ApiBody({ type: RegisterAuthDto })
  // SWAGGER_DOCS:ENDS
  @HttpCode(HttpStatus.CREATED)
  @Post('signup')
  async signup(@Body() dto: RegisterAuthDto): Promise<any> {
    return this.authService.register(dto);
  }

  // SWAGGER_DOCS:BEGINS
  @ApiOperation({ summary: 'Get user profile' })
  // @ApiHeader({ name: 'Authorization', description: 'Bearer token' })
  @ApiBearerAuth('Access Token')
  // SWAGGER_DOCS:ENDS
  @HttpCode(HttpStatus.OK)
  @Get('profile')
  @UseGuards(JwtAccessGuard, VerifyEmailGuard)
  async profile(@GetUser() user: UserWithoutHiddenAttributes): Promise<any> {
    return this.authService.profile(user);
  }

  // SWAGGER_DOCS:BEGINS
  @ApiOperation({ summary: 'Logout' })
  @ApiBearerAuth('Access Token')
  // SWAGGER_DOCS:ENDS
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAccessGuard)
  @Post('logout')
  async logout(
    @GetToken() token: string,
    @Body() logoutDto: LogoutDto,
  ): Promise<any> {
    return this.authService.logout(token, logoutDto);
  }

  @UseGuards(JwtAccessGuard)
  @HttpCode(HttpStatus.OK)
  @Post('test')
  async test(@GetUser() user: User): Promise<any> {
    return this.authService.sendVerificationEmail(user);
  }
  
  // SWAGGER_DOCS:BEGINS
  @ApiOperation({ summary: 'Verify email with token' })
  @ApiBearerAuth('Confirmation Token')
  // SWAGGER_DOCS:ENDS

  @UseGuards(JwtConfirmGuard)
  @HttpCode(HttpStatus.OK)
  @Post('verify')
  async verifyWithToken(@GetUser() user: UserWithoutHiddenAttributes, @GetTokenPayload() tokenPayload: any): Promise<any> {
    return this.authService.verifyWithToken(user, tokenPayload);
  }

  // SWAGGER_DOCS:BEGINS
  @ApiOperation({ summary: 'Verify email with code' })
  @ApiBearerAuth('Access Token')
  // SWAGGER_DOCS:ENDS
  @UseGuards(JwtAccessGuard)
  @HttpCode(HttpStatus.OK)
  @Post('verify/:code')
  async verifyWithCode(@GetUser() user: UserWithoutHiddenAttributes, @Param('code') code: string): Promise<any> {
    return this.authService.verifyWithCode(user, code);
  }
}
