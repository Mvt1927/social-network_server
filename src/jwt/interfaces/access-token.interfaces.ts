import { ITokenBase } from './token.interfaces';

export interface IAccessPayload {
  id: string;
}

export interface IAccessToken extends ITokenBase, IAccessPayload {}
