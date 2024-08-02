import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { SignInAuthWithUsernameDto } from '../dto';
import { ClassConstructor } from 'class-transformer';

@Injectable()
export class LocalAuthGuard<T extends object> extends AuthGuard('local') {
  constructor(
    private cls: ClassConstructor<T> = SignInAuthWithUsernameDto as ClassConstructor<T>,
  ) {
    super();
  }
}
