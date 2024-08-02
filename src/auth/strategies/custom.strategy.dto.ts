import { Strategy as PassportStrategy } from 'passport-strategy';
import express = require('express');
import { SignInAuthWithUsernameDto } from '../dto';

export interface IVerifyOptions {
  message: string;
}

export interface VerifyFunctionWithRequest {
  (req: express.Request, dto: SignInAuthWithUsernameDto): void;
}

export interface VerifyFunction {
  (
    dto: any,
    done: (
      error: any,
      user?: Express.User | false,
      options?: IVerifyOptions,
    ) => void,
  ): void;
}

export declare class ICustomStrategy extends PassportStrategy {
  constructor(verify: VerifyFunction);

  name: string;
}
