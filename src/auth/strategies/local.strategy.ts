import { PassportStrategy } from '@nestjs/passport';
import { AuthService } from '../auth.service';
import { BadRequestException, Injectable } from '@nestjs/common';
import { SignInAuthWithEmailDto, SignInAuthWithUsernameDto } from '../dto';
import { CustomStrategy } from './custom.strategy';
import { plainToClass } from 'class-transformer';
import { validate } from 'class-validator';
import {
  VALIDATOR_OPTIONS,
  getValidationErrorWithLeastErrors,
} from 'src/utils';

@Injectable()
export class LocalStrategy extends PassportStrategy(CustomStrategy) {
  constructor(private readonly authService: AuthService) {
    super();
  }

  async validate(dto: any): Promise<any> {
    const usernameBody = plainToClass(SignInAuthWithUsernameDto, dto);
    const usernameBodyErrors = await validate(usernameBody, VALIDATOR_OPTIONS);

    if (usernameBodyErrors.length === 0) {
      return await this.authService.validateUserByUsername(usernameBody);
    }

    const emailBody = plainToClass(SignInAuthWithEmailDto, dto);
    const emailBodyErrors = await validate(emailBody, VALIDATOR_OPTIONS);

    if (emailBodyErrors.length === 0) {
      return await this.authService.validateUserByEmail(emailBody);
    }

    throw new BadRequestException(
      getValidationErrorWithLeastErrors([usernameBodyErrors, emailBodyErrors]),
    );
  }
}
