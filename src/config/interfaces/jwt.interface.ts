export interface ISingleJwt {
  secret: string;
  time: number;
}

export interface IAccessJwt {
  publicKey: string;
  privateKey: string;
  time: number;
}

export interface IJwt {
  secret: string;
  access: ISingleJwt;
  confirmation: ISingleJwt;
  resetPassword: ISingleJwt;
  refresh: ISingleJwt;
}
