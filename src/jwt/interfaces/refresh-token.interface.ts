import { IEmailPayload } from './email-token.interfaces';
import { ITokenBase } from './token.interfaces';

export interface IRefreshPayload extends IEmailPayload {
  tokenId: string;
}

export interface IRefreshToken extends IRefreshPayload, ITokenBase {}
