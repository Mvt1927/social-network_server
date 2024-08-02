import { Strategy as PassportStrategy } from 'passport-strategy';

import * as express from 'express';

// import { lookup } from './utils';
import {
  VerifyFunction,
  ICustomStrategy as ICustomStrategy,
} from './custom.strategy.dto';

// Định nghĩa interface cho các options

// Khai báo lớp Strategy
export class CustomStrategy
  extends PassportStrategy
  implements ICustomStrategy
{
  private _verify: VerifyFunction;
  constructor(verify: VerifyFunction) {
    if (!verify) {
      throw new TypeError('LocalStrategy requires a verify callback');
    }

    super(); // Gọi constructor của lớp cha
    this.name = 'local';
    this._verify = verify;
  }
  name: string;

  override authenticate(req: express.Request): void {
    const verified = (err: any, user?: any, info?: any) => {
      if (err) {
        return this.error(err);
      }
      if (!user) {
        return this.fail(info);
      }
      this.success(user, info);
    };

    try {
      (this._verify as VerifyFunction)(req.body, verified);
    } catch (ex) {
      return this.error(ex);
    }
  }
}
