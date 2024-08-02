export enum SignInAuthTokenType {
  GOOGLE = 'google',
  FACEBOOK = 'facebook',
  JWT = 'jwt',
}
export enum TokenExpiresIn {
  D365 = '365d',
  D30 = '30d',
  D1 = '1d',
  H1 = '1h',
  M15 = '15m',
  S30 = '30s',
}

export const SALT_ROUNDS = 10;
