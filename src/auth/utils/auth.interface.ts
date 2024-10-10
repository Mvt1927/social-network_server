import { IResponseError, IResponseSuccess } from 'src/interfaces/interface';
import { UserWithoutHiddenAttributes } from 'src/users/utils';
// import { IResponseError, IResponseSuccess } from 'src/utils';

export interface IAuthResponseSuccess extends IResponseSuccess {
  data: {
    token: string;
    refreshToken: string;
    user: Partial<UserWithoutHiddenAttributes>;
  };
}
export interface IAuthResponseError extends IResponseError {}

export type AuthResponse = IAuthResponseSuccess | IAuthResponseError;
