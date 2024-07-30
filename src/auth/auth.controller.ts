import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { ApiExtraModels, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import {
  SignInAuthWithEmailDto,
  SignInAuthWithTokenDto,
  SignInAuthWithUsernameDto,
} from './dto';
import { LocalAuthGuard } from './guards/local-auth.guard';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @HttpCode(HttpStatus.OK)
  @Post(['signin', 'signin/username'])
  async signinWithUsername(
    @Request() req,
    // @Body() signinDto: SignInAuthWithUsernameDto,
  ): Promise<any> {
    console.log(req);
    return this.authService.signin(req.user);
  }

  @HttpCode(HttpStatus.OK)
  @Post('signin/email')
  async signinWithEmail(
    @Body()
    signinDto: SignInAuthWithEmailDto,
  ): Promise<any> {
    // console.log(typeof signinDto);
    // return this.authService.signin(signinDto);
  }

  @HttpCode(HttpStatus.OK)
  @Post('signin/token')
  async signinWithToken(
    @Body()
    signinDto: SignInAuthWithTokenDto,
  ): Promise<any> {
    // console.log(typeof signinDto);
    // return this.authService.signin(signinDto);
  }
}
