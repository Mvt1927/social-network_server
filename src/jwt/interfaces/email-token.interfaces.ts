import { IAccessPayload } from './access-token.interfaces';
import { ITokenBase } from './token.interfaces';

export interface IEmailPayload extends IAccessPayload {
  version: number;
}

export interface IEmailToken extends IEmailPayload, ITokenBase {}
