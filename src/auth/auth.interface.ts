import { IResponseError, IResponseSuccess } from '../utils/interface';
import { UserWithoutHash } from 'src/users/user.type';

export interface IAuthResponseSuccess extends IResponseSuccess {
  data: {
    token: string;
    refreshToken: string;
    user: Partial<UserWithoutHash>;
  };
}
export interface IAuthResponseError extends IResponseError {}

export type AuthResponse = IAuthResponseSuccess | IAuthResponseError;
