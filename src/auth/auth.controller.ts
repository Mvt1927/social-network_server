import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ApiBody, ApiOperation, ApiParam, ApiQuery, ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { LoginAuthDto, RegisterAuthDto } from './dto/auth.dto';

type AuthResponse = any;

@ApiTags('Authentication')
@Controller('auth')
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

  
}
